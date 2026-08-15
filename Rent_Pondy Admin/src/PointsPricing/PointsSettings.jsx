import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Form, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

const API = process.env.REACT_APP_API_URL;

const PointsSettings = () => {
  const adminName =
    useSelector((s) => s.admin?.name) ||
    localStorage.getItem("adminName") ||
    "admin";

  const [config, setConfig] = useState(null);
  const [value, setValue] = useState(10);
  const [tenantValue, setTenantValue] = useState(20);
  const [touristValue, setTouristValue] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/points-config`);
      const cfg = res.data?.config;
      setConfig(cfg);
      setValue(cfg?.pointsPerContactReveal ?? 10);
      setTenantValue(cfg?.pointsPerTenantContactReveal ?? 20);
      setTouristValue(cfg?.pointsPerTouristContactReveal ?? 10);
    } catch (err) {
      Swal.fire("Error", "Failed to load config", "error");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    const n = Number(value);
    const tn = Number(tenantValue);
    const trn = Number(touristValue);
    if (
      !Number.isFinite(n) || n < 1 ||
      !Number.isFinite(tn) || tn < 1 ||
      !Number.isFinite(trn) || trn < 1
    ) {
      Swal.fire("Invalid", "All values must be at least 1", "warning");
      return;
    }
    setSaving(true);
    try {
      const res = await axios.put(`${API}/points-config`, {
        pointsPerContactReveal: n,
        pointsPerTenantContactReveal: tn,
        pointsPerTouristContactReveal: trn,
        adminId: adminName,
      });
      setConfig(res.data?.config);
      Swal.fire({
        icon: "success",
        title: "Saved",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to save",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-3" style={{ maxWidth: 720 }}>
      <h3 className="mb-3">Points Settings</h3>

      <div
        className="p-4 bg-white rounded"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" /> Loading…
          </div>
        ) : (
          <>
            <Form.Label>
              Points per contact reveal — Owner Number view{" "}
              <span className="text-muted" style={{ fontSize: 12 }}>
                (≥ 1)
              </span>
            </Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Form.Control
                type="number"
                min="1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                style={{ maxWidth: 160 }}
              />
              <span style={{ color: "#666", fontSize: 13 }}>
                points deducted per <code>view-owner-contact</code> action
              </span>
            </div>

            <Form.Label className="mt-3">
              Points per contact reveal — Tenant Number view{" "}
              <span className="text-muted" style={{ fontSize: 12 }}>
                (≥ 1)
              </span>
            </Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Form.Control
                type="number"
                min="1"
                value={tenantValue}
                onChange={(e) => setTenantValue(e.target.value)}
                style={{ maxWidth: 160 }}
              />
              <span style={{ color: "#666", fontSize: 13 }}>
                points deducted per <code>view-tenant-contact</code> action
              </span>
            </div>

            <Form.Label className="mt-3">
              Points per contact reveal — Tourist Lead{" "}
              <span className="text-muted" style={{ fontSize: 12 }}>
                (≥ 1)
              </span>
            </Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Form.Control
                type="number"
                min="1"
                value={touristValue}
                onChange={(e) => setTouristValue(e.target.value)}
                style={{ maxWidth: 160 }}
              />
              <span style={{ color: "#666", fontSize: 13 }}>
                points deducted per <code>view-tourist-contact</code> action
              </span>
            </div>

            <hr />

            <div style={{ fontSize: 13, color: "#555" }}>
              <div className="mb-1">
                <b>Current server value (owner contact):</b>{" "}
                {config?.pointsPerContactReveal ?? "—"}
              </div>
              <div className="mb-1">
                <b>Current server value (tenant number):</b>{" "}
                {config?.pointsPerTenantContactReveal ?? "—"}
              </div>
              <div className="mb-1">
                <b>Current server value (tourist lead):</b>{" "}
                {config?.pointsPerTouristContactReveal ?? "—"}
              </div>
              <div className="mb-1">
                <b>Last updated by:</b> {config?.updatedBy || "—"}
              </div>
              <div className="mb-1">
                <b>Last updated at:</b>{" "}
                {config?.updatedAt
                  ? new Date(config.updatedAt).toLocaleString("en-IN")
                  : "—"}
              </div>
            </div>

            <div className="mt-3 d-flex gap-2">
              <Button variant="primary" onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={fetchConfig}
                disabled={saving}
              >
                Reload
              </Button>
            </div>
          </>
        )}
      </div>

      <p className="text-muted mt-3" style={{ fontSize: 12 }}>
        Backend endpoints: <code>GET /points-config</code> ·{" "}
        <code>PUT /points-config</code>
      </p>
    </div>
  );
};

export default PointsSettings;
