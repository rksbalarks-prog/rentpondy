import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Table, Form, Button, Badge } from "react-bootstrap";
import { FaFilter, FaSync } from "react-icons/fa";
import Swal from "sweetalert2";

const API = process.env.REACT_APP_API_URL;

const TYPE_OPTIONS = [
  { value: "", label: "All types" },
  { value: "purchase", label: "Purchase (PayU credit)" },
  { value: "contact-reveal", label: "Contact reveal" },
  { value: "manual-adjust", label: "Manual adjust" },
  { value: "credit", label: "All credits" },
  { value: "deduct", label: "All deducts" },
];

// Derive a display type label from a raw transaction row.
const classifyTxn = (t) => {
  if (t.note && /^MANUAL-ADJUST/i.test(t.note)) return "manual-adjust";
  if (t.type === "credit" && t.txnId) return "purchase";
  if (t.type === "deduct" && t.reason === "view-owner-contact")
    return "contact-reveal";
  return t.type;
};

const TYPE_BADGE = {
  purchase: { bg: "success", label: "Purchase" },
  "contact-reveal": { bg: "info", label: "Contact reveal" },
  "manual-adjust": { bg: "warning", label: "Manual adjust" },
  credit: { bg: "success", label: "Credit" },
  deduct: { bg: "danger", label: "Deduct" },
};

const PointsTransactions = () => {
  const [params, setParams] = useSearchParams();

  const [plans, setPlans] = useState([]);
  const [txns, setTxns] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    phone: params.get("phone") || "",
    type: params.get("type") || "",
    planId: params.get("planId") || "",
    from: params.get("from") || "",
    to: params.get("to") || "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/points-plans`, { params: { all: 1 } });
        setPlans(res.data?.plans || []);
      } catch {
        /* non-blocking */
      }
    })();
  }, []);

  useEffect(() => {
    fetchTxns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchTxns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/points-transactions`, {
        params: {
          page,
          limit,
          phone: filters.phone || undefined,
          type: filters.type || undefined,
          planId: filters.planId || undefined,
          from: filters.from || undefined,
          to: filters.to || undefined,
        },
      });
      setTxns(res.data?.transactions || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      Swal.fire("Error", "Failed to load transactions", "error");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (e) => {
    e?.preventDefault?.();
    const next = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) next[k] = v;
    });
    setParams(next);
    setPage(1);
    setTimeout(fetchTxns, 0);
  };

  const resetFilters = () => {
    setFilters({ phone: "", type: "", planId: "", from: "", to: "" });
    setParams({});
    setPage(1);
    setTimeout(fetchTxns, 0);
  };

  const setF = (k) => (e) =>
    setFilters((f) => ({ ...f, [k]: e.target.value }));

  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="container-fluid mt-3">
      <h3 className="mb-3">Points Transactions</h3>

      <div
        className="bg-white p-3 rounded mb-3"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Form onSubmit={applyFilters}>
          <div className="row g-2 align-items-end">
            <div className="col-md-2">
              <Form.Label className="small">Phone</Form.Label>
              <Form.Control
                size="sm"
                value={filters.phone}
                onChange={setF("phone")}
                placeholder="e.g. 9876543210"
              />
            </div>
            <div className="col-md-2">
              <Form.Label className="small">Type</Form.Label>
              <Form.Select
                size="sm"
                value={filters.type}
                onChange={setF("type")}
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-3">
              <Form.Label className="small">Plan</Form.Label>
              <Form.Select
                size="sm"
                value={filters.planId}
                onChange={setF("planId")}
              >
                <option value="">All plans</option>
                {plans.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (₹{p.price})
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-2">
              <Form.Label className="small">From</Form.Label>
              <Form.Control
                size="sm"
                type="date"
                value={filters.from}
                onChange={setF("from")}
              />
            </div>
            <div className="col-md-2">
              <Form.Label className="small">To</Form.Label>
              <Form.Control
                size="sm"
                type="date"
                value={filters.to}
                onChange={setF("to")}
              />
            </div>
            <div className="col-md-1 d-flex gap-2">
              <Button size="sm" type="submit" variant="primary">
                <FaFilter />
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
              <th style={{ width: 150 }}>Date</th>
              <th style={{ width: 130 }}>Phone</th>
              <th style={{ width: 130 }}>Type</th>
              <th style={{ width: 90 }}>Points</th>
              <th style={{ width: 100 }}>Balance</th>
              <th>Plan</th>
              <th style={{ width: 90 }}>Amount</th>
              <th>Ref</th>
              <th>Note / Reason</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={9} className="text-center text-muted py-4">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && txns.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-muted py-4">
                  No transactions match these filters.
                </td>
              </tr>
            )}
            {!loading &&
              txns.map((t) => {
                const cls = classifyTxn(t);
                const badge = TYPE_BADGE[cls] || {
                  bg: "secondary",
                  label: cls,
                };
                const isCredit = t.type === "credit";
                return (
                  <tr key={t._id}>
                    <td style={{ fontSize: 12 }}>
                      {new Date(t.createdAt).toLocaleString("en-IN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td>{t.phoneNumber}</td>
                    <td>
                      <Badge bg={badge.bg}>{badge.label}</Badge>
                    </td>
                    <td
                      style={{
                        color: isCredit ? "#1a7c3e" : "#dc3545",
                        fontWeight: 600,
                      }}
                    >
                      {isCredit ? "+" : "−"}
                      {t.points}
                    </td>
                    <td>{t.balanceAfter}</td>
                    <td style={{ fontSize: 12 }}>
                      {t.planName || t.planId || "—"}
                    </td>
                    <td>{t.amount ? `₹${t.amount}` : "—"}</td>
                    <td style={{ fontSize: 11, color: "#666" }}>
                      {t.txnId && <div>txn: {t.txnId}</div>}
                      {t.rentId && <div>rent: {t.rentId}</div>}
                      {!t.txnId && !t.rentId && "—"}
                    </td>
                    <td style={{ fontSize: 12, color: "#555", maxWidth: 280 }}>
                      {t.note || t.reason || "—"}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>

        {total > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span style={{ fontSize: 13, color: "#666" }}>
              Page {page} of {pageCount} · {total} transactions
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
    </div>
  );
};

export default PointsTransactions;
