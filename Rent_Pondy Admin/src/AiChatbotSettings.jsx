// AI Chatbot Settings — admin control panel for the user-app assistant. Edits the
// live settings singleton (ai_assistant_settings) via the assistant backend; every
// change applies immediately (no .env edit, no redeploy).
//
// Controls: master on/off, owner-contact points cost, rate limits, daily token
// budget, extra system-prompt instructions (tone/rules), welcome-greeting overrides
// (EN/Tamil), and a list of custom guardrail phrases the detector should catch.
//
// API base: same convention as AiChatHistory — REACT_APP_ASSISTANT_API in dev,
// REACT_APP_API_URL in prod (assistant runs inside the same PPC backend).

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Card, Table, Spinner, Alert, Badge } from 'react-bootstrap';

const BASE = (process.env.REACT_APP_ASSISTANT_API || process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');
const ENDPOINT = `${BASE}/assistant/admin/settings`;

const CATEGORIES = [
  { value: 'contact_extraction', label: 'Contact extraction (routes to points)' },
  { value: 'jailbreak', label: 'Jailbreak / bypass (can block)' },
  { value: 'impersonation', label: 'Impersonation' },
];

export default function AiChatbotSettings() {
  const [s, setS] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null); // { type, text }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(ENDPOINT);
      setS(res.data?.settings || null);
    } catch (e) {
      setMsg({ type: 'danger', text: `Could not load settings: ${e.message}` });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k, v) => setS((p) => ({ ...p, [k]: v }));

  const setPhrase = (i, k, v) =>
    setS((p) => {
      const arr = (p.guardrailPhrases || []).slice();
      arr[i] = { ...arr[i], [k]: v };
      return { ...p, guardrailPhrases: arr };
    });
  const addPhrase = () =>
    setS((p) => ({ ...p, guardrailPhrases: [...(p.guardrailPhrases || []), { phrase: '', category: 'jailbreak', severity: 3 }] }));
  const removePhrase = (i) =>
    setS((p) => ({ ...p, guardrailPhrases: (p.guardrailPhrases || []).filter((_, j) => j !== i) }));

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const payload = {
        enabled: !!s.enabled,
        contactRevealPoints: Number(s.contactRevealPoints) || 1,
        rateChat: Number(s.rateChat) || 1,
        rateVoice: Number(s.rateVoice) || 1,
        dailyTokenBudget: Number(s.dailyTokenBudget) || 0,
        promptExtra: s.promptExtra || '',
        greetingEn: s.greetingEn || '',
        greetingTa: s.greetingTa || '',
        guardrailPhrases: (s.guardrailPhrases || []).filter((p) => (p.phrase || '').trim()),
      };
      const res = await axios.put(ENDPOINT, payload);
      setS(res.data?.settings || s);
      setMsg({ type: 'success', text: 'Saved — changes are live now.' });
    } catch (e) {
      setMsg({ type: 'danger', text: `Save failed: ${e.response?.data?.error || e.message}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 text-center"><Spinner animation="border" /></div>;
  if (!s) return <div className="p-4"><Alert variant="danger">Settings unavailable. {msg?.text}</Alert></div>;

  return (
    <div className="p-3" style={{ maxWidth: 900 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">🤖 Chatbot Settings</h4>
        <div>
          <Button variant="outline-secondary" size="sm" className="me-2" onClick={load} disabled={saving}>Reload</Button>
          <Button variant="primary" size="sm" onClick={save} disabled={saving}>
            {saving ? <Spinner animation="border" size="sm" /> : 'Save changes'}
          </Button>
        </div>
      </div>

      {msg && <Alert variant={msg.type} onClose={() => setMsg(null)} dismissible>{msg.text}</Alert>}

      <Card className="mb-3">
        <Card.Body>
          <Form.Check
            type="switch" id="enabled" className="mb-3"
            label={<span>Assistant <b>{s.enabled ? 'ON' : 'OFF'}</b> {s.enabled ? '' : '(users get "assistant unavailable")'}</span>}
            checked={!!s.enabled} onChange={(e) => set('enabled', e.target.checked)}
          />
          <Row>
            <Col md={3}><Form.Group className="mb-3">
              <Form.Label>Owner-contact cost (points)</Form.Label>
              <Form.Control type="number" min={1} value={s.contactRevealPoints}
                onChange={(e) => set('contactRevealPoints', e.target.value)} />
            </Form.Group></Col>
            <Col md={3}><Form.Group className="mb-3">
              <Form.Label>Chat / 5 min</Form.Label>
              <Form.Control type="number" min={1} value={s.rateChat} onChange={(e) => set('rateChat', e.target.value)} />
            </Form.Group></Col>
            <Col md={3}><Form.Group className="mb-3">
              <Form.Label>Voice / 5 min</Form.Label>
              <Form.Control type="number" min={1} value={s.rateVoice} onChange={(e) => set('rateVoice', e.target.value)} />
            </Form.Group></Col>
            <Col md={3}><Form.Group className="mb-3">
              <Form.Label>Daily tokens / user</Form.Label>
              <Form.Control type="number" min={0} value={s.dailyTokenBudget} onChange={(e) => set('dailyTokenBudget', e.target.value)} />
            </Form.Group></Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Header>Prompt & greeting</Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Extra instructions (tone / house rules)</Form.Label>
            <Form.Control as="textarea" rows={3} value={s.promptExtra} maxLength={4000}
              placeholder="e.g. Be extra warm. Always mention our WhatsApp for help. Never discuss competitors."
              onChange={(e) => set('promptExtra', e.target.value)} />
            <Form.Text muted>Added to the assistant's instructions. It cannot override the built-in security rules.</Form.Text>
          </Form.Group>
          <Row>
            <Col md={6}><Form.Group className="mb-2">
              <Form.Label>Welcome greeting (English)</Form.Label>
              <Form.Control as="textarea" rows={2} value={s.greetingEn} maxLength={500}
                placeholder="(blank = default greeting)" onChange={(e) => set('greetingEn', e.target.value)} />
            </Form.Group></Col>
            <Col md={6}><Form.Group className="mb-2">
              <Form.Label>Welcome greeting (Tamil)</Form.Label>
              <Form.Control as="textarea" rows={2} value={s.greetingTa} maxLength={500}
                placeholder="(காலியாக இருந்தா default greeting)" onChange={(e) => set('greetingTa', e.target.value)} />
            </Form.Group></Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>Custom guardrail phrases <Badge bg="secondary">{(s.guardrailPhrases || []).length}</Badge></span>
          <Button size="sm" variant="outline-primary" onClick={addPhrase}>+ Add phrase</Button>
        </Card.Header>
        <Card.Body>
          <Form.Text muted className="d-block mb-2">
            Extra words/phrases the bot should treat as manipulation. Matched anywhere in the message,
            case-insensitive. Severity 3 in the "jailbreak" category can escalate to a block after 3 tries.
          </Form.Text>
          {(s.guardrailPhrases || []).length === 0 && <div className="text-muted small">No custom phrases yet.</div>}
          {(s.guardrailPhrases || []).length > 0 && (
            <Table size="sm" borderless className="align-middle">
              <thead><tr><th>Phrase</th><th style={{ width: 260 }}>Category</th><th style={{ width: 110 }}>Severity</th><th style={{ width: 60 }}></th></tr></thead>
              <tbody>
                {s.guardrailPhrases.map((p, i) => (
                  <tr key={i}>
                    <td><Form.Control size="sm" value={p.phrase} placeholder="e.g. share the digits"
                      onChange={(e) => setPhrase(i, 'phrase', e.target.value)} /></td>
                    <td><Form.Select size="sm" value={p.category} onChange={(e) => setPhrase(i, 'category', e.target.value)}>
                      {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </Form.Select></td>
                    <td><Form.Select size="sm" value={p.severity} onChange={(e) => setPhrase(i, 'severity', Number(e.target.value))}>
                      <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option>
                    </Form.Select></td>
                    <td><Button size="sm" variant="outline-danger" onClick={() => removePhrase(i)}>✕</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <div className="text-end">
        <Button variant="primary" onClick={save} disabled={saving}>
          {saving ? <Spinner animation="border" size="sm" /> : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}
