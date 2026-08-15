// Data Added — month-wise dashboard of how many property records were entered
// into the system, and by whom.
//
// Three levels in one screen:
//   1. Year view   → 12 month cards with the count added in each month.
//   2. Month view  → click a card for a real calendar of that month; every date
//                    box carries the number of records added that day.
//   3. Day view    → click a date to narrow the table to just that day
//                    ("All Dates" puts the whole month back).
//
// Every level shares the same "Added By" picker, whose options come straight
// from the addedBy values stamped on the property records themselves.
//
// Backed by GET /PPC/data-added/summary and GET /PPC/data-added/list — read-only.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Form, Button, Spinner, Badge } from 'react-bootstrap';
import { FaArrowLeft, FaSync, FaCalendarAlt, FaUsers, FaEye } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import PhoneCell from './components/PhoneCell';

const API = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

// Matches the sentinel the backend uses for records with no staff name.
const NOT_SET = '__none__';

const PAGE_SIZE = 50;

// One colour per month so the grid is easy to scan.
const MONTH_COLORS = [
  '#4F46E5', '#0EA5E9', '#059669', '#65A30D', '#CA8A04', '#EA580C',
  '#DC2626', '#DB2777', '#9333EA', '#7C3AED', '#0891B2', '#475569',
];

const cardStyle = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '18px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};

const tileStyle = (color) => ({
  ...cardStyle,
  borderLeft: `5px solid ${color}`,
  minWidth: '160px',
  flex: '1 1 160px',
});

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Busier day → stronger fill, so the calendar reads at a glance. Shades are
// relative to the busiest day of the month on screen.
const dayShade = (count, peak) => {
  if (!count) return { bg: '#f8fafc', fg: '#cbd5e1', border: '#e5e7eb' };
  const ratio = peak > 0 ? count / peak : 0;
  if (ratio > 0.66) return { bg: '#1d4ed8', fg: '#fff', border: '#1d4ed8' };
  if (ratio > 0.33) return { bg: '#60a5fa', fg: '#0b2b6b', border: '#60a5fa' };
  return { bg: '#dbeafe', fg: '#1e3a8a', border: '#bfdbfe' };
};

