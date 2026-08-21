// ============================================================
// PointsPopupPlans.jsx  —  "No Points Popup" screen
//
// Chooses which points plans the USER APP shows inside the
// insufficient-points popup (Rent_Pondy User/src/Components/
// InsufficientPointsModal.jsx) — the one that appears when a
// user tries to reveal a contact without enough points.
//
// The selection is stored on the PointsConfig singleton as
// `popupPlanIds` (an ordered array of PointsPlan _id strings),
// so this screen reuses the existing config endpoints:
//   GET  /points-config       -> { config: { popupPlanIds, ... } }
//   PUT  /points-config       <- { popupPlanIds: [...], adminId }
//   GET  /points-plans?all=1  -> every plan incl. hidden ones
//
// Selecting nothing is valid: the popup then falls back to the
// cheapest active plan, which is what it did before this screen
// existed.
// ============================================================

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, Spinner, Badge, Table, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const API = process.env.REACT_APP_API_URL;

const MAX_POPUP_PLANS = 3; // more than this and the popup starts scrolling

const PointsPopupPlans = () => {
  const adminName =
    useSelector((s) => s.admin?.name) ||
    localStorage.getItem("adminName") ||
    "admin";

  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState([]); // ordered _id strings
  const [savedIds, setSavedIds] = useState([]); // what the server currently holds
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [planRes, cfgRes] = await Promise.all([
        axios.get(`${API}/points-plans?all=1`),
        axios.get(`${API}/points-config`),
      ]);
      const list = planRes.data?.plans || [];
      const cfg = cfgRes.data?.config || null;
      // A plan deleted after being picked would otherwise sit in the list as an
      // unresolvable id, so drop anything we cannot show.
      const known = new Set(list.map((p) => String(p._id)));
      const ids = (cfg?.popupPlanIds || []).map(String).filter((id) => known.has(id));
      setPlans(list);
      setConfig(cfg);
      setSelected(ids);
      setSavedIds(ids);
    } catch (err) {
      Swal.fire("Error", "Failed to load plans or config", "error");
    } finally {
      setLoading(false);
    }
  };

  const byId = useMemo(() => new Map(plans.map((p) => [String(p._id), p])), [plans]);

  const dirty = useMemo(
    () => selected.join(",") !== savedIds.join(","),
    [selected, savedIds]
  );

  const toggle = (id) => {
    const key = String(id);
    setSelected((cur) => {
      if (cur.includes(key)) return cur.filter((x) => x !== key);
      if (cur.length >= MAX_POPUP_PLANS) {
        Swal.fire({
          icon: "info",
          title: `Up to ${MAX_POPUP_PLANS} plans`,
          text: "Uncheck one first — more than three makes the popup scroll on a phone.",
          timer: 2600,
          showConfirmButton: false,
        });
        return cur;
      }
      return [...cur, key];
    });
  };

  const move = (id, dir) => {
    setSelected((cur) => {
      const i = cur.indexOf(String(id));
      const j = i + dir;
      if (i < 0 || j < 0 || j >= cur.length) return cur;
      const next = [...cur];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`${API}/points-config`, {
        popupPlanIds: selected,
        adminId: adminName,
      });
      const cfg = res.data?.config;
      setConfig(cfg);
      setSavedIds((cfg?.popupPlanIds || []).map(String));
      Swal.fire({
        icon: "success",
        title: "Saved",
        text: selected.length
          ? "The popup now shows the selected plans."
          : "Cleared — the popup falls back to the cheapest active plan.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const activePlans = plans.filter((p) => p.active);
  const hiddenSelected = selected.filter((id) => byId.get(id) && !byId.get(id).active);
  const cheapestActive = [...activePlans].sort((a, b) => a.price - b.price)[0];

  return (
    <div className="container mt-3" style={{ maxWidth: 980 }}>
      <h3 className="mb-1">No Points Popup — Plans</h3>
      <p className="text-muted" style={{ fontSize: 13 }}>
        Pick which plans appear in the popup a user sees when they try to view a
        contact without enough points. Leave everything unchecked to fall back to
        the cheapest active plan.
      </p>

      {loading ? (
        <div className="text-center py-5 bg-white rounded">
          <Spinner animation="border" size="sm" /> Loading…
        </div>
      ) : (
        <div className="row g-3">
          {/* ── plan picker ── */}
          <div className="col-12 col-lg-7">
            <div
              className="p-3 bg-white rounded"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <b>All points plans</b>
                <span className="text-muted" style={{ fontSize: 12 }}>
                  {selected.length}/{MAX_POPUP_PLANS} selected
                </span>
              </div>

              {plans.length === 0 ? (
                <div className="text-muted py-3">
                  No points plans exist yet. Create them in <b>Points Plans - List</b>{" "}
                  first.
                </div>
              ) : (
                <Table hover size="sm" className="align-middle mb-0">
                  <thead>
                    <tr style={{ fontSize: 12, color: "#666" }}>
                      <th style={{ width: 40 }}>Show</th>
                      <th>Plan</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Points</th>
                      <th className="text-center">Status</th>
                      <th className="text-center" style={{ width: 90 }}>
                        Order
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((p) => {
                      const id = String(p._id);
                      const pos = selected.indexOf(id);
                      const isOn = pos >= 0;
                      return (
                        <tr key={id} style={{ opacity: p.active ? 1 : 0.55 }}>
                          <td>
                            <Form.Check
                              type="checkbox"
                              checked={isOn}
                              onChange={() => toggle(id)}
                              disabled={!p.active && !isOn}
                              title={
                                p.active
                                  ? "Show this plan in the popup"
                                  : "Hidden plans cannot be added"
                              }
                            />
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{p.name}</div>
                            {p.description ? (
                              <div className="text-muted" style={{ fontSize: 11.5 }}>
                                {p.description}
                              </div>
                            ) : null}
                          </td>
                          <td className="text-end">₹{p.price}</td>
                          <td className="text-end">{p.points}</td>
                          <td className="text-center">
                            {p.active ? (
                              <Badge bg="success">active</Badge>
                            ) : (
                              <Badge bg="secondary">hidden</Badge>
                            )}
                          </td>
                          <td className="text-center">
                            {isOn ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                  className="py-0 px-1"
                                  disabled={pos === 0}
                                  onClick={() => move(id, -1)}
                                  title="Move up"
                                >
                                  ↑
                                </Button>{" "}
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                  className="py-0 px-1"
                                  disabled={pos === selected.length - 1}
                                  onClick={() => move(id, 1)}
                                  title="Move down"
                                >
                                  ↓
                                </Button>
                              </>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </div>
          </div>

          {/* ── preview ── */}
          <div className="col-12 col-lg-5">
            <div
              className="p-3 bg-white rounded"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            >
              <b>What the user will see</b>
              <div
                className="mt-2 p-3"
                style={{
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, rgba(79,75,126,0.07), rgba(245,87,108,0.07))",
                }}
              >
                <div style={{ fontWeight: 700, color: "#4F4B7E" }}>
                  Unlock Owner Contact
                </div>
                <div className="text-muted" style={{ fontSize: 12 }}>
                  You need points to view this owner&apos;s details
                </div>

                {selected.length === 0 ? (
                  <div className="mt-3" style={{ fontSize: 12.5 }}>
                    <Badge bg="warning" text="dark">
                      Fallback
                    </Badge>{" "}
                    {cheapestActive ? (
                      <>
                        cheapest active plan — <b>{cheapestActive.name}</b> (₹
                        {cheapestActive.price} / {cheapestActive.points} pts)
                      </>
                    ) : (
                      <span className="text-danger">
                        no active plan exists, so the popup has nothing to sell
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 d-grid gap-2">
                    {selected.map((id, i) => {
                      const p = byId.get(id);
                      if (!p) return null;
                      return (
                        <div
                          key={id}
                          className="d-flex justify-content-between align-items-center px-3 py-2"
                          style={{
                            background: "#fff",
                            borderRadius: 10,
                            border:
                              i === 0
                                ? "2px solid #4F4B7E"
                                : "1px solid rgba(79,75,126,0.25)",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13 }}>
                              {p.name}{" "}
                              {i === 0 && (
                                <Badge bg="primary" style={{ fontSize: 9 }}>
                                  preselected
                                </Badge>
                              )}
                            </div>
                            <div className="text-muted" style={{ fontSize: 11 }}>
                              {p.points} points
                            </div>
                          </div>
                          <div style={{ fontWeight: 800, color: "#4F4B7E" }}>
                            ₹{p.price}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {hiddenSelected.length > 0 && (
                <div
                  className="alert alert-warning mt-3 mb-0 py-2"
                  style={{ fontSize: 12 }}
                >
                  {hiddenSelected.length} selected plan
                  {hiddenSelected.length > 1 ? "s are" : " is"} hidden. Hidden plans
                  are skipped by the app — uncheck or re-activate them.
                </div>
              )}

              <div className="mt-3 d-flex gap-2">
                <Button variant="primary" onClick={save} disabled={saving || !dirty}>
                  {saving ? "Saving…" : dirty ? "Save" : "Saved"}
                </Button>
                <Button variant="outline-secondary" onClick={loadAll} disabled={saving}>
                  Reload
                </Button>
              </div>

              <div className="mt-3" style={{ fontSize: 12, color: "#555" }}>
                <div>
                  <b>Last updated by:</b> {config?.updatedBy || "—"}
                </div>
                <div>
                  <b>Last updated at:</b>{" "}
                  {config?.updatedAt
                    ? new Date(config.updatedAt).toLocaleString("en-IN")
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-muted mt-3" style={{ fontSize: 12 }}>
        Backend endpoints: <code>GET /points-plans?all=1</code> ·{" "}
        <code>GET /points-config</code> · <code>PUT /points-config</code>. The app
        reads the result from <code>GET /points-config-public</code>.
      </p>
    </div>
  );
};

export default PointsPopupPlans;
