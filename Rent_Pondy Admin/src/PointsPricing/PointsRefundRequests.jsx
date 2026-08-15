import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Table, Form, Button, Modal, Badge } from "react-bootstrap";
import { FaCheck, FaTimes, FaSync, FaFilter, FaUserShield } from "react-icons/fa";
import Swal from "sweetalert2";

const API = process.env.REACT_APP_API_URL;

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_BADGE = {
  pending:  { bg: "warning", label: "Pending" },
  approved: { bg: "success", label: "Approved" },
  rejected: { bg: "danger",  label: "Rejected" },
};

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("en-IN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return String(d);
  }
};

const PointsRefundRequests = () => {
  const adminName =
    useSelector((s) => s?.admin?.name) ||
    localStorage.getItem("adminName") ||
    "admin";

  const [requests, setRequests] = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [limit]                 = useState(50);
  const [loading, setLoading]   = useState(false);

  const [filters, setFilters] = useState({ status: "", phone: "" });

  // Modal for approve/reject confirmation.
  const [actionTarget, setActionTarget] = useState(null); // request being acted on
  const [actionType, setActionType]     = useState(null); // 'approved' | 'rejected'
  const [adminNote, setAdminNote]       = useState("");
  const [submitting, setSubmitting]     = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/points-refund-requests`, {
        params: {
          page,
          limit,
          status: filters.status || undefined,
          phone: filters.phone || undefined,
        },
      });
      setRequests(res.data?.requests || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      Swal.fire("Error", "Failed to load refund requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const applyFilters = (e) => {
    e?.preventDefault?.();
    setPage(1);
    setTimeout(fetchRequests, 0);
  };

  const resetFilters = () => {
    setFilters({ status: "", phone: "" });
    setPage(1);
    setTimeout(fetchRequests, 0);
  };

  const openAction = (request, type) => {
    setActionTarget(request);
    setActionType(type);
    setAdminNote("");
  };

  const closeAction = () => {
    if (submitting) return;
    setActionTarget(null);
    setActionType(null);
    setAdminNote("");
  };

  const submitAction = async () => {
    if (!actionTarget || !actionType) return;
    setSubmitting(true);
    try {
      await axios.patch(`${API}/points-refund-requests/${actionTarget._id}`, {
        status: actionType,
        adminId: adminName,
        adminNote: adminNote.trim(),
      });
      closeAction();
      await fetchRequests();
      Swal.fire({
        icon: "success",
        title: actionType === "approved" ? "Refund approved" : "Refund rejected",
        timer: 1300,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update refund request",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="container-fluid mt-3">
      <h3 className="mb-3">Points Refund Requests</h3>

      <div
        className="bg-white p-3 rounded mb-3"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Form onSubmit={applyFilters}>
          <div className="row g-2 align-items-end">
            <div className="col-md-3">
              <Form.Label className="small">Status</Form.Label>
              <Form.Select
                size="sm"
                value={filters.status}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, status: e.target.value }))
                }
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-3">
              <Form.Label className="small">Phone</Form.Label>
              <Form.Control
                size="sm"
                value={filters.phone}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="e.g. 9876543210"
              />
            </div>
            <div className="col-md-2 d-flex gap-2">
              <Button size="sm" type="submit" variant="primary">
                <FaFilter /> Apply
              </Button>
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={resetFilters}
                type="button"
              >
                <FaSync />
              </Button>
            </div>
            <div className="col-md-4 text-end small text-muted">
              Logged as <b>{adminName}</b>
            </div>
          </div>
        </Form>
      </div>

      <div
        className="bg-white p-3 rounded"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Table hover responsive size="sm" className="mb-0">
          <thead style={{ background: "#F0F2F5" }}>
            <tr>
              <th style={{ width: 140 }}>Date</th>
              <th style={{ width: 120 }}>Phone</th>
              <th>Property</th>
              <th style={{ width: 80 }}>Points</th>
              <th>Reason</th>
              <th style={{ width: 100 }}>Status</th>
              <th style={{ width: 150 }}>Processed By</th>
              <th style={{ width: 140 }}>Resolved At</th>
              <th>Admin Note</th>
              <th style={{ width: 150 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={10} className="text-center text-muted py-4">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && requests.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center text-muted py-4">
                  No refund requests match these filters.
                </td>
              </tr>
            )}
            {!loading &&
              requests.map((r) => {
                const badge = STATUS_BADGE[r.status] || {
                  bg: "secondary",
                  label: r.status,
                };
                return (
                  <tr key={r._id}>
                    <td style={{ fontSize: 12 }}>{fmtDate(r.createdAt)}</td>
                    <td>{r.phoneNumber}</td>
                    <td style={{ fontSize: 12 }}>
                      {r.rentId != null ? String(r.rentId) : "—"}
                    </td>
                    <td style={{ fontWeight: 600 }}>{r.points}</td>
                    <td style={{ fontSize: 12, maxWidth: 240 }}>
                      {r.reason || <span className="text-muted">—</span>}
                    </td>
                    <td>
                      <Badge bg={badge.bg}>{badge.label}</Badge>
                    </td>
                    <td>
                      {r.status === "pending" ? (
                        <span className="text-muted small">—</span>
                      ) : (
                        <Badge
                          bg={r.status === "approved" ? "success" : "danger"}
                          style={{ fontSize: 11 }}
                        >
                          <FaUserShield style={{ marginRight: 4 }} />
                          {r.adminId || "admin"}
                        </Badge>
                      )}
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {r.resolvedAt ? fmtDate(r.resolvedAt) : "—"}
                    </td>
                    <td style={{ fontSize: 12, color: "#555", maxWidth: 220 }}>
                      {r.adminNote || "—"}
                    </td>
                    <td>
                      {r.status === "pending" ? (
                        <div className="d-flex gap-1">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => openAction(r, "approved")}
                          >
                            <FaCheck /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => openAction(r, "rejected")}
                          >
                            <FaTimes /> Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>

        {total > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span style={{ fontSize: 13, color: "#666" }}>
              Page {page} of {pageCount} · {total} requests
            </span>
            <div>
              <Button
                size="sm"
                variant="outline-secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </Button>
              <Button
                size="sm"
                variant="outline-secondary"
                disabled={page >= pageCount}
                onClick={() => setPage((p) => p + 1)}
                className="ms-2"
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Approve / Reject confirmation modal */}
      <Modal show={!!actionTarget} onHide={closeAction} centered>
        <Modal.Header closeButton={!submitting}>
          <Modal.Title>
            {actionType === "approved" ? "Approve refund" : "Reject refund"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {actionTarget && (
            <>
              <div className="mb-3">
                <div>
                  <b>Phone:</b> {actionTarget.phoneNumber}
                </div>
                <div>
                  <b>Property:</b>{" "}
                  {actionTarget.rentId != null
                    ? String(actionTarget.rentId)
                    : "—"}
                </div>
                <div>
                  <b>Points:</b> {actionTarget.points}
                </div>
                <div>
                  <b>User reason:</b>{" "}
                  {actionTarget.reason || (
                    <span className="text-muted">— none —</span>
                  )}
                </div>
              </div>

              {actionType === "approved" && (
                <div
                  className="alert alert-warning small mb-3"
                  style={{ padding: "8px 12px" }}
                >
                  Approving will credit <b>{actionTarget.points} pts</b> back
                  to {actionTarget.phoneNumber} and write a refund row to the
                  ledger.
                </div>
              )}

              <Form.Group>
                <Form.Label className="small">
                  Admin note (optional)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder={
                    actionType === "approved"
                      ? "e.g. Verified property is sold"
                      : "e.g. Property still active, refund not warranted"
                  }
                  disabled={submitting}
                />
              </Form.Group>

              <div className="small text-muted mt-2">
                Logged as <b>{adminName}</b>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={closeAction}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant={actionType === "approved" ? "success" : "danger"}
            onClick={submitAction}
            disabled={submitting}
          >
            {submitting
              ? "Submitting…"
              : actionType === "approved"
              ? "Approve & credit points"
              : "Reject"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PointsRefundRequests;
