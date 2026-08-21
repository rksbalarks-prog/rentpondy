

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table, Badge, Modal, Button } from 'react-bootstrap';
import { FaTrash, FaUndo, FaInfoCircle, FaFileExcel, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import PhoneCell from './components/PhoneCell';

const BuyerAssistanceActive = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
const [baId, setBaId] = useState('');
  const [freeRaIds, setFreeRaIds] = useState(new Set());
  const [paidRaIds, setPaidRaIds] = useState(new Set());
  const [createdAtMap, setCreatedAtMap] = useState({});
  // Ra_Id → name of the admin who created the bill (used by the "Approved By" column).
  const [billCreatorMap, setBillCreatorMap] = useState({});
  // Month filter ('YYYY-MM', local time) — set by clicking a Yearly Dashboard card.
  const [monthFilter, setMonthFilter] = useState('');
  // Yearly dashboard (month-wise tenant counts)
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardYear, setDashboardYear] = useState('');
  // Bulk "Mark as Expired" selection
  const [selectedRaIds, setSelectedRaIds] = useState([]);
  const [showExpireModal, setShowExpireModal] = useState(false);
  const [expiring, setExpiring] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [res, freeRes, paidRes, allBillsRes, buyerAssistRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/raActive-buyerAssistance-all-plans-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/buyer-bills/free-with-assistance-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/buyer-bills/non-free-with-assistance-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/buyer-bills-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/fetch-buyer-assistance-rent`),
      ]);

      const freeIds = new Set((freeRes.data.data || []).map(item => item.buyerAssistance?.Ra_Id).filter(Boolean));
      const paidIds = new Set((paidRes.data.data || []).map(item => item.buyerAssistance?.Ra_Id).filter(Boolean));

      // Build Ra_Id → bill-creator name. The /free-with-assistance and
      // /non-free-with-assistance endpoints already sort by createdAt desc, so the
      // first hit per Ra_Id is the latest bill — exactly what we want for "Approved By".
      const creatorMap = {};
      const recordCreator = (raId, name) => {
        if (!raId || creatorMap[raId]) return;
        const trimmed = String(name || '').trim();
        if (trimmed) creatorMap[raId] = trimmed;
      };
      (freeRes.data.data || []).forEach(it => {
        const b = it.bill || {};
        recordCreator(it.buyerAssistance?.Ra_Id || b.Ra_Id, b.adminName || b.billCreatedBy);
      });
      (paidRes.data.data || []).forEach(it => {
        const b = it.bill || {};
        recordCreator(it.buyerAssistance?.Ra_Id || b.Ra_Id, b.adminName || b.billCreatedBy);
      });

      // Fill gaps from AllBuyerBills using paymentType
      const allBills = allBillsRes.data?.data || [];
      allBills.forEach(bill => {
        const raId = bill.Ra_Id;
        if (raId && !freeIds.has(raId) && !paidIds.has(raId)) {
          if (bill.paymentType?.toLowerCase() === 'free') {
            freeIds.add(raId);
          } else {
            paidIds.add(raId);
          }
        }
        // Also fall back to the all-bills feed for the creator name in case the
        // assistance-joined endpoints filtered the record out.
        recordCreator(raId, bill.adminName || bill.billCreatedBy);
      });

      setFreeRaIds(freeIds);
      setPaidRaIds(paidIds);
      setBillCreatorMap(creatorMap);

      const dateMap = {};
      (buyerAssistRes.data?.data || []).forEach(item => {
        if (item.Ra_Id && item.createdAt) {
          dateMap[item.Ra_Id] = item.createdAt;
        }
      });
      setCreatedAtMap(dateMap);

      // Hide soft-deleted records here — they belong on the Removed Tenant
      // page only. The backend still returns them in this feed, so we
      // strip them out before they enter component state.
      const activeOnly = (res.data.data || []).filter(item => !item.isDeleted);
      const sortedData = [...activeOnly].sort((a, b) => {
        const idA = parseInt(a.Ra_Id) || 0;
        const idB = parseInt(b.Ra_Id) || 0;
        return idB - idA; // Descending order
      });
      setData(sortedData);
      setFilteredData(sortedData);
    } catch (error) {
    }
  };
    const tableRef = useRef();
  
  const handlePrint = () => {
    const printContent = tableRef.current.innerHTML;
    const printWindow = window.open("", "", "width=1200,height=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Table</title>
          <style>
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: left; }
            th { background: #f0f0f0; }
            /* Selection checkboxes are a screen control, not part of the report. */
            .no-print { display: none; }
          </style>
        </head>
        <body>
          <table>${printContent}</table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  // Resolve a record's created date the same way the table column does:
  // prefer createdAtMap (buyer-assistance createdAt), fall back to the plan's
  // planCreatedAt. Handles ISO and dd-mm-yyyy strings, and guards against
  // missing/unparseable values so nothing here can crash on bad data.
  const parseDate = (raw) => {
    if (!raw) return null;
    const str = String(raw).trim();
    const m = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (m) {
      const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  };
  const getCreatedDate = (item) =>
    parseDate(createdAtMap[item.Ra_Id] || item.planDetails?.planCreatedAt);
  // Local-time YYYY-MM. Local rather than UTC because dd-mm-yyyy strings parse
  // as local midnight, which UTC would push back into the previous month in IST.
  const toYM = (d) =>
    d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` : '';

  // `overrides` lets a caller filter using a value it has only just set,
  // without waiting for the state update — the month cards rely on this.
  const applyFilters = (overrides = {}) => {
    const month = overrides.monthFilter !== undefined ? overrides.monthFilter : monthFilter;
    let filtered = data;

    if (phoneNumber) {
      filtered = filtered.filter(item =>
        item.phoneNumber.includes(phoneNumber)
      );
    }
  if (baId) {
    filtered = filtered.filter(item =>
      String(item.Ra_Id || '').includes(baId)
    );
  }

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(item => {
        const createdAt = getCreatedDate(item);
        return createdAt && createdAt >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(item => {
        const createdAt = getCreatedDate(item);
        return createdAt && createdAt <= end;
      });
    }

    // Month (Created) — set by clicking a card in the Yearly Dashboard.
    if (month) {
      filtered = filtered.filter((item) => toYM(getCreatedDate(item)) === month);
    }

    // Sort by Ra_Id in descending order
    const sortedData = [...filtered].sort((a, b) => {
      const idA = parseInt(a.Ra_Id) || 0;
      const idB = parseInt(b.Ra_Id) || 0;
      return idB - idA;
    });

    setFilteredData(sortedData);
  };

  const handleFilter = () => applyFilters();

const handleReset = () => {
  setPhoneNumber('');
  setBaId('');
  setStartDate('');
  setEndDate('');
  setMonthFilter('');
  setSelectedRaIds([]);
  const sortedData = [...data].sort((a, b) => {
    const idA = parseInt(a.Ra_Id) || 0;
    const idB = parseInt(b.Ra_Id) || 0;
    return idB - idA;
  });
  setFilteredData(sortedData);
};


const handleSoftDelete = async (_id) => {
  if (!window.confirm("Are you sure you want to delete this request?")) return;

  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/delete-buyer-assistances/${_id}`);
    alert("Tenant Assistance request deleted successfully.");

    // Drop the row from this page immediately — deleted records now live
    // exclusively on the Removed Tenant page (where Undo is available).
    setData(prevData => prevData.filter(item => item._id !== _id));
    setFilteredData(prevData => prevData.filter(item => item._id !== _id));
  } catch (error) {
    alert(`Error deleting Tenant Assistance: ${error.response?.data?.message || error.message}`);
  }
};

const handleUndoDelete = async (_id) => {
  if (!window.confirm("Are you sure you want to restore this request?")) return;

  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/undo-delete-buyer-assistances/${_id}`);
    alert("Tenant Assistance request restored successfully.");

    setData(prevData =>
      prevData.map(item =>
        item._id === _id ? { ...item, isDeleted: false } : item
      )
    );

    setFilteredData(prevData =>
      prevData.map(item =>
        item._id === _id ? { ...item, isDeleted: false } : item
      )
    );
  } catch (error) {
    alert(`Error restoring Tenant Assistance: ${error.response?.data?.message || error.message}`);
  }
};