const DataAdded = () => {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [addedBy, setAddedBy] = useState('');
  const [hideDeleted, setHideDeleted] = useState(false);

  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [error, setError] = useState('');

  // null = year view, 1-12 = that month's calendar view
  const [openMonth, setOpenMonth] = useState(null);
  // null = whole month, 1-31 = only that date's records
  const [openDay, setOpenDay] = useState(null);

  const [rows, setRows] = useState([]);
  const [rowTotal, setRowTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [loadingRows, setLoadingRows] = useState(false);

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
          viewedFile: 'Data Added',
          viewTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        })
        .catch(() => {});
    }
  }, [adminName, adminRole]);

  const baseParams = useCallback(() => {
    const p = { year };
    if (addedBy) p.addedBy = addedBy;
    if (hideDeleted) p.hideDeleted = 1;
    return p;
  }, [year, addedBy, hideDeleted]);

  // ── Year / month summary ────────────────────────────────────────────────────
  const loadSummary = useCallback(async () => {
    setLoadingSummary(true);
    setError('');
    try {
      const params = baseParams();
      if (openMonth) params.month = openMonth;
      const res = await axios.get(`${API}/data-added/summary`, { params });
      setSummary(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load report');
      setSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  }, [baseParams, openMonth]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  // ── Month rows ──────────────────────────────────────────────────────────────
  const loadRows = useCallback(async () => {
    if (!openMonth) return;
    setLoadingRows(true);
    setError('');
    try {
      const params = { ...baseParams(), month: openMonth, page, limit: PAGE_SIZE };
      if (openDay) params.day = openDay;
      if (appliedSearch) params.q = appliedSearch;
      const res = await axios.get(`${API}/data-added/list`, { params });
      setRows(res.data?.rows || []);
      setRowTotal(res.data?.total || 0);
      setPages(res.data?.pages || 1);
    } catch (e) {
      setRows([]);
      setRowTotal(0);
      setPages(1);
      setError(e?.response?.data?.message || e.message || 'Failed to load records');
    } finally {
      setLoadingRows(false);
    }
  }, [openMonth, openDay, baseParams, page, appliedSearch]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  // Every filter resets pagination at the point of change (rather than in an
  // effect) so the list is never fetched twice for one click.
  const changeYear = (v) => { setYear(v); setPage(1); setOpenDay(null); };
  const changeAddedBy = (v) => { setAddedBy(v); setPage(1); };
  const changeHideDeleted = (v) => { setHideDeleted(v); setPage(1); };
  const applySearch = (v) => { setAppliedSearch(v); setPage(1); };
  const clearSearch = () => { setSearch(''); setAppliedSearch(''); setPage(1); };

  const openMonthCard = (m) => { setOpenMonth(m); setOpenDay(null); setPage(1); clearSearch(); };
  const closeMonthCard = () => { setOpenMonth(null); setOpenDay(null); setPage(1); clearSearch(); };
  const openDayCell = (d) => { setOpenDay(d); setPage(1); clearSearch(); };
  const closeDayCell = () => { setOpenDay(null); setPage(1); clearSearch(); };

  const months = summary?.months || [];
  const years = summary?.years?.length ? summary.years : [currentYear];
  const addedByOptions = summary?.addedByOptions || [];
  const staffBreakdown = summary?.staff || [];

  // Only trust the calendar once the summary on screen is for the open month —
  // otherwise a stale response would paint the previous month's dates.
  const days = summary?.month === openMonth ? summary?.days || [] : [];
  const firstWeekday = summary?.firstWeekday || 0;

  const openMonthLabel = useMemo(
    () => (openMonth ? `${months[openMonth - 1]?.label || ''} ${year}` : ''),
    [openMonth, months, year]
  );

  const openDayLabel = useMemo(
    () => (openMonth && openDay
      ? moment(new Date(year, openMonth - 1, openDay)).format('DD MMM YYYY (dddd)')
      : ''),
    [openMonth, openDay, year]
  );

  const peakMonth = useMemo(
    () => months.reduce((best, m) => (m.count > (best?.count || 0) ? m : best), null),
    [months]
  );

  const peakDay = useMemo(
    () => days.reduce((max, d) => Math.max(max, d.count), 0),
    [days]
  );

  const monthTotal = useMemo(
    () => days.reduce((sum, d) => sum + d.count, 0),
    [days]
  );

  // Today's date in the open month, so "today" can be outlined in the grid.
  const todayDay = useMemo(() => {
    const now = new Date();
    return now.getFullYear() === year && now.getMonth() + 1 === openMonth ? now.getDate() : 0;
  }, [year, openMonth]);

  const addedByLabel = addedBy === NOT_SET
    ? 'Not Set (User Added)'
    : addedBy || 'All Staff';

  // ── Export ──────────────────────────────────────────────────────────────────
  const exportRows = () => {
    if (!rows.length) return;
    const sheet = XLSX.utils.json_to_sheet(
      rows.map((r, i) => ({
        'S.No': (page - 1) * PAGE_SIZE + i + 1,
        'RENT ID': r.rentId,
        'Added On': moment(r.createdAt).format('DD-MM-YYYY hh:mm A'),
        'Phone Number': r.assignedPhoneNumber || r.phoneNumber || '',
        'Owner Name': r.ownerName || '',
        'Property Type': r.propertyType || '',
        'Property Mode': r.propertyMode || '',
        'Rent Type': r.rentType || '',
        'Rental Amount': r.rentalAmount || 0,
        'City': r.city || '',
        'Area': r.area || '',
        'Status': r.status || '',
        'Added By': r.addedBy || 'Not Set (User Added)',
        'Role': r.addedByRole || '',
        'Created By': r.createdBy || '',
        'Views': r.views || 0,
      }))
    );
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'Data Added');
    const buf = XLSX.write(book, { bookType: 'xlsx', type: 'array' });
    const scope = openDay
      ? `${openDay}_${openMonthLabel.replace(/\s+/g, '_')}`
      : openMonthLabel.replace(/\s+/g, '_');
    saveAs(
      new Blob([buf], { type: 'application/octet-stream' }),
      `DataAdded_${scope}_page${page}.xlsx`
    );
  };

  // Day-by-day totals for the open month — the calendar as a spreadsheet.
  const exportDays = () => {
    if (!days.length) return;
    const sheet = XLSX.utils.json_to_sheet([
      ...days.map((d) => ({
        Date: moment(new Date(year, openMonth - 1, d.day)).format('DD-MM-YYYY'),
        Day: WEEKDAYS[d.weekday],
        'Total Added': d.count,
        'Staff Added': d.staff,
        'User Added': d.user,
      })),
      { Date: `TOTAL ${openMonthLabel}`, Day: '', 'Total Added': monthTotal },
    ]);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'Day wise');
    const buf = XLSX.write(book, { bookType: 'xlsx', type: 'array' });
    saveAs(
      new Blob([buf], { type: 'application/octet-stream' }),
      `DataAdded_DayWise_${openMonthLabel.replace(/\s+/g, '_')}.xlsx`
    );
  };

  const exportYear = () => {
    if (!months.length) return;
    const sheet = XLSX.utils.json_to_sheet([
      ...months.map((m) => ({
        Month: `${m.label} ${year}`,
        'Total Added': m.count,
        'Staff Added': m.staff,
        'User Added': m.user,
      })),
      {
        Month: `TOTAL ${year}`,
        'Total Added': summary?.total || 0,
        'Staff Added': summary?.staffTotal || 0,
        'User Added': summary?.userTotal || 0,
      },
    ]);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, `Data Added ${year}`);
    const buf = XLSX.write(book, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `DataAdded_${year}.xlsx`);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="container-fluid p-3">
      {/* Header */}
      <div style={{ ...cardStyle, marginBottom: '18px' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between" style={{ gap: '12px' }}>
          <div className="d-flex flex-wrap align-items-center" style={{ gap: '12px' }}>
            {openMonth && (
              <Button variant="outline-secondary" size="sm" onClick={closeMonthCard}>
                <FaArrowLeft /> All Months
              </Button>
            )}
            {openDay && (
              <Button variant="outline-primary" size="sm" onClick={closeDayCell}>
                <FaArrowLeft /> All Dates
              </Button>
            )}
            <h3 style={{ margin: 0, fontWeight: 700, color: '#1f2937' }}>
              <FaCalendarAlt style={{ marginRight: '10px', color: '#4F46E5' }} />
              Data Added
              {openMonth ? ` — ${openMonthLabel}` : ''}
              {openDay ? ` — ${openDay}` : ''}
            </h3>
          </div>

          <div className="d-flex flex-wrap align-items-end" style={{ gap: '12px' }}>
            <div>
              <Form.Label className="mb-1" style={{ fontSize: '12px', fontWeight: 600 }}>Year</Form.Label>
              <Form.Select
                size="sm"
                value={year}
                onChange={(e) => changeYear(Number(e.target.value))}
                style={{ minWidth: '110px' }}
              >
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </Form.Select>
            </div>

            <div>
              <Form.Label className="mb-1" style={{ fontSize: '12px', fontWeight: 600 }}>Added By</Form.Label>
              <Form.Select
                size="sm"
                value={addedBy}
                onChange={(e) => changeAddedBy(e.target.value)}
                style={{ minWidth: '200px' }}
              >
                <option value="">All Staff</option>
                {addedByOptions.map((n) => <option key={n} value={n}>{n}</option>)}
                <option value={NOT_SET}>Not Set (User Added)</option>
              </Form.Select>
            </div>

            <Form.Check
              type="checkbox"
              id="data-added-hide-deleted"
              label="Hide deleted"
              className="mb-1"
              style={{ fontSize: '13px' }}
              checked={hideDeleted}
              onChange={(e) => changeHideDeleted(e.target.checked)}
            />

            <Button
              variant="primary"
              size="sm"
              className="mb-1"
              onClick={() => { loadSummary(); loadRows(); }}
            >
              <FaSync /> Refresh
            </Button>
          </div>
        </div>

        {error && <div className="text-danger mt-2" style={{ fontSize: '13px' }}>{error}</div>}
      </div>

      {/* Summary tiles */}
      <div className="d-flex flex-wrap" style={{ gap: '14px', marginBottom: '18px' }}>
        <div style={tileStyle('#4F46E5')}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>TOTAL ADDED IN {year}</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary?.total ?? '—'}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{addedByLabel}</div>
        </div>
        <div style={tileStyle('#059669')}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>ADDED BY STAFF</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary?.staffTotal ?? '—'}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>has an "Added By" name</div>
        </div>
        <div style={tileStyle('#0EA5E9')}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>ADDED BY USER</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary?.userTotal ?? '—'}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>posted from the user app</div>
        </div>
        <div style={tileStyle('#CA8A04')}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>BEST MONTH</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{peakMonth?.count ? peakMonth.label : '—'}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{peakMonth?.count || 0} records</div>
        </div>
      </div>

      {loadingSummary && !summary && (
        <div className="text-center p-5"><Spinner animation="border" /></div>
      )}

      {/* ── YEAR VIEW ──────────────────────────────────────────────────────── */}
      {!openMonth && summary && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 style={{ margin: 0, fontWeight: 600 }}>Click a month to see the records added in it</h5>
            <Button variant="success" size="sm" onClick={exportYear}>Excel (Year Summary)</Button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
              gap: '14px',
              marginBottom: '22px',
            }}
          >
            {months.map((m) => {
              const color = MONTH_COLORS[m.month - 1];
              const empty = m.count === 0;
              return (
                <div
                  key={m.month}
                  onClick={() => openMonthCard(m.month)}
                  style={{
                    ...cardStyle,
                    borderTop: `4px solid ${color}`,
                    cursor: 'pointer',
                    opacity: empty ? 0.6 : 1,
                    transition: 'transform 0.12s, box-shadow 0.12s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ fontWeight: 700, color: '#374151' }}>{m.label}</span>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>{year}</span>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 700, color, lineHeight: 1.3 }}>{m.count}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Staff <b>{m.staff}</b> &nbsp;·&nbsp; User <b>{m.user}</b>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Staff-wise totals for the year — the same names the dropdown offers */}
          <div style={cardStyle}>
            <h5 style={{ fontWeight: 600 }}>
              <FaUsers style={{ marginRight: '8px', color: '#4F46E5' }} />
              Added By — {year} totals
            </h5>
            <Table striped bordered hover responsive size="sm" className="mt-2">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>S.No</th>
                  <th>Added By</th>
                  <th style={{ width: '140px' }}>Records Added</th>
                  <th style={{ width: '120px' }}>Share</th>
                </tr>
              </thead>
              <tbody>
                {staffBreakdown.length === 0 && (
                  <tr><td colSpan={4} className="text-center">No data added in {year}.</td></tr>
                )}
                {staffBreakdown.map((s, i) => {
                  const share = summary.total ? Math.round((s.count / summary.total) * 100) : 0;
                  return (
                    <tr
                      key={s.value + i}
                      style={{ cursor: 'pointer' }}
                      onClick={() => changeAddedBy(s.value)}
                      title="Click to filter the whole report by this name"
                    >
                      <td>{i + 1}</td>
                      <td>{s.name}</td>
                      <td><b>{s.count}</b></td>
                      <td>{share}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </>
      )}

      {/* ── MONTH VIEW: CALENDAR ───────────────────────────────────────────── */}
      {openMonth && (
        <div style={{ ...cardStyle, marginBottom: '18px' }}>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3" style={{ gap: '10px' }}>
            <h5 style={{ margin: 0, fontWeight: 600 }}>
              {openMonthLabel} — click a date to see what was added that day
            </h5>
            <div className="d-flex align-items-center" style={{ gap: '8px' }}>
              <Badge bg="dark" style={{ fontSize: '13px' }}>Month total: {monthTotal}</Badge>
              <Button size="sm" variant="success" onClick={exportDays} disabled={!days.length}>
                Excel (Day wise)
              </Button>
            </div>
          </div>

          {/* Weekday header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
            {WEEKDAYS.map((w) => (
              <div
                key={w}
                style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: w === 'Sun' ? '#dc2626' : '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {w}
              </div>
            ))}
          </div>

          {/* Date grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {/* Blank cells before the 1st so dates line up under their weekday */}
            {Array.from({ length: firstWeekday }, (_, i) => <div key={`pad-${i}`} />)}

            {days.map((d) => {
              const shade = dayShade(d.count, peakDay);
              const selected = openDay === d.day;
              return (
                <div
                  key={d.day}
                  onClick={() => (selected ? closeDayCell() : openDayCell(d.day))}
                  title={`${d.count} added — staff ${d.staff}, user ${d.user}`}
                  style={{
                    background: shade.bg,
                    color: shade.fg,
                    border: selected ? '3px solid #111827' : `1px solid ${shade.border}`,
                    outline: !selected && todayDay === d.day ? '2px dashed #f59e0b' : 'none',
                    outlineOffset: '-3px',
                    borderRadius: '10px',
                    padding: '10px 8px',
                    minHeight: '84px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.1s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <span style={{ fontSize: '13px', fontWeight: 700, opacity: 0.9 }}>{d.day}</span>
                    <span style={{ fontSize: '10px', opacity: 0.75 }}>{WEEKDAYS[d.weekday]}</span>
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 700, textAlign: 'center', lineHeight: 1.1 }}>
                    {d.count}
                  </div>
                  <div style={{ fontSize: '10px', textAlign: 'center', opacity: 0.85 }}>
                    {d.count ? `S ${d.staff} · U ${d.user}` : 'no data'}
                  </div>
                </div>
              );
            })}
          </div>

          {!days.length && !loadingSummary && (
            <div className="text-center text-muted p-3">No calendar data for {openMonthLabel}.</div>
          )}
        </div>
      )}

      {/* ── RECORDS TABLE (whole month, or the selected date) ───────────────── */}
      {openMonth && (
        <div style={cardStyle}>
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '12px' }}>
            <div className="d-flex flex-wrap align-items-center" style={{ gap: '10px' }}>
              <Badge bg="dark" style={{ fontSize: '13px' }}>Total: {rowTotal} Records</Badge>
              <Badge bg={openDay ? 'success' : 'secondary'} style={{ fontSize: '13px' }}>
                {openDay ? openDayLabel : `Whole month — ${openMonthLabel}`}
              </Badge>
              {openDay && (
                <Button size="sm" variant="outline-secondary" onClick={closeDayCell}>
                  Show whole month
                </Button>
              )}
              <Badge bg="primary" style={{ fontSize: '13px' }}>{addedByLabel}</Badge>
              {loadingRows && <Spinner animation="border" size="sm" />}
            </div>

            <div className="d-flex flex-wrap align-items-center" style={{ gap: '8px' }}>
              <Form.Control
                size="sm"
                style={{ width: '230px' }}
                placeholder="Search RENT ID, phone, name, city…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') applySearch(search.trim()); }}
              />
              <Button size="sm" variant="primary" onClick={() => applySearch(search.trim())}>Search</Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={clearSearch}
              >
                Reset
              </Button>
              <Button size="sm" variant="success" onClick={exportRows} disabled={!rows.length}>Excel</Button>
            </div>
          </div>

          {/* Who added the records in this month (month-wide, not per date) */}
          {staffBreakdown.length > 0 && (
            <div className="d-flex flex-wrap align-items-center mb-3" style={{ gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                {openMonthLabel} by staff:
              </span>
              {staffBreakdown.map((s) => (
                <Badge
                  key={s.value}
                  bg={addedBy === s.value ? 'primary' : 'light'}
                  text={addedBy === s.value ? 'light' : 'dark'}
                  style={{ cursor: 'pointer', border: '1px solid #e5e7eb', fontSize: '12px', padding: '7px 10px' }}
                  onClick={() => changeAddedBy(addedBy === s.value ? '' : s.value)}
                >
                  {s.name}: <b>{s.count}</b>
                </Badge>
              ))}
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <Table striped bordered hover responsive size="sm">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>RENT ID</th>
                  <th>Added On</th>
                  <th>Phone Number</th>
                  <th>Owner Name</th>
                  <th>Property Type</th>
                  <th>Property Mode</th>
                  <th>Rental Amount</th>
                  <th>City</th>
                  <th>Area</th>
                  <th>Status</th>
                  <th>Added By</th>
                  <th>Role</th>
                  <th>Created By</th>
                  <th>Views</th>
                </tr>
              </thead>
              <tbody>
                {!loadingRows && rows.length === 0 && (
                  <tr>
                    <td colSpan={15} className="text-center">
                      No records added on {openDay ? openDayLabel : openMonthLabel}.
                    </td>
                  </tr>
                )}
                {rows.map((r, i) => (
                  <tr key={r._id || i}>
                    <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td
                      style={{ cursor: 'pointer', color: '#0d6efd', fontWeight: 600 }}
                      onClick={() =>
                        navigate('/dashboard/detail', {
                          state: { rentId: r.rentId, phoneNumber: r.phoneNumber },
                        })
                      }
                    >
                      {r.rentId}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{moment(r.createdAt).format('DD-MM-YYYY hh:mm A')}</td>
                    <td>
                      <PhoneCell
                        phone={r.phoneNumber}
                        display={r.assignedPhoneNumber || r.phoneNumber}
                        type="owner"
                        rentId={r.rentId}
                      />
                    </td>
                    <td>{r.ownerName || '-'}</td>
                    <td>{r.propertyType || '-'}</td>
                    <td>{r.propertyMode || '-'}</td>
                    <td>{r.rentalAmount || 0}</td>
                    <td>{r.city || '-'}</td>
                    <td>{r.area || '-'}</td>
                    <td>
                      <Badge bg={r.isDeleted || r.status === 'delete' ? 'danger' : 'secondary'}>
                        {r.status || '-'}
                      </Badge>
                    </td>
                    <td>{r.addedBy || <span className="text-muted">Not Set</span>}</td>
                    <td>{r.addedByRole || '-'}</td>
                    <td>{r.createdBy || '-'}</td>
                    <td><FaEye /> {r.views || 0}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {pages > 1 && (
            <div className="d-flex align-items-center justify-content-center mt-3" style={{ gap: '10px' }}>
              <Button size="sm" variant="outline-primary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span style={{ fontSize: '13px' }}>Page {page} of {pages}</span>
              <Button size="sm" variant="outline-primary" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataAdded;
