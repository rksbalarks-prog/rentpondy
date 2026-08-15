import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Modal, Button, Form, InputGroup, Badge } from "react-bootstrap";
import { FaSearch, FaCoins, FaHistory, FaUserPlus, FaUserShield } from "react-icons/fa";
import Swal from "sweetalert2";

const API = process.env.REACT_APP_API_URL;

const PointsUsers = () => {
  const navigate = useNavigate();
  const adminName =
    useSelector((s) => s.admin?.name) || localStorage.getItem("adminName") || "admin";

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showAdjust, setShowAdjust] = useState(false);
  const [target, setTarget] = useState(null);
  const [adjDir, setAdjDir] = useState("credit"); // credit | debit
  const [adjPoints, setAdjPoints] = useState("");
  const [adjReason, setAdjReason] = useState("");
  const [saving, setSaving] = useState(false);

  // Manual "Add User" modal state — kept isolated from the Adjust flow.
  const [showAdd, setShowAdd] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [addingUser, setAddingUser] = useState(false);

  // Admin logs modal: shows manual-adjust transactions for a single user.
  const [showLogs, setShowLogs] = useState(false);
  const [logsTarget, setLogsTarget] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/points-users`, {
        params: { page, limit, phone: search || undefined },
      });
      setUsers(res.data?.users || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      Swal.fire("Error", "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const openAdjust = (user) => {
    setTarget(user);
    setAdjDir("credit");
    setAdjPoints("");
    setAdjReason("");
    setShowAdjust(true);
  };

  const submitAdjust = async () => {
    const n = Number(adjPoints);
    if (!Number.isFinite(n) || n <= 0) {
      Swal.fire("Invalid", "Points must be a positive number", "warning");
      return;
    }
    if (!adjReason.trim()) {
      Swal.fire("Reason required", "Please enter a reason", "warning");
      return;
    }
    const signed = adjDir === "credit" ? n : -n;
    setSaving(true);
    try {
      const res = await axios.post(`${API}/points-adjust`, {
        phoneNumber: target.phoneNumber,
        points: signed,
        reason: adjReason.trim(),
        adminId: adminName,
      });
      setShowAdjust(false);
      await fetchUsers();
      Swal.fire({
        icon: "success",
        title: `${adjDir === "credit" ? "Credited" : "Debited"} ${n} points`,
        text: `New balance: ${res.data?.balance}`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to adjust balance",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // -------- Add User (manual create with zero balance) --------
  const openAddUser = () => {
    setNewPhone("");
    setShowAdd(true);
  };

  const normalizeLocal = (raw = "") =>
    String(raw).replace(/[\s-]/g, "").replace(/^(\+91|91|0)/, "").trim();

  const submitAddUser = async () => {
    const phone = normalizeLocal(newPhone);
    if (!/^\d{10}$/.test(phone)) {
      Swal.fire("Invalid", "Enter a valid 10-digit phone number", "warning");
      return;
    }
    setAddingUser(true);
    try {
      await axios.post(`${API}/points-users`, { phoneNumber: phone, adminId: adminName });
      setShowAdd(false);
      setSearch(phone);
      setPage(1);
      setTimeout(fetchUsers, 0);
      Swal.fire({
        icon: "success",
        title: "User added",
        text: `${phone} created with 0 points.`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      if (err.response?.status === 409) {
        Swal.fire("Already exists", `${phone} is already in the system.`, "info");
      } else {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to add user",
          "error"
        );
      }
    } finally {
      setAddingUser(false);
    }
  };

  // Note format from backend: "MANUAL-ADJUST | <reason> | by <adminId>"
  const parseAdjustNote = (note = "") => {
    const parts = String(note).split(" | ");
    const reason = parts[1] || "";
    const admin = (parts[2] || "").replace(/^by\s+/i, "").trim() || "unknown";
    return { admin, reason };
  };

  const openAdminLogs = async (user) => {
    setLogsTarget(user);
    setLogs([]);
    setShowLogs(true);
    setLogsLoading(true);
    try {
      const res = await axios.get(`${API}/points-transactions`, {
        params: { phone: user.phoneNumber, type: "manual-adjust", limit: 200 },
      });
      setLogs(res.data?.transactions || []);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to load admin logs",
        "error"
      );
    } finally {
      setLogsLoading(false);
    }
  };

  const viewTxns = (user) => {
    navigate(
      `/dashboard/points-transactions?phone=${encodeURIComponent(
        user.phoneNumber
      )}`
    );
  };

  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="container-fluid mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Points Users &amp; Balance</h3>
        <Button
          variant="success"
          onClick={openAddUser}
          style={{ background: "#1a7c3e", border: "none" }}
        >
          <FaUserPlus className="me-2" />
          Add User
        </Button>
      </div>

      <div
        className="bg-white p-3 rounded mb-3"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Form onSubmit={onSearch}>
          <InputGroup style={{ maxWidth: 420 }}>
            <Form.Control
              placeholder="Search by phone number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" variant="primary">
              <FaSearch className="me-1" />
              Search
            </Button>
            {search && (
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                  setTimeout(fetchUsers, 0);
                }}
              >
                Clear
              </Button>
            )}
          </InputGroup>
        </Form>
      </div>

      <div
        className="bg-white p-3 rounded"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Table hover responsive className="mb-0">
          <thead style={{ background: "#F0F2F5" }}>
            <tr>
              <th>Phone</th>
              <th>Balance</th>
              <th>Total Earned</th>
              <th>Total Spent</th>
              <th>Total Paid (₹)</th>
              <th>Last Activity</th>
              <th style={{ width: 140 }}>Admin Logs</th>
              <th style={{ width: 210 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="text-center text-muted py-4">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-muted py-4">
                  No users found.
                </td>
              </tr>
            )}
            {!loading &&
              users.map((u) => (
                <tr key={u._id || u.phoneNumber}>
                  <td>
                    <b>{u.phoneNumber}</b>
                  </td>
                  <td>
                    <Badge
                      bg={u.balance > 0 ? "success" : "secondary"}
                      style={{ fontSize: 13 }}
                    >
                      {u.balance || 0} pts
                    </Badge>
                  </td>
                  <td>{u.totalEarned || 0}</td>
                  <td>{u.totalSpent || 0}</td>
                  <td>₹{u.totalPaid || 0}</td>
                  <td style={{ fontSize: 12, color: "#666" }}>
                    {u.lastActivityAt
                      ? new Date(u.lastActivityAt).toLocaleString("en-IN")
                      : "—"}
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-info"
                      onClick={() => openAdminLogs(u)}
                    >
                      <FaUserShield className="me-1" />
                      Admin Logs
                    </Button>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => viewTxns(u)}
                      className="me-2"
                    >
                      <FaHistory className="me-1" />
                      Txns
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-success"
                      onClick={() => openAdjust(u)}
                    >
                      <FaCoins className="me-1" />
                      Adjust
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        {total > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span style={{ fontSize: 13, color: "#666" }}>
              Page {page} of {pageCount} · {total} users
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

      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Points User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>
            Phone number <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="tel"
            inputMode="numeric"
            maxLength={15}
            placeholder="e.g. 9876543210"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitAddUser();
            }}
          />
          <div className="mt-2" style={{ fontSize: 12, color: "#888" }}>
            Creates a new balance with <b>0 points</b>. You can credit points
            afterwards via the <b>Adjust</b> button. Leading <code>+91</code> or
            <code>0</code> is stripped automatically.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAdd(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={submitAddUser}
            disabled={addingUser}
            style={{ background: "#1a7c3e", border: "none" }}
          >
            {addingUser ? "Adding…" : "Add user"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showLogs}
        onHide={() => setShowLogs(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Admin Logs
            {logsTarget && (
              <span style={{ fontSize: 14, color: "#666", marginLeft: 10 }}>
                · {logsTarget.phoneNumber}
              </span>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>
            Manual credit/debit actions performed by admins on this user's
            balance. Entries come from the points ledger
            (<code>MANUAL-ADJUST</code>).
          </div>
          <Table size="sm" hover responsive className="mb-0">
            <thead style={{ background: "#F0F2F5" }}>
              <tr>
                <th>When</th>
                <th>Admin</th>
                <th>Action</th>
                <th>Points</th>
                <th>Balance After</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {logsLoading && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-3">
                    Loading…
                  </td>
                </tr>
              )}
              {!logsLoading && logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-3">
                    No admin adjustments for this user.
                  </td>
                </tr>
              )}
              {!logsLoading &&
                logs.map((t) => {
                  const { admin, reason } = parseAdjustNote(t.note);
                  return (
                    <tr key={t._id}>
                      <td style={{ fontSize: 12 }}>
                        {t.createdAt
                          ? new Date(t.createdAt).toLocaleString("en-IN")
                          : "—"}
                      </td>
                      <td>
                        <b>{admin}</b>
                      </td>
                      <td>
                        <Badge bg={t.type === "credit" ? "success" : "danger"}>
                          {t.type === "credit" ? "Credit (+)" : "Debit (-)"}
                        </Badge>
                      </td>
                      <td>{t.points}</td>
                      <td>{t.balanceAfter}</td>
                      <td style={{ fontSize: 13 }}>{reason || "—"}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogs(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAdjust} onHide={() => setShowAdjust(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Adjust Points Balance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {target && (
            <>
              <p className="mb-3" style={{ fontSize: 14 }}>
                User: <b>{target.phoneNumber}</b>
                <br />
                Current balance:{" "}
                <Badge bg="primary">{target.balance || 0} pts</Badge>
              </p>

              <Form.Label>Action</Form.Label>
              <div className="d-flex gap-3 mb-3">
                <Form.Check
                  type="radio"
                  label="Credit (+)"
                  checked={adjDir === "credit"}
                  onChange={() => setAdjDir("credit")}
                />
                <Form.Check
                  type="radio"
                  label="Debit (-)"
                  checked={adjDir === "debit"}
                  onChange={() => setAdjDir("debit")}
                />
              </div>

              <Form.Label>Points</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={adjPoints}
                onChange={(e) => setAdjPoints(e.target.value)}
                placeholder="e.g. 50"
                className="mb-3"
              />

              <Form.Label>Reason (required)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={adjReason}
                onChange={(e) => setAdjReason(e.target.value)}
                placeholder="e.g. Refund for failed contact reveal on rentId 12345"
              />
              <div
                className="mt-2"
                style={{ fontSize: 12, color: "#888" }}
              >
                Logged as <b>{adminName}</b>. Written to the transactions
                ledger and tagged <code>MANUAL-ADJUST</code>.
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAdjust(false)}>
            Cancel
          </Button>
          <Button
            variant={adjDir === "credit" ? "success" : "danger"}
            onClick={submitAdjust}
            disabled={saving}
          >
            {saving
              ? "Saving…"
              : adjDir === "credit"
              ? "Credit points"
              : "Debit points"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PointsUsers;
