// AI Assistant Leads — owner property leads captured by the user-app AI assistant.
// Admin can call, add a follow-up remark/status, and "Send to PreApproved" (which
// creates a status:'complete' property that appears on the PreApproved page and is
// NEVER live until approved there).
//
// These leads live on the assistant backend. In production it's the same PPC server
// (so REACT_APP_API_URL works); in local dev set REACT_APP_ASSISTANT_API to the
// locally-run assistant, e.g. http://localhost:5005/PPC.

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Badge, Form, Spinner } from 'react-bootstrap';

const BASE = (process.env.REACT_APP_ASSISTANT_API || process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');
const ENDPOINT = `${BASE}/assistant/admin/owner-leads`;

const STATUS_VARIANT = { new: 'secondary', contacted: 'info', preapproved: 'success', dropped: 'danger' };
const STATUS_OPTIONS = ['new', 'contacted', 'dropped'];

function fmtDate(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); } catch { return ''; }
}

export default function AiAssistantLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');       // '' = all
  const [busyId, setBusyId] = useState(null);
  const [drafts, setDrafts] = useState({});        // id -> { status, remark }
  const adminName = localStorage.getItem('adminName') || 'Admin';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter ? `${ENDPOINT}?status=${filter}` : ENDPOINT;
      const res = await axios.get(url);
      setLeads(res.data?.leads || []);
    } catch (e) {
      console.error('load leads failed', e.message);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const draftOf = (l) => drafts[l._id] || { status: l.status || 'new', remark: l.remark || '' };
  const setDraft = (id, patch) => setDrafts((d) => ({ ...d, [id]: { ...draftOf({ _id: id, ...leads.find((x) => x._id === id) }), ...patch } }));

  const saveFollowup = async (lead) => {
    const d = draftOf(lead);
    setBusyId(lead._id);
    try {
      const res = await axios.put(`${ENDPOINT}/${lead._id}`, {
        status: d.status, remark: d.remark, calledBy: adminName,
      });
      const updated = res.data?.lead;
      if (updated) setLeads((prev) => prev.map((l) => (l._id === lead._id ? { ...l, ...updated } : l)));
      alert('Follow-up saved.');
    } catch (e) {
      alert('Save failed: ' + (e.response?.data?.error || e.message));
    } finally {
      setBusyId(null);
    }
  };

  const sendToPreApproved = async (lead) => {
    if (!window.confirm('Create a PreApproved property from this lead? It will NOT go live until approved on the PreApproved page.')) return;
    setBusyId(lead._id);
    try {
      const res = await axios.post(`${ENDPOINT}/${lead._id}/preapprove`);
      const rentId = res.data?.rentId;
      setLeads((prev) => prev.map((l) => (l._id === lead._id ? { ...l, status: 'preapproved', rentId } : l)));
      alert(`Sent to PreApproved as Rent ID ${rentId} (not live).`);
    } catch (e) {
      const err = e.response?.data;
      if (err?.error === 'already_preapproved') alert(`Already preapproved as Rent ID ${err.rentId}.`);
      else alert('Failed: ' + (err?.error || e.message));
    } finally {
      setBusyId(null);
    }
  };

  const counts = leads.reduce((a, l) => ((a[l.status] = (a[l.status] || 0) + 1), a), {});

  return (
    <div className="p-3">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
        <h4 className="m-0">🤖 AI Assistant Leads <Badge bg="light" text="dark">{leads.length}</Badge></h4>
        <div className="d-flex align-items-center gap-2">
          <Form.Select size="sm" style={{ width: 160 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="preapproved">PreApproved</option>
            <option value="dropped">Dropped</option>
          </Form.Select>
          <Button size="sm" variant="outline-secondary" onClick={load}>↻ Refresh</Button>
        </div>
      </div>

      <div className="mb-2 text-muted" style={{ fontSize: 13 }}>
        New: {counts.new || 0} · Contacted: {counts.contacted || 0} · PreApproved: {counts.preapproved || 0} · Dropped: {counts.dropped || 0}
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : leads.length === 0 ? (
        <div className="text-center text-muted py-5">No leads yet. They appear here when users complete the owner flow in the AI assistant.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <Table striped bordered hover responsive size="sm" className="align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th><th>Date</th><th>Phone</th><th>Mode / Type</th><th>BHK</th>
                <th>Rent ₹</th><th>Advance ₹</th><th>Sqft</th><th>Floor</th><th>Car / Lift</th>
                <th>Area</th><th>Pincode</th><th>Street</th><th>Status</th>
                <th style={{ minWidth: 220 }}>Follow-up</th><th style={{ minWidth: 150 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l, i) => {
                const phone = l.contactPhone || l.phone || '';
                const d = draftOf(l);
                const done = l.status === 'preapproved';
                return (
                  <tr key={l._id}>
                    <td>{i + 1}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(l.createdAt)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {phone ? <a href={`tel:${phone}`} title="Call">📞 {phone}</a> : '—'}
                    </td>
                    <td>{l.propertyMode || '—'} / {l.propertyType || '—'}</td>
                    <td>{l.bedrooms || '—'}</td>
                    <td>{l.rentalAmount || '—'}</td>
                    <td>{l.advanceAmount || '—'}</td>
                    <td>{l.totalArea || '—'}</td>
                    <td>{l.floorNo || '—'}</td>
                    <td>{(l.carParking || '—')} / {(l.lift || '—')}</td>
                    <td>{l.area || '—'}</td>
                    <td>{l.pinCode || '—'}</td>
                    <td>{l.streetName || '—'}</td>
                    <td><Badge bg={STATUS_VARIANT[l.status] || 'secondary'}>{l.status}{l.rentId ? ` #${l.rentId}` : ''}</Badge></td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <Form.Select size="sm" value={d.status} disabled={done || busyId === l._id}
                          onChange={(e) => setDraft(l._id, { status: e.target.value })}>
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                          {done && <option value="preapproved">preapproved</option>}
                        </Form.Select>
                        <Form.Control size="sm" placeholder="Remark…" value={d.remark} disabled={busyId === l._id}
                          onChange={(e) => setDraft(l._id, { remark: e.target.value })} />
                        <Button size="sm" variant="outline-primary" disabled={busyId === l._id}
                          onClick={() => saveFollowup(l)}>Save</Button>
                      </div>
                    </td>
                    <td>
                      {done ? (
                        <Badge bg="success">✓ PreApproved #{l.rentId}</Badge>
                      ) : (
                        <Button size="sm" variant="success" disabled={busyId === l._id}
                          onClick={() => sendToPreApproved(l)}>
                          {busyId === l._id ? '…' : 'Send to PreApproved'}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
