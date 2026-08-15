 

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdDeleteForever, MdUndo, MdRefresh, MdCheckCircle } from 'react-icons/md';
import { Modal, Button, Badge } from 'react-bootstrap';
import PhoneCell from './components/PhoneCell';

const ExpiredPlanProperties = () => {
  const [expiredPlans, setExpiredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    rentId: '',
    phone: '',
    month: '',
  });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  // Yearly dashboard (month-wise expired-property counts) — mirrors ApprovedCar.
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardYear, setDashboardYear] = useState('');

  // Bulk select + bulk Reactivate/Complete for expired properties.
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState(''); // 'active' (reactivate) | 'complete'
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });

  const adminName = useSelector((state) => state.admin.name) || localStorage.getItem("adminName");
  const navigate = useNavigate();

  const fetchExpiredPlans = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/all-expired-properties`);
      if (response.status === 200) {
        setExpiredPlans(response.data.expiredPlans || []);
      } else {
        setError('Failed to fetch data.');
      }
    } catch (err) {
      setError('Error fetching data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpiredPlans();
  }, []);

  const handleDelete = async (rentId) => {
    if (window.confirm(`Are you sure you want to delete Rent ID: ${rentId}?`)) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/delete-free-property/${rentId}`, {
          method: 'PUT',
        });
        const data = await response.json();
        alert(data.message);
        fetchExpiredPlans(); // Refresh data
      } catch (error) {
        alert('Failed to delete the property.');
      }
    }
  };

  const handleUndoDelete = async (rentId) => {
    if (window.confirm(`Are you sure you want to undo delete for Rent ID: ${rentId}?`)) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/undo-delete-free-property/${rentId}`, {
          method: 'PUT',
        });
        const data = await response.json();
        alert(data.message);
        fetchExpiredPlans(); // Refresh data
      } catch (error) {
        alert('Failed to undo delete.');
      }
    }
  };

  const handleStatusUpdate = (property, status) => {
    setSelectedProperty(property);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedProperty || !newStatus) return;
    
    setStatusLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-expired-property-status`,
        {
          rentId: selectedProperty.rentId,
          newStatus,
          updatedBy: adminName
        }
      );

      alert(response.data.message);
      fetchExpiredPlans(); // Refresh the list
      setShowStatusModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      expired: 'warning',
      complete: 'primary',
      deleted: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  // ----- Yearly dashboard data (month-wise counts from createdAt) -----
  // YM extracted in UTC to stay consistent between the dashboard and the month filter.
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const toYM = (d) => { try { return new Date(d).toISOString().slice(0, 7); } catch (e) { return ''; } };
  const dashboardYears = Array.from(
    new Set(
      (expiredPlans || [])
        .map((p) => (p.createdAt ? new Date(p.createdAt).toISOString().slice(0, 4) : ''))
        .filter(Boolean)
    )
  ).sort((a, b) => b.localeCompare(a));
  const selectedDashboardYear = dashboardYear || dashboardYears[0] || '';
  const dashboardMonthly = Array.from({ length: 12 }, (_, m) => {
    const mm = String(m + 1).padStart(2, '0');
    const ym = `${selectedDashboardYear}-${mm}`;
    const count = selectedDashboardYear
      ? (expiredPlans || []).filter((p) => p.createdAt && toYM(p.createdAt) === ym).length
      : 0;
    return { month: m, mm, ym, count };
  });
  const dashboardYearTotal = dashboardMonthly.reduce((sum, x) => sum + x.count, 0);
  const monthFilterLabel = filters.month
    ? `${MONTH_NAMES[Number(filters.month.slice(5, 7)) - 1]} ${filters.month.slice(0, 4)}`
    : '';

  const filteredPlans = expiredPlans.filter(plan => {
    const matchesRentId = plan.rentId?.toString().includes(filters.rentId);
    const matchesPhone = plan.phoneNumber?.includes(filters.phone);
    const matchesMonth = !filters.month || (plan.createdAt && toYM(plan.createdAt) === filters.month);
    return matchesRentId && matchesPhone && matchesMonth;
  });

  // ----- Bulk selection: Reactivate / Complete many expired properties -----
  // Only non-deleted rows are selectable (deleted ones show Restore, not Reactivate).
  const selectableRows = filteredPlans.filter((p) => !p.isDeleted);
  const allSelected =
    selectableRows.length > 0 && selectableRows.every((p) => selectedIds.includes(p.rentId));

  // Keep the selection scoped to what's currently visible / still expired.
  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => filteredPlans.some((p) => p.rentId === id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, expiredPlans]);

  const toggleOne = (rentId) =>
    setSelectedIds((prev) =>
      prev.includes(rentId) ? prev.filter((id) => id !== rentId) : [...prev, rentId]
    );

  const toggleAll = () => {
    const ids = selectableRows.map((p) => p.rentId);
    setSelectedIds((prev) =>
      allSelected ? prev.filter((id) => !ids.includes(id)) : Array.from(new Set([...prev, ...ids]))
    );
  };

  const openBulk = (status) => {
    if (selectedIds.length === 0) return;
    setBulkStatus(status);
    setShowBulkModal(true);
  };

  // Apply the chosen status to every selected rentId with limited concurrency
  // (mirrors ApprovedCar's bulk worker), then refresh the list and report.
  const confirmBulk = async () => {
    const ids = [...selectedIds];
    if (ids.length === 0 || !bulkStatus) return;
    setBulkProcessing(true);
    setBulkProgress({ done: 0, total: ids.length });

    let cursor = 0, done = 0;
    const succeeded = [], failed = [];
    const worker = async () => {
      while (cursor < ids.length) {
        const rentId = ids[cursor++];
        try {
          await axios.put(`${process.env.REACT_APP_API_URL}/update-expired-property-status`, {
            rentId, newStatus: bulkStatus, updatedBy: adminName,
          });
          succeeded.push(rentId);
        } catch (e) {
          failed.push(rentId);
        } finally {
          done += 1;
          setBulkProgress({ done, total: ids.length });
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(5, ids.length) }, worker));

    setBulkProcessing(false);
    setShowBulkModal(false);
    setSelectedIds([]);
    await fetchExpiredPlans();
    alert(
      `${bulkStatus === 'active' ? 'Reactivated' : 'Completed'} ${succeeded.length} of ${ids.length}.` +
      (failed.length ? ` ${failed.length} failed — please retry.` : '')
    );
  };

  return (
    <div className="container mt-4">
      {/* Status Update Confirmation Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Status Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProperty && (
            <div>
              <p>Are you sure you want to update status of Rent ID: <strong>{selectedProperty.rentId}</strong> from <strong>expired</strong> to <strong>{newStatus}</strong>?</p>
              <p>This action will be recorded as performed by: <strong>{adminName}</strong></p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)} disabled={statusLoading}>
            Cancel
          </Button>
          <Button 
            variant={newStatus === 'active' ? 'success' : 'primary'}
            onClick={confirmStatusUpdate}
            disabled={statusLoading}
          >
            {statusLoading ? 'Updating...' : `Confirm to ${newStatus}`}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Bulk Reactivate / Complete Confirmation Modal */}
      <Modal show={showBulkModal} onHide={() => !bulkProcessing && setShowBulkModal(false)} centered>
        <Modal.Header closeButton={!bulkProcessing}>
          <Modal.Title>
            {bulkStatus === 'active' ? 'Reactivate' : 'Complete'} {selectedIds.length}{' '}
            propert{selectedIds.length === 1 ? 'y' : 'ies'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are about to set <strong>{selectedIds.length}</strong> expired{' '}
            propert{selectedIds.length === 1 ? 'y' : 'ies'} to{' '}
            <strong>{bulkStatus === 'active' ? 'active (Reactivate)' : 'complete'}</strong>
            {filters.month ? <> for <strong>{monthFilterLabel}</strong></> : null}.
          </p>
          <p className="mb-0">Recorded as performed by: <strong>{adminName}</strong>.</p>
          {bulkProcessing && (
            <p className="mt-2 mb-0 text-primary">Processing {bulkProgress.done}/{bulkProgress.total}…</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBulkModal(false)} disabled={bulkProcessing}>
            Cancel
          </Button>
          <Button
            variant={bulkStatus === 'active' ? 'success' : 'primary'}
            onClick={confirmBulk}
            disabled={bulkProcessing}
          >
            {bulkProcessing
              ? `Working ${bulkProgress.done}/${bulkProgress.total}…`
              : `Confirm ${bulkStatus === 'active' ? 'Reactivate' : 'Complete'}`}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Yearly Dashboard Modal — month-wise expired-property counts for a selected year */}
      <Modal show={showDashboard} onHide={() => setShowDashboard(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Expired Properties — Yearly Dashboard</Modal.Title>
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
                    setFilters((prev) => ({ ...prev, month: mData.ym }));
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
                  title={mData.count > 0 ? `Click to filter ${MONTH_NAMES[mData.month]} ${selectedDashboardYear}` : 'No properties'}
                >
                  <div style={{ fontSize: '14px', color: '#555', fontWeight: 600 }}>
                    {MONTH_NAMES[mData.month]}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#0d6efd' }}>
                    {mData.count}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>properties</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-muted mt-3 mb-0" style={{ fontSize: '12px' }}>
            Tip: click any month card to filter the list below to that month, then Reactivate.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDashboard(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <div style={{
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        backgroundColor: '#fff'
      }} className="d-flex flex-row gap-2 align-items-center flex-nowrap">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Rent ID"
          value={filters.rentId}
          onChange={(e) => setFilters({ ...filters, rentId: e.target.value })}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Search by Phone"
          value={filters.phone}
          onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
        />
        <button className="btn btn-secondary" onClick={() => setFilters({
          rentId: '',
          phone: '',
          month: '',
        })}>
          Reset
        </button>
        <button
          className="btn btn-info text-white text-nowrap"
          onClick={() => setShowDashboard(true)}
        >
          Dashboard
        </button>
      </div>

      <h4 className="mt-3 d-flex align-items-center gap-2 flex-wrap">
        Expired Properties
        {filters.month && (
          <Badge
            bg="info"
            className="text-white"
            style={{ cursor: 'pointer', fontSize: '13px' }}
            title="Clear month filter"
            onClick={() => setFilters({ ...filters, month: '' })}
          >
            {monthFilterLabel} ✕
          </Badge>
        )}
      </h4>

      {/* Bulk action bar — select rows (optionally after filtering by month via
          Dashboard) then Reactivate or Complete them all at once. */}
      {!loading && !error && selectableRows.length > 0 && (
        <div className="d-flex flex-wrap align-items-center gap-2 mt-3 p-2"
             style={{ background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <span className="fw-bold">{selectedIds.length} selected</span>
          <button className="btn btn-success btn-sm" disabled={selectedIds.length === 0}
                  onClick={() => openBulk('active')}>
            <MdRefresh className="me-1" /> Reactivate Selected ({selectedIds.length})
          </button>
          <button className="btn btn-primary btn-sm" disabled={selectedIds.length === 0}
                  onClick={() => openBulk('complete')}>
            <MdCheckCircle className="me-1" /> Complete Selected ({selectedIds.length})
          </button>
          {selectedIds.length > 0 && (
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setSelectedIds([])}>
              Clear
            </button>
          )}
          {filters.month && <span className="text-muted small ms-auto">for {monthFilterLabel}</span>}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : filteredPlans.length === 0 ? (
        <p>No expired plans found.</p>
      ) : (
        <table className="table table-bordered table-striped mt-3">
          <thead className="table-dark">
            <tr>
              <th style={{ width: 36 }}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll} title="Select all" />
              </th>
              <th>#</th>
              <th>Rent ID</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Property Info</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.map((plan, index) => (
              <tr key={plan._id}>
                <td>
                  {!plan.isDeleted && (
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(plan.rentId)}
                      onChange={() => toggleOne(plan.rentId)}
                    />
                  )}
                </td>
                <td>{index + 1}</td>
                <td>
                  <span
                    style={{ cursor: 'pointer', color: '#0d6efd', textDecoration: 'underline', fontWeight: 600 }}
                    onClick={() =>
                      navigate('/dashboard/detail', {
                        state: { rentId: plan.rentId, phoneNumber: plan.phoneNumber },
                      })
                    }
                  >
                    {plan.rentId}
                  </span>
                </td>
                <td><PhoneCell phone={plan.phoneNumber} type="owner" rentId={plan.rentId} /></td>
                <td>{getStatusBadge(plan.status)}</td>
                <td>
                  <table className="table table-sm table-bordered mb-0">
                    <thead className="table-secondary">
                      <tr>
                        <th>Mode</th>
                        <th>Type</th>
                        <th>Rental Amount</th>
                        <th>Area</th>
                        <th>Posted By</th>
                        <th>Sales Type</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{plan.propertyMode}</td>
                        <td>{plan.propertyType}</td>
                        <td>{plan.rentalAmount}</td>
                        <td>{`${plan.totalArea} ${plan.areaUnit}`}</td>
                        <td>{plan.postedBy}</td>
                        <td>{plan.salesType}</td>
                        <td>{new Date(plan.createdAt).toLocaleDateString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <div className="d-flex flex-column gap-2">
                    {!plan.isDeleted && (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleStatusUpdate(plan, 'active')}
                          title="Set to Active"
                        >
                          <MdRefresh className="me-1" /> Reactivate
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleStatusUpdate(plan, 'complete')}
                          title="Mark as Complete"
                        >
                          <MdCheckCircle className="me-1" /> Complete
                        </button>
                      </>
                    )}
                    {plan.isDeleted ? (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleUndoDelete(plan.rentId)}
                        title="Restore Property"
                      >
                        <MdUndo size={20} />
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(plan.rentId)}
                        title="Delete Property"
                      >
                        <MdDeleteForever size={20} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpiredPlanProperties;