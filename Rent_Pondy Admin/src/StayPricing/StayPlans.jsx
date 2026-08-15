import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Modal, Button, Form, Badge } from "react-bootstrap";
import { FaEdit, FaPlus, FaStar } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";

const API = process.env.REACT_APP_API_URL;

const emptyForm = {
  name: "",
  description: "",
  price: "",
  maxListings: 1,
  durationDays: "",
  featured: false,
  popular: false,
  sortOrder: 0,
  active: true,
};

// Admin: create / edit "Stay Owners Plan" listing subscriptions.
const StayPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/stay-plans`, { params: { all: 1 } });
      setPlans(res.data?.plans || []);
    } catch (err) {
      Swal.fire("Error", "Failed to load plans", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (plan) => {
    setForm({
      name: plan.name || "",
      description: plan.description || "",
      price: plan.price ?? "",
      maxListings: plan.maxListings ?? 1,
      durationDays: plan.durationDays ?? "",
      featured: !!plan.featured,
      popular: !!plan.popular,
      sortOrder: plan.sortOrder ?? 0,
      active: plan.active !== false,
    });
    setEditingId(plan._id);
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!(Number(form.price) > 0)) e.price = "Price must be greater than 0";
    if (form.maxListings !== "" && Number(form.maxListings) < 0)
      e.maxListings = "Cannot be negative";
    if (form.durationDays !== "" && Number(form.durationDays) < 0)
      e.durationDays = "Duration cannot be negative";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSave = async () => {
    if (!validate()) return;
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      maxListings: Number(form.maxListings) || 0,
      durationDays: Number(form.durationDays) || 0,
      featured: !!form.featured,
      popular: !!form.popular,
      sortOrder: Number(form.sortOrder) || 0,
      active: form.active,
    };
    try {
      if (editingId) {
        await axios.put(`${API}/stay-plans/${editingId}`, payload);
      } else {
        await axios.post(`${API}/stay-plans`, payload);
      }
      setShowModal(false);
      await fetchPlans();
      Swal.fire({
        icon: "success",
        title: editingId ? "Plan updated" : "Plan created",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to save plan", "error");
    }
  };

  const toggleActive = async (plan) => {
    try {
      await axios.patch(`${API}/stay-plans/${plan._id}/active`, { active: !plan.active });
      await fetchPlans();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to toggle", "error");
    }
  };

  const hardDelete = async (plan) => {
    const result = await Swal.fire({
      title: "Delete this plan?",
      html: `This will permanently delete <b>${plan.name}</b>. This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#d33",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API}/stay-plans/${plan._id}`);
      await fetchPlans();
      Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to delete", "error");
    }
  };

  return (
    <div className="container-fluid mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">🏖️ Stay Pricing Plan — Owners</h3>
        <Button variant="success" onClick={openCreate} style={{ background: "#1a7c3e", border: "none" }}>
          <FaPlus className="me-2" />
          Create Plan
        </Button>
      </div>

      <div className="bg-white p-3 rounded" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <Table hover responsive className="mb-0">
          <thead style={{ background: "#F0F2F5" }}>
            <tr>
              <th style={{ width: 60 }}>Sort</th>
              <th>Name</th>
              <th>Description</th>
              <th style={{ width: 90 }}>Price (₹)</th>
              <th style={{ width: 100 }}>Listings</th>
              <th style={{ width: 110 }}>Duration</th>
              <th style={{ width: 90 }}>Featured</th>
              <th style={{ width: 90 }}>Popular</th>
              <th style={{ width: 100 }}>Active</th>
              <th style={{ width: 130 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={10} className="text-center text-muted py-4">Loading…</td></tr>
            )}
            {!loading && plans.length === 0 && (
              <tr><td colSpan={10} className="text-center text-muted py-4">No plans yet. Click <b>Create Plan</b> to add one.</td></tr>
            )}
            {!loading && plans.map((p) => (
              <tr key={p._id}>
                <td>{p.sortOrder ?? 0}</td>
                <td><b>{p.name}</b></td>
                <td style={{ fontSize: 13, color: "#555", maxWidth: 260 }}>{p.description || "—"}</td>
                <td>₹{p.price}</td>
                <td>{p.maxListings ? `${p.maxListings}` : "Unlimited"}</td>
                <td>{p.durationDays ? `${p.durationDays} days` : "—"}</td>
                <td>{p.featured ? <Badge bg="info">Featured</Badge> : <span style={{ color: "#bbb" }}>—</span>}</td>
                <td>{p.popular ? <Badge bg="warning" text="dark"><FaStar className="me-1" />Popular</Badge> : <span style={{ color: "#bbb" }}>—</span>}</td>
                <td>
                  <Form.Check
                    type="switch"
                    checked={p.active !== false}
                    onChange={() => toggleActive(p)}
                    label={<span style={{ fontSize: 12, color: p.active !== false ? "#1a7c3e" : "#999" }}>{p.active !== false ? "Active" : "Hidden"}</span>}
                  />
                </td>
                <td>
                  <FaEdit title="Edit" onClick={() => openEdit(p)} style={{ cursor: "pointer", color: "#0d6efd", marginRight: 16 }} />
                  <MdDeleteForever title="Delete plan" size={20} onClick={() => hardDelete(p)} style={{ cursor: "pointer", color: "#dc3545" }} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <p className="text-muted mt-3" style={{ fontSize: 12 }}>
        Only <b>active</b> plans are shown to owners at <code className="ms-1">GET /stay-plans</code>.
        A successful PayU purchase grants/extends the owner's stay subscription.
      </p>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Stay Plan" : "Create Stay Plan"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Label>Name <span className="text-danger">*</span></Form.Label>
              <Form.Control value={form.name} onChange={handleChange("name")} placeholder="e.g. Owner Starter" isInvalid={!!errors.name} />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </div>
            <div className="col-md-6">
              <Form.Label>Sort Order</Form.Label>
              <Form.Control type="number" value={form.sortOrder} onChange={handleChange("sortOrder")} placeholder="0" />
            </div>
            <div className="col-12">
              <Form.Label>Description</Form.Label>
              <Form.Control value={form.description} onChange={handleChange("description")} placeholder="Short marketing line shown under the plan title" />
            </div>
            <div className="col-md-4">
              <Form.Label>Price (₹) <span className="text-danger">*</span></Form.Label>
              <Form.Control type="number" min="1" value={form.price} onChange={handleChange("price")} isInvalid={!!errors.price} />
              <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
            </div>
            <div className="col-md-4">
              <Form.Label>Max Listings</Form.Label>
              <Form.Control type="number" min="0" value={form.maxListings} onChange={handleChange("maxListings")} placeholder="0 = unlimited" isInvalid={!!errors.maxListings} />
              <Form.Control.Feedback type="invalid">{errors.maxListings}</Form.Control.Feedback>
            </div>
            <div className="col-md-4">
              <Form.Label>Duration (days)</Form.Label>
              <Form.Control type="number" min="0" value={form.durationDays} onChange={handleChange("durationDays")} placeholder="0 = no expiry" isInvalid={!!errors.durationDays} />
              <Form.Control.Feedback type="invalid">{errors.durationDays}</Form.Control.Feedback>
            </div>
            <div className="col-md-4 d-flex align-items-center">
              <Form.Check type="checkbox" label="Featured placement" checked={form.featured} onChange={handleChange("featured")} />
            </div>
            <div className="col-md-4 d-flex align-items-center">
              <Form.Check type="checkbox" label="Mark as MOST POPULAR" checked={form.popular} onChange={handleChange("popular")} />
            </div>
            <div className="col-md-4 d-flex align-items-center">
              <Form.Check type="checkbox" label="Active (visible to users)" checked={form.active} onChange={handleChange("active")} />
            </div>
            {form.price > 0 && (
              <div className="col-12">
                <div className="p-2 rounded" style={{ background: "#F0F7FF", fontSize: 13 }}>
                  Preview: <b>{form.name || "Plan"}</b> — ₹{form.price} for{" "}
                  {Number(form.maxListings) > 0 ? `${form.maxListings} listing(s)` : "unlimited listings"}
                  {form.durationDays > 0 && `, valid ${form.durationDays} days`}
                  {form.featured && ", featured"}
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>{editingId ? "Save changes" : "Create plan"}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StayPlans;
