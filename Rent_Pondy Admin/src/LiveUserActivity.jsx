// Live User Activity — real-time trail of what people are doing in the Rent Pondy
// *user* app: which login number opened which page and fired which action, with
// the exact date and time.
//
// Data comes from the user app itself (src/utils/activityTracker.js), which posts
// page views and key actions to POST /PPC/track-activity. This screen polls
// GET /live-activity incrementally (`since` = newest row it already has), so the
// feed streams in without re-downloading the table.
//
// Read-only: nothing here writes to any collection.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Table, Badge, Spinner, Card, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { FaCircle, FaPause, FaPlay, FaSync, FaUserClock } from 'react-icons/fa';

const API = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

const POLL_MS = 3000; // how often the feed refreshes while live
const MAX_ROWS = 400; // rows kept in the browser before the oldest are dropped

// Colour per action family so the feed is scannable at a glance.
const actionVariant = (action = '') => {
  if (action.startsWith('CONTACT') || action === 'CALL_OWNER') return 'danger';
  if (action.startsWith('PAYMENT') || action.startsWith('POINTS') || action === 'PLAN_SELECT') return 'success';
  if (action.startsWith('PROPERTY')) return 'primary';
  if (action.startsWith('FAVOURITE') || action.startsWith('INTEREST')) return 'warning';
  if (action.startsWith('OTP') || action === 'LOGIN') return 'info';
  if (action === 'FORM_SUBMIT') return 'info';
  if (action === 'PAGE_VIEW' || action === 'CLICK') return 'secondary';
  return 'dark';
};

// Browsing noise. Everything else is an action worth chasing, so "Key actions
// only" simply hides these two.
const NOISE = ['PAGE_VIEW', 'CLICK'];

const fmtTime = (d) => (d ? moment(d).format('DD MMM YYYY, hh:mm:ss A') : '');
const fmtAgo = (d) => (d ? moment(d).fromNow() : '');

