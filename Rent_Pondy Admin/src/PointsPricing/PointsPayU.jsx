import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Table, Form, Button, InputGroup, Badge } from "react-bootstrap";
import { FaSearch, FaSync, FaPrint, FaFileExcel, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const API = process.env.REACT_APP_API_URL;

// Maps an admin-friendly tab key to the backend status used by the
// PointsPayU collection (`payustatususer` field) and the route path.
const TABS = [
  { key: "paid",       label: "Paid",        path: "paid",        bg: "success",  icon: "🟢" },
  { key: "pay now",    label: "Pay Now",     path: "pay-now",     bg: "primary",  icon: "🔵" },
  { key: "pay later",  label: "Pay Later",   path: "pay-later",   bg: "warning",  icon: "🟡" },
  { key: "pay failed", label: "Pay Failed",  path: "pay-failed",  bg: "danger",   icon: "🔴" },
];

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return String(d);
  }
};

const PointsPayU = () => {
  const [tab, setTab] = useState("paid");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [phoneFilter, setPhoneFilter] = useState("");
  const [txnFilter, setTxnFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const tableRef = useRef(null);

  const activeTab = TABS.find((t) => t.key === tab) || TABS[0];

  const fetchRows = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API}/payu/points-payments/${activeTab.path}`
      );
      setRows(res.data?.payments || []);
    } catch (err) {
      const status = err?.response?.status;
      // Backend returns 404 with "no payments found" — show empty table
      // instead of an error toast.
      if (status === 404) {
        setRows([]);
      } else {
        Swal.fire(
          "Error",
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load PayU records",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (phoneFilter && !(r.phone || "").includes(phoneFilter.trim())) return false;
      if (txnFilter) {
        const q = txnFilter.trim().toLowerCase();
        const hay = `${r.txnid || ""} ${r.mihpayid || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      const created = r.createdAt ? new Date(r.createdAt) : null;
      if (startDate && created && created < new Date(startDate)) return false;
      if (endDate && created) {
        const e = new Date(endDate);
        e.setHours(23, 59, 59, 999);
        if (created > e) return false;
      }
      return true;
    });
  }, [rows, phoneFilter, txnFilter, startDate, endDate]);

  // Aggregate stats over the currently visible rows.
  const stats = useMemo(() => {
    const totalAmount = filtered.reduce(
      (s, r) => s + (Number(r.amount) || 0),
      0
    );
    const totalPoints = filtered.reduce(
      (s, r) => s + (Number(r.points) || 0),
      0
    );
    return { count: filtered.length, totalAmount, totalPoints };
  }, [filtered]);

  const resetFilters = () => {
    setPhoneFilter("");
    setTxnFilter("");
    setStartDate("");
    setEndDate("");
  };

  // Delete is offered for every status except "paid" (completed real
  // transactions are protected on the backend too).
  const showActions = activeTab.key !== "paid";

  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: "Delete this record?",
      html: `Phone <b>${row.phone || "—"}</b> · txnid <code>${
        row.txnid || "—"
      }</code><br/>This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#d33",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API}/payu/points-payments/${row._id}`);
      setRows((prev) => prev.filter((r) => r._id !== row._id));
      Swal.fire("Deleted", "The record has been deleted.", "success");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete record.",
        "error"
      );
    }
  };

  const handlePrint = () => {
    if (!tableRef.current) return;
    const w = window.open("", "", "width=1200,height=800");
    w.document.write(`
      <html><head><title>Points PayU - ${activeTab.label}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 16px; }
        h2 { margin: 0 0 12px; }
        table { border-collapse: collapse; width: 100%; font-size: 12px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background: #f0f0f0; }
        .meta { margin-bottom: 12px; font-size: 12px; color: #555; }
      </style></head><body>
        <h2>Points PayU — ${activeTab.label}</h2>
        <div class="meta">
          Records: ${stats.count} · Amount ₹${stats.totalAmount} · Points ${stats.totalPoints}
        </div>
        <table>${tableRef.current.innerHTML}</table>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  const handleExportCsv = () => {
    if (filtered.length === 0) {
      Swal.fire("Nothing to export", "No rows match the current filters.", "info");
      return;
    }
    const headers = [
      "Date", "txnid", "mihpayid", "Phone", "Name", "Email",
      "Plan", "Points", "Amount (₹)", "Status",
    ];
    const escape = (v) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [
      headers.join(","),
      ...filtered.map((r) => [
        formatDate(r.createdAt),
        r.txnid,
        r.mihpayid,
        r.phone,
        r.firstname,
        r.email,
        r.planName,
        r.points,
        r.amount,
        r.payustatususer,
      ].map(escape).join(",")),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `points-payu-${activeTab.path}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-fluid mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h3 className="m-0">Points PayU Transactions</h3>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={fetchRows}>
            <FaSync className="me-1" /> Refresh
          </Button>
          <Button variant="outline-primary" size="sm" onClick={handleExportCsv}>
            <FaFileExcel className="me-1" /> Export CSV
          </Button>
          <Button variant="outline-dark" size="sm" onClick={handlePrint}>
            <FaPrint className="me-1" /> Print
          </Button>
        </div>
      </div>

      {/* Status tabs */}
      <div
        className="bg-white p-2 rounded mb-3 d-flex flex-wrap gap-2"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        {TABS.map((t) => (
          <Button
            key={t.key}
            size="sm"
            variant={tab === t.key ? t.bg : `outline-${t.bg}`}
            onClick={() => setTab(t.key)}
            style={{ minWidth: 110 }}
          >
            <span className="me-1">{t.icon}</span>
            {t.label}
          </Button>
        ))}
      </div>

      {/* Stat strip */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Stat label="Records" value={stats.count} />
        <Stat label="Total Amount" value={`₹ ${stats.totalAmount.toLocaleString("en-IN")}`} />
        <Stat label="Total Points" value={stats.totalPoints.toLocaleString("en-IN")} />
      </div>

      {/* Filter row */}
      <div
        className="bg-white p-3 rounded mb-3"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <Form.Label className="small mb-1">Phone</Form.Label>
            <InputGroup size="sm">
              <InputGroup.Text><FaSearch size={11} /></InputGroup.Text>
              <Form.Control
                placeholder="e.g. 9876543210"
                value={phoneFilter}
                onChange={(e) => setPhoneFilter(e.target.value)}
              />
            </InputGroup>
          </div>
          <div className="col-md-3">
            <Form.Label className="small mb-1">txnid / mihpayid</Form.Label>
            <Form.Control
              size="sm"
              placeholder="search by id"
              value={txnFilter}
              onChange={(e) => setTxnFilter(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <Form.Label className="small mb-1">From</Form.Label>
            <Form.Control
              size="sm"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <Form.Label className="small mb-1">To</Form.Label>
            <Form.Control
              size="sm"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={resetFilters}
              className="w-100"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-white p-3 rounded"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <div ref={tableRef}>
          <Table hover responsive size="sm" className="mb-0">
            <thead style={{ background: "#F0F2F5" }}>
              <tr>
                <th style={{ width: 150 }}>Date</th>
                <th>txnid</th>
                <th>mihpayid</th>
                <th>Phone</th>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th>
                <th style={{ width: 80 }}>Points</th>
                <th style={{ width: 100 }}>Amount</th>
                <th style={{ width: 110 }}>Status</th>
                {showActions && <th style={{ width: 90 }}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={showActions ? 11 : 10} className="text-center text-muted py-4">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={showActions ? 11 : 10} className="text-center text-muted py-4">
                    No PayU records match these filters.
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((r) => (
                  <tr key={r._id || r.txnid}>
                    <td style={{ fontSize: 12 }}>{formatDate(r.createdAt)}</td>
                    <td style={{ fontSize: 11, fontFamily: "monospace" }}>
                      {r.txnid || "—"}
                    </td>
                    <td style={{ fontSize: 11, fontFamily: "monospace" }}>
                      {r.mihpayid || "—"}
                    </td>
                    <td><b>{r.phone || "—"}</b></td>
                    <td>{r.firstname || "—"}</td>
                    <td style={{ fontSize: 12 }}>{r.email || "—"}</td>
                    <td style={{ fontSize: 12 }}>{r.planName || r.planId || "—"}</td>
                    <td>
                      <Badge bg="info">{r.points || 0}</Badge>
                    </td>
                    <td>
                      <b>₹{Number(r.amount || 0).toLocaleString("en-IN")}</b>
                    </td>
                    <td>
                      <StatusBadge status={r.payustatususer} />
                    </td>
                    {showActions && (
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          title="Delete record"
                          onClick={() => handleDelete(r)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>

      <p className="text-muted mt-3" style={{ fontSize: 12 }}>
        Source: <code>GET /payu/points-payments/{activeTab.path}</code>
      </p>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div
    className="bg-white px-3 py-2 rounded"
    style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.06)", minWidth: 140 }}
  >
    <div style={{ fontSize: 11, color: "#888", letterSpacing: 0.4, textTransform: "uppercase" }}>
      {label}
    </div>
    <div style={{ fontSize: 16, fontWeight: 800, color: "#4F4B7E" }}>{value}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    paid:        { bg: "success",  text: "Paid" },
    "pay now":   { bg: "primary",  text: "Pay Now" },
    "pay later": { bg: "warning",  text: "Pay Later" },
    "pay failed":{ bg: "danger",   text: "Pay Failed" },
  };
  const m = map[status] || { bg: "secondary", text: status || "—" };
  return <Badge bg={m.bg}>{m.text}</Badge>;
};

export default PointsPayU;
