// AI Chat History — per-user record of who used the user-app AI assistant, how many
// model tokens they spent, and a downloadable transcript of their conversations.
//
// Data lives on the assistant backend. In production it's the same PPC server (so
// REACT_APP_API_URL works); in local dev set REACT_APP_ASSISTANT_API to the locally
// run assistant, e.g. http://localhost:5005/PPC.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Table, Button, Badge, Form, Spinner, Modal } from 'react-bootstrap';

const BASE = (process.env.REACT_APP_ASSISTANT_API || process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');
const ENDPOINT = `${BASE}/assistant/admin/chat-history`;

function fmtDate(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); } catch { return ''; }
}
const fmtNum = (n) => Number(n || 0).toLocaleString('en-IN');

export default function AiChatHistory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Transcript viewer modal
  const [viewPhone, setViewPhone] = useState(null);
  const [viewMsgs, setViewMsgs] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(ENDPOINT);
      setUsers(res.data?.users || []);
    } catch (e) {
      console.error('load chat history failed', e.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = search.replace(/\D/g, '');
    if (!q) return users;
    return users.filter((u) => String(u.phone || '').includes(q));
  }, [users, search]);

  const totalTokens = useMemo(() => users.reduce((a, u) => a + (u.tokens || 0), 0), [users]);

  const transcriptUrl = (phone) => `${ENDPOINT}/${encodeURIComponent(phone)}/transcript`;

  const openTranscript = async (phone) => {
    setViewPhone(phone);
    setViewMsgs([]);
    setViewLoading(true);
    try {
      const res = await axios.get(`${ENDPOINT}/${encodeURIComponent(phone)}/messages`);
      setViewMsgs(res.data?.messages || []);
    } catch (e) {
      setViewMsgs([{ role: 'assistant', content: `Could not load transcript: ${e.message}` }]);
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div className="p-3">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
        <h4 className="m-0">🗒️ AI Chat History <Badge bg="light" text="dark">{users.length} users</Badge></h4>
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            size="sm"
            style={{ width: 200 }}
            placeholder="Search phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button size="sm" variant="outline-secondary" onClick={load}>↻ Refresh</Button>
        </div>
      </div>

      <div className="mb-2 text-muted" style={{ fontSize: 13 }}>
        Total tokens used across all users: <strong>{fmtNum(totalTokens)}</strong>
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted py-5">
          No chat history yet. Rows appear here once logged-in users chat with the AI assistant.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <Table striped bordered hover responsive size="sm" className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Si.No</th>
                <th>Phone Number</th>
                <th>Tokens Used</th>
                <th>Sessions</th>
                <th>Messages</th>
                <th>Last Active</th>
                <th style={{ minWidth: 220 }}>Transcription File</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.phone}>
                  <td>{i + 1}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <a href={`tel:${u.phone}`} title="Call">📞 {u.phone}</a>
                  </td>
                  <td><Badge bg="info">{fmtNum(u.tokens)}</Badge></td>
                  <td>{fmtNum(u.sessions)}</td>
                  <td>{fmtNum(u.messages)}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(u.lastMessageAt)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button size="sm" variant="outline-primary" onClick={() => openTranscript(u.phone)}>
                        👁 View
                      </Button>
                      {/* Downloads the .txt transcript (Content-Disposition: attachment). */}
                      <Button
                        as="a"
                        size="sm"
                        variant="success"
                        href={transcriptUrl(u.phone)}
                        target="_blank"
                        rel="noreferrer"
                        download={`ai-chat-${u.phone}.txt`}
                      >
                        ⬇ Download
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Transcript viewer */}
      <Modal show={!!viewPhone} onHide={() => setViewPhone(null)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: 18 }}>📞 {viewPhone} — Chat Transcript</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewLoading ? (
            <div className="text-center py-4"><Spinner animation="border" /></div>
          ) : viewMsgs.length === 0 ? (
            <div className="text-muted text-center py-4">No messages.</div>
          ) : (
            <div>
              {viewMsgs.map((m, idx) => (
                <div
                  key={idx}
                  className="mb-2 p-2 rounded"
                  style={{
                    background: m.role === 'user' ? '#e8f0fe' : '#f6f6f6',
                    borderLeft: `3px solid ${m.role === 'user' ? '#4F4B7E' : '#0e9f6e'}`,
                  }}
                >
                  <div className="d-flex justify-content-between" style={{ fontSize: 11, color: '#888' }}>
                    <strong>{m.role === 'user' ? 'USER' : 'ASSISTANT'}</strong>
                    <span>{fmtDate(m.at)}</span>
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>{m.content || <em>(no text)</em>}</div>
                  {Array.isArray(m.actions) && m.actions.map((a, ai) => (
                    <div key={ai} style={{ fontSize: 11, color: '#b45309' }}>↳ action: {a.label || a.tool}</div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {viewPhone && (
            <Button as="a" variant="success" href={transcriptUrl(viewPhone)} target="_blank" rel="noreferrer" download={`ai-chat-${viewPhone}.txt`}>
              ⬇ Download .txt
            </Button>
          )}
          <Button variant="secondary" onClick={() => setViewPhone(null)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
