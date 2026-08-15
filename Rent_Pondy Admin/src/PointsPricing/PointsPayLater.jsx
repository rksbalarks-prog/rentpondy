import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Table, Form, Button, Modal, Badge } from "react-bootstrap";
import { FaStickyNote, FaSync } from "react-icons/fa";
import Swal from "sweetalert2";

const API = process.env.REACT_APP_API_URL;

const STATUS_OPTIONS = ["new", "contacted", "converted", "dropped"];

const STATUS_STYLE = {
  new: { bg: "secondary" },
  contacted: { bg: "info" },
  converted: { bg: "success" },
  dropped: { bg: "danger" },
};

const PointsPayLater = () => {
  const adminName =
    useSelector((s) => s.admin?.name) ||
    localStorage.getItem("adminName") ||
    "admin";

  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [noteTarget, setNoteTarget] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/points-paylater`, {
        params: {
          page,
          limit,
          status: statusFilter || undefined,
        },
      });
      setLeads(res.data?.leads || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      Swal.fire("Error", "Failed to load pay-later leads", "error");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (lead, newStatus) => {
    if (newStatus === (lead.leadStatus || "new")) return;
    try {
      await axios.patch(`${API}/points-paylater/${lead.txnid}`, {
        status: newStatus,
        adminId: adminName,
      });
      await fetchLeads();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update status",
        "error"
      );
    }
  };

  const openNote = (lead) => {
    setNoteTarget(lead);
    setNoteDraft(lead.leadNote || "");
  };

  const saveNote = async () => {
    if (!noteTarget) return;
    setSaving(true);
    try {
      await axios.patch(`${API}/points-paylater/${noteTarget.txnid}`, {
        note: noteDraft,
        adminId: adminName,
      });
      setNoteTarget(null);
      await fetchLeads();
      Swal.fire({
        icon: "success",
        title: "Note saved",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to save note",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="container-fluid mt-3">
      <h3 className="mb-3">Points Pay Later Leads</h3>

      <div
        className="p-2 mb-3 rounded"
        style={{
          background: "#FFF4D6",
          border: "1px solid #F5C542",
          color: "#7A5B00",
          fontSize: 13,
        }}
      >
        Pay-later rows are <b>leads only</b>. They never reached PayU and are
        not revenue until a lead is marked <b>converted</b>.
      </div>

      <div
        className="bg-white p-3 rounded mb-3"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <Form.Label className="small">Status</Form.Label>
            <Form.Select
              size="sm"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-2">
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={fetchLeads}
              className="w-100"
            >
              <FaSync className="me-1" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div
        className="bg-white p-3 rounded"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Table hover responsive size="sm" className="mb-0">
          <thead style={{ background: "#F0F2F5" }}>
            <tr>
              <th style={{ width: 140 }}>Date</th>
              <th>Name</th>
              <th style={{ width: 120 }}>Phone</th>
              <th>Email</th>
              <th>Plan</th>
              <th style={{ width: 80 }}>Points</th>
              <th style={{ width: 90 }}>Amount</th>
              <th style={{ width: 140 }}>Status</th>
              <th style={{ width: 140 }}>Last Contact</th>
              <th style={{ width: 100 }}>By</th>
              <th style={{ width: 80 }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={11} className="text-center text-muted py-4">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && leads.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center text-muted py-4">
                  No pay-later leads.
                </td>
              </tr>
            )}
            {!loading &&
              leads.map((l) => {
                const st = l.leadStatus || "new";
                const badge = STATUS_STYLE[st] || { bg: "secondary" };
                return (
                  <tr key={l.txnid}>
                    <td style={{ fontSize: 12 }}>
                      {l.createdAt
                        ? new Date(l.createdAt).toLocaleString("en-IN", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })
                        : "—"}
                    </td>
                    <td>{l.firstname || "—"}</td>
                    <td>{l.phone || "—"}</td>
                    <td style={{ fontSize: 12 }}>{l.email || "—"}</td>
                    <td style={{ fontSize: 12 }}>
                      {l.planName || l.planId || "—"}
                    </td>
                    <td>{l.points || 0}</td>
                    <td>{l.amount ? `₹${l.amount}` : "—"}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Badge bg={badge.bg}>{st}</Badge>
                        <Form.Select
                          size="sm"
                          value={st}
                          onChange={(e) => changeStatus(l, e.target.value)}
                          style={{ maxWidth: 130, fontSize: 12 }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {l.lastContactAt
                        ? new Date(l.lastContactAt).toLocaleString("en-IN", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })
                        : "—"}
                    </td>
                    <td style={{ fontSize: 12 }}>{l.updatedBy || "—"}</td>
                    <td>
                      <Button
                        size="sm"
                        variant={
                          l.leadNote ? "outline-primary" : "outline-secondary"
                        }
                        onClick={() => openNote(l)}
                        title={l.leadNote || "Add note"}
                      >
                        <FaStickyNote />
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>

        {total > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span style={{ fontSize: 13, color: "#666" }}>
              Page {page} of {pageCount} · {total} leads
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

      <Modal show={!!noteTarget} onHide={() => setNoteTarget(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Follow-up note {noteTarget ? `· ${noteTarget.firstname}` : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label className="small">
            Internal note (support team only)
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="e.g. Called at 11am, will decide over weekend."
          />
          <div className="mt-2" style={{ fontSize: 12, color: "#888" }}>
            Saved by <b>{adminName}</b>. Appended to the lead history.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setNoteTarget(null)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveNote} disabled={saving}>
            {saving ? "Saving…" : "Save note"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PointsPayLater;
