// AI Guardrail Log — read-only view of the chatbot's security guardrail: manipulation
// attempts it caught, the attack patterns it auto-learned, and block stats. Data is
// collected automatically by the assistant backend (ai_guardrail_event /
// ai_guardrail_pattern); this screen just reads it.
//
// API base: same convention as AiChatHistory.

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Badge, Spinner, Card, Row, Col, Button, Form } from 'react-bootstrap';

const BASE = (process.env.REACT_APP_ASSISTANT_API || process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');
const API = `${BASE}/assistant/admin`;

const fmt = (d) => { try { return new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); } catch { return ''; } };
const catBadge = (c) =>
  c === 'jailbreak' ? 'danger' : c === 'impersonation' ? 'warning' : c === 'contact_extraction' ? 'info' : 'secondary';

export default function AiGuardrailLog() {
  const [stats, setStats] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [st, pt, ev] = await Promise.all([
        axios.get(`${API}/guardrail-stats`).catch(() => ({ data: {} })),
        axios.get(`${API}/guardrail-patterns`).catch(() => ({ data: {} })),
        axios.get(`${API}/guardrail-events`, { params: category ? { category } : {} }).catch(() => ({ data: {} })),
      ]);
      setStats(st.data || {});
      setPatterns(pt.data?.patterns || []);
      setEvents(ev.data?.events || []);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { load(); }, [load]);

  const totals = stats?.totals || { all: 0, blocked: 0, last30: 0 };
  const byCat = stats?.byCategory || [];

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">🛡️ Chatbot Guardrail Log</h4>
        <Button variant="outline-secondary" size="sm" onClick={load} disabled={loading}>Reload</Button>
      </div>

      {loading && <div className="text-center p-4"><Spinner animation="border" /></div>}

      {!loading && (
        <>
          <Row className="g-2 mb-3">
            <Col xs={6} md={3}><Card body className="text-center"><div className="h3 mb-0">{totals.all}</div><small className="text-muted">Total attempts</small></Card></Col>
            <Col xs={6} md={3}><Card body className="text-center"><div className="h3 mb-0 text-danger">{totals.blocked}</div><small className="text-muted">Blocked</small></Card></Col>
            <Col xs={6} md={3}><Card body className="text-center"><div className="h3 mb-0">{totals.last30}</div><small className="text-muted">Last 30 days</small></Card></Col>
            <Col xs={6} md={3}><Card body className="text-center"><div className="h3 mb-0">{patterns.length}</div><small className="text-muted">Learned patterns</small></Card></Col>
          </Row>

          {byCat.length > 0 && (
            <div className="mb-3">
              {byCat.map((c) => (
                <Badge key={c._id || 'x'} bg={catBadge(c._id)} className="me-2">
                  {c._id || 'unknown'}: {c.attempts}
                </Badge>
              ))}
            </div>
          )}

          <Card className="mb-3">
            <Card.Header>Learned attack patterns (most frequent first)</Card.Header>
            <Card.Body className="p-0">
              <Table hover responsive size="sm" className="mb-0 align-middle">
                <thead><tr><th>Category</th><th>Signals</th><th>Count</th><th>Max severity</th><th>Last seen</th><th>Sample</th></tr></thead>
                <tbody>
                  {patterns.length === 0 && <tr><td colSpan={6} className="text-center text-muted py-3">No patterns learned yet.</td></tr>}
                  {patterns.map((p, i) => (
                    <tr key={i}>
                      <td><Badge bg={catBadge(p.category)}>{p.category}</Badge></td>
                      <td className="small">{(p.signals || []).join(', ')}</td>
                      <td><b>{p.count}</b></td>
                      <td>{p.severityMax}</td>
                      <td className="small text-muted">{fmt(p.lastSeen)}</td>
                      <td className="small text-muted" style={{ maxWidth: 240, whiteSpace: 'normal' }}>{p.sampleSnippet}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Recent attempts</span>
              <Form.Select size="sm" style={{ width: 220 }} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All categories</option>
                <option value="contact_extraction">Contact extraction</option>
                <option value="jailbreak">Jailbreak</option>
                <option value="impersonation">Impersonation</option>
              </Form.Select>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover responsive size="sm" className="mb-0 align-middle">
                <thead><tr><th>When</th><th>User</th><th>Category</th><th>Sev</th><th>Action</th><th>Message (redacted)</th></tr></thead>
                <tbody>
                  {events.length === 0 && <tr><td colSpan={6} className="text-center text-muted py-3">No attempts logged yet.</td></tr>}
                  {events.map((e, i) => (
                    <tr key={i}>
                      <td className="small text-muted">{fmt(e.createdAt)}</td>
                      <td className="small">****{String(e.key || '').slice(-4)}</td>
                      <td><Badge bg={catBadge(e.category)}>{e.category}</Badge></td>
                      <td>{e.severity}</td>
                      <td>{e.action === 'block' ? <Badge bg="danger">blocked</Badge> : <Badge bg="secondary">noted</Badge>}</td>
                      <td className="small" style={{ maxWidth: 320, whiteSpace: 'normal' }}>{e.snippet}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
}