const handleEdit = (Ra_Id) => {
  navigate('/dashboard/edit-buyer-assistance', { state: { Ra_Id } });
};

const getTotalMatchedPropertiesCount = () => {
  return data.length;
};

const getFilteredMatchedPropertiesCount = () => {
  return filteredData.length;
};

const handleExportToExcel = () => {
  if (filteredData.length === 0) {
    alert('No data to export!');
    return;
  }

  const exportData = filteredData.map(item => ({
    'Ra_Id': item.Ra_Id,
    'Phone Number': item.phoneNumber,
    'Tenant Name': item.raName,
    'Property Mode': item.propertyMode,
    'Property Type': item.propertyType,
    'Area': item.area || 'N/A',
    'City': item.city || 'N/A',
    'Pincode': item.pincode || item.pinCode || 'N/A',
    'Min Price': item.minPrice,
    'Max Price': item.maxPrice,
    'Plan Name': item.planDetails.planName,
    'Created At': item.planDetails.planCreatedAt,
    'Duration (Days)': item.planDetails.durationDays,
    'Expiry Date': item.planDetails.planExpiryDate,
    'Package Type': item.planDetails.packageType,
    'Added By': item.addedBy || '',
    'Approved By': billCreatorMap[item.Ra_Id] || '',
    'Status': item.isDeleted ? 'Deleted' : 'raActive'
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Buyer Assistance');
  XLSX.writeFile(workbook, `BuyerAssistance_${new Date().toISOString().split('T')[0]}.xlsx`);
};

  // ----- Yearly dashboard data (month-wise tenant counts) -----
  // Counts come from the same created date the table's "Created At" column
  // shows, so a month card and the rows it filters to always agree.
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dashboardYears = Array.from(
    new Set(
      (data || [])
        .map((item) => {
          const d = getCreatedDate(item);
          return d ? String(d.getFullYear()) : '';
        })
        .filter(Boolean)
    )
  ).sort((a, b) => b.localeCompare(a));
  const selectedDashboardYear = dashboardYear || dashboardYears[0] || '';
  const dashboardMonthly = Array.from({ length: 12 }, (_, m) => {
    const mm = String(m + 1).padStart(2, '0');
    const ym = `${selectedDashboardYear}-${mm}`;
    const count = selectedDashboardYear
      ? (data || []).filter((item) => toYM(getCreatedDate(item)) === ym).length
      : 0;
    return { month: m, mm, ym, count };
  });
  const dashboardYearTotal = dashboardMonthly.reduce((sum, x) => sum + x.count, 0);

  // ----- Bulk "Mark as Expired" selection -----
  // Only non-deleted rows in the current filtered view are selectable.
  const selectableRows = filteredData.filter((item) => !item.isDeleted);
  const allShownSelected =
    selectableRows.length > 0 &&
    selectableRows.every((item) => selectedRaIds.includes(item.Ra_Id));

  const toggleSelectAllShown = () => {
    if (allShownSelected) {
      setSelectedRaIds([]);
    } else {
      setSelectedRaIds(selectableRows.map((item) => item.Ra_Id));
    }
  };

  const toggleSelectOne = (raId) => {
    setSelectedRaIds((prev) =>
      prev.includes(raId) ? prev.filter((id) => id !== raId) : [...prev, raId]
    );
  };

  const handleBulkExpire = async () => {
    if (selectedRaIds.length === 0) return;
    setExpiring(true);

    const ids = [...selectedRaIds];
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/mark-buyerAssistance-expired-rent`,
        { raIds: ids, expiredBy: localStorage.getItem('adminName') || 'Admin' }
      );

      const expired = res.data?.expired || [];
      const notFound = res.data?.notFound || [];

      // This page lists raActive records only — drop the expired ones from view.
      if (expired.length > 0) {
        setData((prev) => prev.filter((item) => !expired.includes(item.Ra_Id)));
        setFilteredData((prev) => prev.filter((item) => !expired.includes(item.Ra_Id)));
      }

      setSelectedRaIds(notFound); // keep only the ones that failed still selected
      setShowExpireModal(false);

      if (notFound.length === 0) {
        alert(
          `${expired.length} tenant assistance record${expired.length === 1 ? '' : 's'} marked as Expired. They now appear under the Expired section.`
        );
      } else {
        alert(
          `Expired ${expired.length} of ${ids.length}. ${notFound.length} could not be found — they are still selected.`
        );
      }
    } catch (error) {
      alert(`Error marking as expired: ${error.response?.data?.message || error.message}`);
    } finally {
      setExpiring(false);
    }
  };

  // Frozen left columns — keep SI.NO / Ra_Id / Phone Number visible while
  // the table is scrolled horizontally. `left` is the cumulative width of
  // the preceding sticky columns; `last` adds a divider shadow.
  const stickyCol = (left, width, { header = false, last = false } = {}) => ({
    position: 'sticky',
    left,
    minWidth: width,
    maxWidth: width,
    width,
    background: '#ffffff',
    zIndex: header ? 1021 : 2,
    boxShadow: last ? '2px 0 4px -1px rgba(0,0,0,0.15)' : undefined,
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Active Buyer Assistance</h2>

      {/* Filter Form */}
      <form     style={{ 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  padding: '20px', 
  backgroundColor: '#fff' 
}}
        onSubmit={(e) => {
          e.preventDefault();
          handleFilter();
        }}
 className="d-flex flex-row gap-2 align-items-center flex-nowrap"      >

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              RA ID
            </label>
            <input
              type="text"
              placeholder="Enter RA ID"
              value={baId}
              onChange={(e) => setBaId(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
      

        <div className="mt-4 text-right">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          >
            Apply Filters
          </button>

            <button
onClick={handleReset}         
   className="btn btn-primary ms-2 text-white px-6 py-2 rounded shadow"
          >
            Reset
          </button>
        </div>
      </form>
              <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
              <button className="btn mb-3 mt-2" style={{background:"#28a745", color: 'white'}} onClick={handleExportToExcel}>
  <FaFileExcel className="me-2" style={{marginRight: '8px'}} />
  Export to Excel
</button>
              <button
                className="btn btn-warning mb-3 mt-2 ms-2"
                disabled={selectedRaIds.length === 0}
                onClick={() => setShowExpireModal(true)}
              >
                Mark Selected as Expired ({selectedRaIds.length})
              </button>
              <button
                className="btn btn-info mb-3 mt-2 ms-2"
                style={{ color: '#fff' }}
                onClick={() => setShowDashboard(true)}
              >
                Dashboard
              </button>

      {/* Counter Module */}
      <div style={{ marginTop: '16px', marginBottom: '16px' }}>
        <div style={{ 
          background: '#6c757d', 
          color: 'white', 
          padding: '8px 16px', 
          borderRadius: '4px', 
          fontWeight: 'bold',
          fontSize: '14px',
          marginBottom: '12px',
          marginLeft: '8px',
          display: 'inline-block'
        }}>
          Total: {getTotalMatchedPropertiesCount()} Records
        </div>
        <div style={{ 
          background: '#007bff', 
          color: 'white', 
          padding: '8px 16px', 
          borderRadius: '4px', 
          fontWeight: 'bold',
          fontSize: '14px',
          marginBottom: '12px',
          marginLeft: '8px',
          display: 'inline-block'
        }}>
          Showing: {getFilteredMatchedPropertiesCount()} Records
        </div>
        {monthFilter && (
          <div style={{
            background: '#ffc107',
            color: '#212529',
            padding: '8px 16px',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '14px',
            marginBottom: '12px',
            marginLeft: '8px',
            display: 'inline-block'
          }}>
            Month: {MONTH_NAMES[Number(monthFilter.slice(5, 7)) - 1]} {monthFilter.slice(0, 4)}
            <span
              onClick={() => { setMonthFilter(''); applyFilters({ monthFilter: '' }); }}
              style={{ cursor: 'pointer', marginLeft: '10px', fontWeight: 700 }}
              title="Clear month filter"
            >
              ×
            </span>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto mt-5 mb-3">
        <h3 className="text-primary">All Buyer Assistance With Plan Datas</h3>
    <div ref={tableRef}>    <Table striped bordered hover responsive className="table-sm align-middle">
          <thead className="sticky-top">
            <tr>
              <th className="border px-4 py-2 no-print" style={stickyCol(0, 46, { header: true })}>
                <input
                  type="checkbox"
                  checked={allShownSelected}
                  onChange={toggleSelectAllShown}
                  title="Select all shown rows"
                />
              </th>
              <th className="border px-4 py-2" style={stickyCol(46, 70, { header: true })}>SI.NO</th>              <th className="border px-4 py-2" style={stickyCol(116, 100, { header: true })}>Ra_Id</th>
              <th className="border px-4 py-2" style={stickyCol(216, 160, { header: true, last: true })}>Phone Number</th>
              <th className="border px-4 py-2">Tanent Name</th>
              <th className="border px-4 py-2">PropertyMode</th>
              <th className="border px-4 py-2">Property Type</th>
              <th className="border px-4 py-2">Area</th>
              <th className="border px-4 py-2">City</th>
              <th className="border px-4 py-2">Pincode</th>
              <th className="border px-4 py-2">Min Price</th>
              <th className="border px-4 py-2">Max Price</th>
              <th className="border px-4 py-2">Plan Name</th>
              <th className="border px-4 py-2">Plan Type</th>
              <th className="border px-4 py-2">Created At</th>
              <th className="border px-4 py-2">Duration (Days)</th>
              <th className="border px-4 py-2">Expiry Date</th>
              <th className="border px-4 py-2">Package Type</th>
              <th className="border px-4 py-2">Added By</th>
              <th className="border px-4 py-2">Approved By</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Edit Buyer</th>
              <th className="border px-4 py-2">Edit Bill</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <tr key={idx} className="text-center">
                <td className="border px-4 py-2 no-print" style={stickyCol(0, 46)}>
                  {!item.isDeleted && (
                    <input
                      type="checkbox"
                      checked={selectedRaIds.includes(item.Ra_Id)}
                      onChange={() => toggleSelectOne(item.Ra_Id)}
                      title={`Select Ra_Id ${item.Ra_Id}`}
                    />
                  )}
                </td>
                <td className="border px-4 py-2" style={stickyCol(46, 70)}>{idx + 1}</td>
                <td className="border px-4 py-2" style={stickyCol(116, 100)}>{item.Ra_Id}</td>
                <td className="border px-4 py-2" style={stickyCol(216, 160, { last: true })}><PhoneCell phone={item.phoneNumber} type="tenant" raId={item.Ra_Id} /></td>
                <td className="border px-4 py-2">{item.raName}</td>
                <td className="border px-4 py-2">{item.propertyMode}</td>
                <td className="border px-4 py-2">{item.propertyType}</td>
                <td className="border px-4 py-2">{item.area || 'N/A'}</td>
                <td className="border px-4 py-2">{item.city || 'N/A'}</td>
                <td className="border px-4 py-2">{item.pincode || item.pinCode || 'N/A'}</td>
                <td className="border px-4 py-2">{item.minPrice}</td>
                <td className="border px-4 py-2">{item.maxPrice}</td>

                <td className="border px-4 py-2">{item.planDetails.planName}</td>
                <td className="border px-4 py-2">
                  {paidRaIds.has(item.Ra_Id) ? (
                    <span className="badge bg-primary">Paid</span>
                  ) : freeRaIds.has(item.Ra_Id) ? (
                    <span className="badge bg-success">Free</span>
                  ) : (
                    <span className="badge bg-secondary">N/A</span>
                  )}
                </td>
                <td className="border px-4 py-2">{createdAtMap[item.Ra_Id] ? new Date(createdAtMap[item.Ra_Id]).toLocaleDateString() : item.planDetails.planCreatedAt}</td>
                <td className="border px-4 py-2">{item.planDetails.durationDays}</td>
                <td className="border px-4 py-2">{item.planDetails.planExpiryDate}</td>
                <td className="border px-4 py-2">{item.planDetails.packageType}</td>

                <td className="border px-4 py-2">
                  {item.addedBy
                    ? <span style={{ fontWeight: 600 }}>{item.addedBy}</span>
                    : <span style={{ color: '#9ca3af' }}>—</span>}
                </td>

                <td className="border px-4 py-2">
                  {billCreatorMap[item.Ra_Id]
                    ? <span style={{ fontWeight: 600, color: '#0d6efd' }}>{billCreatorMap[item.Ra_Id]}</span>
                    : <span style={{ color: '#9ca3af' }}>—</span>}
                </td>

<td className="border px-4 py-2">
  {item.isDeleted ? (
    <Badge bg="danger" className="d-flex align-items-center justify-content-center">
      <FaTrash className="me-1" /> Deleted
    </Badge>
  ) : (
    <Badge bg="success" className="d-flex align-items-center justify-content-center">
      <FaInfoCircle className="me-1" /> raActive
    </Badge>
  )}
</td>

 


<td className="border px-4 py-2">
  {!item.isDeleted && (
    <button
      onClick={() => handleEdit(item.Ra_Id)}
      className="btn btn-sm btn-warning"
    >
      Edit
    </button>
  )}
</td>

<td className="border px-4 py-2">
  <button
    onClick={() => navigate(`/dashboard/edit-buyer-bill/${item.Ra_Id}`)}
    className="d-flex align-items-center justify-content-center btn btn-outline-warning btn-sm mx-auto"
    title="Edit bill for this record"
  >
    <FaEdit className="me-1" /> Edit Bill
  </button>
</td>

<td className="border px-4 py-2">
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    {item.isDeleted ? (
      <button
        onClick={() => handleUndoDelete(item._id)}
        className="d-flex align-items-center justify-content-center btn btn-outline-primary btn-sm mx-auto"
      >
        <FaUndo className="me-1" /> Undo
      </button>
    ) : (
      <button
        onClick={() => handleSoftDelete(item._id)}
        className="d-flex align-items-center justify-content-center btn btn-outline-danger btn-sm mx-auto"
      >
        <FaTrash className="me-1" /> Delete
      </button>
    )}
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </Table>
    </div>  </div>

      {/* Yearly Dashboard Modal — month-wise tenant counts for a selected year */}
      <Modal show={showDashboard} onHide={() => setShowDashboard(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Active Tenant Assistance — Yearly Dashboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
            <label className="mb-0 fw-bold">Select Year:</label>
            <select
              className="form-control"
              style={{ maxWidth: '160px' }}
              value={selectedDashboardYear}
              onChange={(e) => setDashboardYear(e.target.value)}
            >
              {dashboardYears.length === 0 && <option value="">No data</option>}
              {dashboardYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <span className="badge bg-primary" style={{ fontSize: '13px' }}>
              Total in {selectedDashboardYear || '-'}: {dashboardYearTotal}
            </span>
          </div>

          <div className="row g-3">
            {dashboardMonthly.map((mData) => (
              <div className="col-6 col-sm-4 col-md-3" key={mData.mm}>
                <div
                  onClick={() => {
                    if (mData.count === 0) return;
                    setMonthFilter(mData.ym);
                    applyFilters({ monthFilter: mData.ym });
                    setShowDashboard(false);
                  }}
                  style={{
                    cursor: mData.count > 0 ? 'pointer' : 'default',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    background: mData.count > 0 ? '#f0f6ff' : '#f5f5f5',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    opacity: mData.count > 0 ? 1 : 0.55,
                  }}
                  title={mData.count > 0 ? `Click to filter ${MONTH_NAMES[mData.month]} ${selectedDashboardYear}` : 'No tenants'}
                >
                  <div style={{ fontSize: '14px', color: '#555', fontWeight: 600 }}>
                    {MONTH_NAMES[mData.month]}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#0d6efd' }}>
                    {mData.count}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>tenants</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-muted mt-3 mb-0" style={{ fontSize: '12px' }}>
            Tip: click any month card to filter the table below to that month.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDashboard(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Bulk Expire Confirmation Modal */}
      <Modal show={showExpireModal} onHide={() => !expiring && setShowExpireModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Mark as Expired</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are about to mark <strong>{selectedRaIds.length}</strong>{' '}
            tenant assistance record{selectedRaIds.length === 1 ? '' : 's'} as <strong>Expired</strong>.
          </p>
          <p className="text-muted" style={{ fontSize: '13px' }}>
            They will be removed from this Active list and will appear under the Expired
            section, where they can be restored if this was a mistake.
          </p>
          {selectedRaIds.length > 0 && (
            <p className="mb-0" style={{ fontSize: '13px' }}>
              <strong>Ra_Ids:</strong> {selectedRaIds.slice(0, 20).join(', ')}
              {selectedRaIds.length > 20 ? ` … +${selectedRaIds.length - 20} more` : ''}
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExpireModal(false)} disabled={expiring}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleBulkExpire} disabled={expiring}>
            {expiring ? 'Marking…' : 'Mark as Expired'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BuyerAssistanceActive;