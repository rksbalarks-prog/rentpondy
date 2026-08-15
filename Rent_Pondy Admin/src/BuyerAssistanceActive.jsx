

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table, Badge } from 'react-bootstrap';
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
  const handleFilter = () => {
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

    // Resolve a record's created date the same way the table column does:
    // prefer createdAtMap (buyer-assistance createdAt), fall back to the
    // plan's planCreatedAt. Handles ISO and dd-mm-yyyy strings, and guards
    // against missing/unparseable values so the filter never crashes.
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

    // Sort by Ra_Id in descending order
    const sortedData = [...filtered].sort((a, b) => {
      const idA = parseInt(a.Ra_Id) || 0;
      const idB = parseInt(b.Ra_Id) || 0;
      return idB - idA;
    });

    setFilteredData(sortedData);
  };

const handleReset = () => {
  setPhoneNumber('');
  setBaId('');
  setStartDate('');
  setEndDate('');
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
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto mt-5 mb-3">
        <h3 className="text-primary">All Buyer Assistance With Plan Datas</h3>
    <div ref={tableRef}>    <Table striped bordered hover responsive className="table-sm align-middle">
          <thead className="sticky-top">
            <tr>              <th className="border px-4 py-2" style={stickyCol(0, 70, { header: true })}>SI.NO</th>              <th className="border px-4 py-2" style={stickyCol(70, 100, { header: true })}>Ra_Id</th>
              <th className="border px-4 py-2" style={stickyCol(170, 160, { header: true, last: true })}>Phone Number</th>
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
                <td className="border px-4 py-2" style={stickyCol(0, 70)}>{idx + 1}</td>
                <td className="border px-4 py-2" style={stickyCol(70, 100)}>{item.Ra_Id}</td>
                <td className="border px-4 py-2" style={stickyCol(170, 160, { last: true })}><PhoneCell phone={item.phoneNumber} type="tenant" raId={item.Ra_Id} /></td>
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
    </div>
  );
};

export default BuyerAssistanceActive;