const LiveUserActivity = () => {
  const [rows, setRows] = useState([]);
  const [online, setOnline] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(true);
  const [phoneFilter, setPhoneFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [baseFilter, setBaseFilter] = useState('');
  const [search, setSearch] = useState('');
  const [keyOnly, setKeyOnly] = useState(false);
  const [trail, setTrail] = useState(null); // { phone, sessionId, rows }
  const [detail, setDetail] = useState(null); // { phone, loading, data }
  const [flags, setFlags] = useState({}); // phone -> { paid, properties, statuses }
  const [tick, setTick] = useState(0); // re-render so "x ago" stays fresh

  const newestAt = useRef(null); // ISO of the newest row we already hold
  const flagsRef = useRef({}); // same as `flags`, readable without re-running effects
  const filters = useRef({});
  filters.current = { phoneFilter, actionFilter, baseFilter, search };

  const reduxAdminName = useSelector((state) => state.admin?.name);
  const reduxAdminRole = useSelector((state) => state.admin?.role);
  const adminName = reduxAdminName || localStorage.getItem('adminName');
  const adminRole = reduxAdminRole || localStorage.getItem('adminRole');

  // Record that this admin opened the page (same convention as other screens).
  useEffect(() => {
    if (adminName && adminRole) {
      axios
        .post(`${API}/record-view`, {
          userName: adminName,
          role: adminRole,
          viewedFile: 'Live User Activity',
          viewTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        })
        .catch(() => {});
    }
  }, [adminName, adminRole]);

  const params = useCallback(() => {
    const { phoneFilter: p, actionFilter: a, baseFilter: b, search: q } = filters.current;
    const out = {};
    if (p.trim()) out.phone = p.trim();
    if (a) out.action = a;
    if (b) out.base = b;
    if (q.trim()) out.q = q.trim();
    return out;
  }, []);

  // Paid/free lookup for the numbers on screen. Only ever asks about numbers we
  // have not resolved yet, so the 3s poll costs nothing once warmed up.
  // Defined before loadAll/loadNew because they list it as a dependency.
  const loadFlags = useCallback(async (list) => {
    try {
      const wanted = Array.from(
        new Set(list.map((r) => r.phone).filter((p) => p && !(p in flagsRef.current)))
      ).slice(0, 200);
      if (!wanted.length) return;

      // Mark as in-flight so a fast poll does not ask for the same number twice.
      wanted.forEach((p) => { flagsRef.current[p] = flagsRef.current[p] || null; });

      const res = await axios.get(`${API}/live-activity/user-flags`, {
        params: { phones: wanted.join(',') },
      });
      const got = res.data?.flags || {};
      flagsRef.current = { ...flagsRef.current, ...got };
      setFlags({ ...flagsRef.current });
    } catch (e) {
      /* colouring is cosmetic — never block the feed on it */
    }
  }, []);

  // Full reload — used on mount and whenever a filter changes.
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/live-activity`, { params: { ...params(), limit: 200 } });
      const fresh = res.data?.rows || [];
      setRows(fresh);
      newestAt.current = fresh.length ? fresh[0].at : null;
      loadFlags(fresh);
    } catch (e) {
      /* leave the previous rows on screen */
    } finally {
      setLoading(false);
    }
  }, [params, loadFlags]);

  // Incremental poll — only rows newer than what we already have.
  const loadNew = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/live-activity`, {
        params: { ...params(), limit: 200, ...(newestAt.current ? { since: newestAt.current } : {}) },
      });
      const fresh = res.data?.rows || [];
      if (fresh.length) {
        newestAt.current = fresh[0].at;
        loadFlags(fresh);
        setRows((prev) => {
          const seen = new Set(prev.map((r) => r._id));
          const add = fresh.filter((r) => !seen.has(r._id));
          return [...add, ...prev].slice(0, MAX_ROWS);
        });
      }
    } catch (e) {
      /* a dropped poll is harmless — the next one catches up */
    }
  }, [params, loadFlags]);

  const loadSide = useCallback(async () => {
    try {
      const [on, st] = await Promise.all([
        axios.get(`${API}/live-activity/online`, { params: { minutes: 5 } }).catch(() => ({ data: {} })),
        axios.get(`${API}/live-activity/stats`).catch(() => ({ data: {} })),
      ]);
      setOnline(on.data?.rows || []);
      setStats(st.data || null);
    } catch (e) {
      /* ignore */
    }
  }, []);

  // Reload from scratch when filters change.
  useEffect(() => {
    newestAt.current = null;
    loadAll();
    loadSide();
  }, [phoneFilter, actionFilter, baseFilter, search, loadAll, loadSide]);

  // The live poll.
  useEffect(() => {
    if (!live) return undefined;
    const id = setInterval(() => {
      loadNew();
      loadSide();
      setTick((t) => t + 1);
    }, POLL_MS);
    return () => clearInterval(id);
  }, [live, loadNew, loadSide]);

  // "View Detail" — who this number is: followups (and which admin raised them),
  // approval state per property, and whether they have ever paid.
  const openDetail = async (phone) => {
    if (!phone) return;
    setDetail({ phone, loading: true, data: null });
    try {
      const res = await axios.get(`${API}/live-activity/user-detail`, { params: { phone } });
      setDetail({ phone, loading: false, data: res.data });
      // Keep the feed's colour in step with what the detail just told us.
      if (res.data && typeof res.data.paid === 'boolean') {
        flagsRef.current[phone] = {
          ...(flagsRef.current[phone] || {}),
          paid: res.data.paid,
          properties: res.data.propertyCount,
        };
        setFlags({ ...flagsRef.current });
      }
    } catch (e) {
      setDetail({ phone, loading: false, data: null, error: true });
    }
  };

  // Green = has paid at least once, red = free user, grey = still unknown.
  const phoneColor = (phone) => {
    const f = flags[phone];
    if (!phone || !f) return '#6b7280';
    return f.paid ? '#16a34a' : '#dc2626';
  };

  const openTrail = async (row) => {
    setTrail({ phone: row.phone, sessionId: row.sessionId, rows: [], loading: true });
    try {
      const res = await axios.get(`${API}/live-activity/session/${encodeURIComponent(row.sessionId)}`);
      setTrail({ phone: row.phone, sessionId: row.sessionId, rows: res.data?.rows || [], loading: false });
    } catch (e) {
      setTrail((t) => ({ ...t, loading: false }));
    }
  };

  const actionOptions = Array.from(new Set(rows.map((r) => r.action))).sort();
  const visibleRows = keyOnly ? rows.filter((r) => !NOISE.includes(r.action)) : rows;

  return (
    <div className="p-3">
      {/* ── header ── */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap" style={{ gap: 10 }}>
        <h4 className="mb-0">
          📡 Live User Activity{' '}
          {live && <FaCircle size={10} color="#22c55e" className="ms-1" title="Live" />}
        </h4>
        <div className="d-flex align-items-center" style={{ gap: 8 }}>
          <Button
            size="sm"
            variant={live ? 'success' : 'outline-secondary'}
            onClick={() => setLive((v) => !v)}
            title={live ? 'Pause the live feed' : 'Resume the live feed'}
          >
            {live ? <FaPause className="me-1" /> : <FaPlay className="me-1" />}
            {live ? 'Live' : 'Paused'}
          </Button>
          <Button size="sm" variant="outline-secondary" onClick={() => { loadAll(); loadSide(); }} disabled={loading}>
            <FaSync className="me-1" />Reload
          </Button>
        </div>
      </div>

      {/* ── counters ── */}
      <Row className="g-2 mb-3">
        {[
          { label: 'Online now (logged in)', value: stats?.onlineUsers ?? '—', color: '#22c55e' },
          { label: 'Online now (incl. guests)', value: stats?.onlineSessions ?? '—', color: '#0ea5e9' },
          { label: 'Actions in last hour', value: stats?.lastHour ?? '—', color: '#8B5CF6' },
          { label: 'Actions today', value: stats?.today ?? '—', color: '#f59e0b' },
        ].map((c) => (
          <Col key={c.label} xs={6} md={3}>
            <Card className="h-100 shadow-sm" style={{ borderLeft: `4px solid ${c.color}` }}>
              <Card.Body className="py-2">
                <div style={{ fontSize: 12, color: '#6b7280' }}>{c.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{c.value}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── filters ── */}
      <Card className="mb-3 shadow-sm">
        <Card.Body className="py-2">
          <Row className="g-2 align-items-end">
            <Col xs={12} md={3}>
              <Form.Label className="mb-1" style={{ fontSize: 12 }}>Login number</Form.Label>
              <Form.Control
                size="sm"
                placeholder="e.g. 9876543210"
                value={phoneFilter}
                onChange={(e) => setPhoneFilter(e.target.value)}
              />
            </Col>
            <Col xs={12} md={3}>
              <Form.Label className="mb-1" style={{ fontSize: 12 }}>Action</Form.Label>
              <Form.Select size="sm" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
                <option value="">All actions</option>
                {actionOptions.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6} md={2}>
              <Form.Label className="mb-1" style={{ fontSize: 12 }}>City</Form.Label>
              <Form.Select size="sm" value={baseFilter} onChange={(e) => setBaseFilter(e.target.value)}>
                <option value="">Both</option>
                <option value="PY">Pondicherry</option>
                <option value="CH">Chennai</option>
              </Form.Select>
            </Col>
            <Col xs={12} md={3}>
              <Form.Label className="mb-1" style={{ fontSize: 12 }}>Search</Form.Label>
              <Form.Control
                size="sm"
                placeholder="page, action text, endpoint…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col xs={12} md={1}>
              <Form.Check
                type="switch"
                id="key-only"
                label={<span style={{ fontSize: 12 }}>Key actions only</span>}
                checked={keyOnly}
                onChange={(e) => setKeyOnly(e.target.checked)}
                title="Hide page views and clicks — show only contacts, favourites, payments, properties…"
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-3">
        {/* ── the feed ── */}
        <Col xs={12} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="py-2 d-flex justify-content-between align-items-center">
              <strong>Activity feed</strong>
              <span style={{ fontSize: 12, color: '#6b7280' }}>
                {visibleRows.length} rows{keyOnly && rows.length !== visibleRows.length ? ` (${rows.length - visibleRows.length} hidden)` : ''}
              </span>
            </Card.Header>
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              <Table hover size="sm" className="mb-0 align-middle">
                <thead style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>
                  <tr>
                    <th style={{ width: 130 }}>Login number</th>
                    <th>Action</th>
                    <th style={{ width: 190 }}>Date &amp; time</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && !visibleRows.length && (
                    <tr><td colSpan={3} className="text-center p-4"><Spinner animation="border" size="sm" /></td></tr>
                  )}
                  {!loading && !visibleRows.length && (
                    <tr><td colSpan={3} className="text-center p-4 text-muted">
                      {keyOnly && rows.length ? 'No key actions yet — only browsing.' : 'No activity yet.'}
                    </td></tr>
                  )}
                  {visibleRows.map((r) => (
                    <tr key={r._id}>
                      <td>
                        {r.phone ? (
                          <>
                            <strong style={{ color: phoneColor(r.phone), fontSize: 14 }}>{r.phone}</strong>
                            {flags[r.phone] && (
                              <Badge bg={flags[r.phone].paid ? 'success' : 'danger'} className="ms-2">
                                {flags[r.phone].paid ? 'Paid' : 'Free'}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <span className="text-muted" title={r.sessionId}>Guest</span>
                        )}
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>
                          {r.base === 'CH' ? 'Chennai' : 'Pondicherry'}{r.device ? ` · ${r.device}` : ''}
                        </div>
                        <div className="mt-1 d-flex" style={{ gap: 6 }}>
                          {r.phone && (
                            <Button size="sm" variant="outline-primary" style={{ fontSize: 11, padding: '1px 8px' }}
                              onClick={() => openDetail(r.phone)}>
                              View Detail
                            </Button>
                          )}
                          <Button size="sm" variant="outline-secondary" style={{ fontSize: 11, padding: '1px 8px' }}
                            onClick={() => openTrail(r)}>
                            Trail
                          </Button>
                        </div>
                      </td>
                      <td>
                        <Badge bg={actionVariant(r.action)} className="me-2">{r.action}</Badge>
                        {r.label}
                        {!r.ok && <Badge bg="danger" className="ms-2">failed</Badge>}
                        {(r.path || r.detail) && (
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>
                            {r.detail || r.path}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: 12 }}>{fmtTime(r.at)}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }} data-tick={tick}>{fmtAgo(r.at)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>

        {/* ── who is online ── */}
        <Col xs={12} lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="py-2">
              <FaUserClock className="me-2" /><strong>Active in last 5 min</strong>
            </Card.Header>
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              <Table size="sm" hover className="mb-0 align-middle">
                <tbody>
                  {!online.length && (
                    <tr><td className="text-center p-4 text-muted">Nobody active right now.</td></tr>
                  )}
                  {online.map((o) => (
                    <tr key={o._id}>
                      <td>
                        <div>
                          <FaCircle size={8} color="#22c55e" className="me-2" />
                          {o.phone ? (
                            <strong style={{ color: phoneColor(o.phone) }}>{o.phone}</strong>
                          ) : (
                            <span className="text-muted">Guest</span>
                          )}
                          <Badge bg="light" text="dark" className="ms-2">{o.hits}</Badge>
                        </div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>{o.lastAction || o.lastPath}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }} data-tick={tick}>{fmtAgo(o.at)}</div>
                        <div className="mt-1 d-flex" style={{ gap: 6 }}>
                          {o.phone && (
                            <Button size="sm" variant="outline-primary" style={{ fontSize: 11, padding: '1px 8px' }}
                              onClick={() => openDetail(o.phone)}>
                              View Detail
                            </Button>
                          )}
                          <Button size="sm" variant="outline-secondary" style={{ fontSize: 11, padding: '1px 8px' }}
                            onClick={() => openTrail(o)}>
                            Trail
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ── who this number is: followups, approval state, paid/free ── */}
      <Modal show={!!detail} onHide={() => setDetail(null)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: 18 }}>
            <span style={{ color: detail?.data ? (detail.data.paid ? '#16a34a' : '#dc2626') : '#111' }}>
              {detail?.phone}
            </span>
            {detail?.data && (
              <Badge bg={detail.data.paid ? 'success' : 'danger'} className="ms-2">
                {detail.data.paidLabel}
              </Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detail?.loading && <div className="text-center p-4"><Spinner animation="border" /></div>}
          {!detail?.loading && detail?.error && (
            <div className="text-center p-4 text-danger">Could not load details for this number.</div>
          )}

          {!detail?.loading && detail?.data && (
            <>
              {/* 1 — properties: approved / preapproved / pending / expired, and paid or free */}
              <h6 className="mb-2">
                Properties <Badge bg="secondary">{detail.data.propertyCount}</Badge>
              </h6>
              {!detail.data.properties.length && (
                <div className="text-muted mb-3">No property found for this number.</div>
              )}
              {!!detail.data.properties.length && (
                <Table size="sm" bordered hover className="align-middle mb-4">
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th>Rent ID</th>
                      <th>Status</th>
                      <th>Paid / Free</th>
                      <th>Plan</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.data.properties.map((p) => (
                      <tr key={p.rentId}>
                        <td><strong>{p.rentId}</strong></td>
                        <td>
                          <Badge bg={
                            p.displayStatus === 'Approved' ? 'success'
                              : p.displayStatus === 'PreApproved' ? 'primary'
                                : p.displayStatus === 'Expired' ? 'dark'
                                  : p.displayStatus === 'Deleted' ? 'danger'
                                    : 'warning'
                          }>
                            {p.displayStatus}
                          </Badge>
                        </td>
                        <td>
                          <span style={{ color: p.paid ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                            {p.paid ? 'Paid' : 'Free'}
                          </span>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>{p.paymentStatus}</div>
                        </td>
                        <td style={{ fontSize: 12 }}>
                          {p.planName || '—'}{p.amount ? ` · ₹${p.amount}` : ''}
                        </td>
                        <td style={{ fontSize: 12 }}>{p.createdAt ? moment(p.createdAt).format('DD MMM YYYY') : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              {/* 2 — followups, and which admin created each one */}
              <h6 className="mb-2">
                Followups <Badge bg="secondary">{detail.data.followupCount}</Badge>
              </h6>
              {!detail.data.followups.length && (
                <div className="text-muted">No followup has been created for this number.</div>
              )}
              {!!detail.data.followups.length && (
                <Table size="sm" bordered hover className="align-middle">
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th>Created by (admin)</th>
                      <th>Status</th>
                      <th>Type</th>
                      <th>Follow-up date</th>
                      <th>Created</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.data.followups.map((f, i) => (
                      <tr key={`${f.adminName}-${f.createdAt}-${i}`}>
                        <td><strong>{f.adminName || '—'}</strong>
                          {!!f.transferHistory?.length && (
                            <div style={{ fontSize: 11, color: '#9ca3af' }}>
                              transferred {f.transferHistory.length}×
                            </div>
                          )}
                        </td>
                        <td><Badge bg={f.followupStatus === 'Paid Closed' ? 'success' : 'secondary'}>{f.followupStatus || '—'}</Badge></td>
                        <td style={{ fontSize: 12 }}>{f.followupType || '—'}</td>
                        <td style={{ fontSize: 12 }}>{f.followupDate ? moment(f.followupDate).format('DD MMM YYYY') : '—'}</td>
                        <td style={{ fontSize: 12 }}>{f.createdAt ? moment(f.createdAt).format('DD MMM YYYY, hh:mm A') : '—'}</td>
                        <td style={{ fontSize: 12 }}>{f.remarks || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* ── one visitor's full trail ── */}
      <Modal show={!!trail} onHide={() => setTrail(null)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: 18 }}>
            Session trail — {trail?.phone ? trail.phone : 'Guest'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {trail?.loading && <div className="text-center p-4"><Spinner animation="border" /></div>}
          {!trail?.loading && !trail?.rows?.length && (
            <div className="text-center p-4 text-muted">No events for this session.</div>
          )}
          {!!trail?.rows?.length && (
            <Table size="sm" hover className="align-middle">
              <thead>
                <tr><th>Action</th><th style={{ width: 190 }}>Date &amp; time</th></tr>
              </thead>
              <tbody>
                {trail.rows.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <Badge bg={actionVariant(r.action)} className="me-2">{r.action}</Badge>
                      {r.label}
                      {(r.path || r.detail) && (
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{r.detail || r.path}</div>
                      )}
                    </td>
                    <td style={{ fontSize: 12 }}>{fmtTime(r.at)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LiveUserActivity;
