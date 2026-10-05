// Live Now — who is in the user app this minute, in a drawer.
//
// Ported from PM_Matri_Admin's Live Now panel. The cards answer the same
// question over different ground: there, a member and the profile they were
// looking at; here, a login number (or an anonymous session) and what it last
// did in the Rent Pondy user app.
//
// History opens its own popup off /live-activity/user-detail rather than
// sending the user to the full-page Live User Activity screen, so this panel
// adds nothing to that screen and cannot break it.

import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Modal, Spinner, Badge, Table } from 'react-bootstrap';
import { FaHistory, FaMoon, FaMobileAlt, FaDesktop, FaAndroid } from 'react-icons/fa';

import LeadPanelShell from './LeadPanelShell';
import { ONLINE_SECS, WINDOWS, winLabel, ago, toneOf } from './useLiveNow';

const API = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

// Which road the money came in by. An owner who paid to list and a tenant who
// bought points are both PAID, but they are not the same lead.
const VIA_LABEL = { property: 'a listing', buyer: 'a tenant plan', points: 'points' };
const paidTitle = (via = []) =>
  via.length
    ? `Paid for ${via.map((v) => VIA_LABEL[v] || v).join(' + ')}`
    : 'Has never paid for anything';

const stTip = (secs) =>
  secs <= ONLINE_SECS
    ? `Did something ${ago(secs)}, so almost certainly still here.`
    : `Last did something ${ago(secs)}. The user app sends no heartbeat, so this is the last action, not a closed session.`;

const LiveNowPanel = ({ open, onClose, live }) => {
  const {
    rows, total, nFree, nPaid, nWeb, nApp, flags,
    minutes, setMinutes, who, setWho, where, setWhere, updatedAt, loading,
  } = live;
  const [detail, setDetail] = useState(null); // { phone, loading, data }

  const openDetail = async (phone) => {
    if (!phone) return;
    setDetail({ phone, loading: true, data: null });
    try {
      const res = await axios.get(`${API}/live-activity/user-detail`, { params: { phone } });
      setDetail({ phone, loading: false, data: res.data });
    } catch (e) {
      setDetail({ phone, loading: false, data: null });
    }
  };

  const controls = (
    <>
      <div className="lp-ctl-row">
        <label htmlFor="lp_mins">Last</label>
        <select
          id="lp_mins"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        >
          {WINDOWS.map((m) => (
            <option key={m} value={m}>{winLabel(m)}</option>
          ))}
        </select>
      </div>
      <div className="lp-ctl-row">
        <label className="lp-chk lp-chk-free">
          <input
            type="checkbox"
            checked={who.free}
            onChange={(e) => setWho({ ...who, free: e.target.checked })}
          />
          Free <b>{nFree}</b>
        </label>
        <label className="lp-chk lp-chk-paid">
          <input
            type="checkbox"
            checked={who.paid}
            onChange={(e) => setWho({ ...who, paid: e.target.checked })}
          />
          Paid <b>{nPaid}</b>
        </label>
      </div>
      {/* Where they are, as opposed to who they are. The Play Store app is a
          WebView around the same site, so both roads arrive in one feed and
          this is the only thing that tells them apart. */}
      <div className="lp-ctl-row">
        <label className="lp-chk lp-chk-web">
          <input
            type="checkbox"
            checked={where.web}
            onChange={(e) => setWhere({ ...where, web: e.target.checked })}
          />
          Web <b>{nWeb}</b>
        </label>
        <label className="lp-chk lp-chk-app">
          <input
            type="checkbox"
            checked={where.app}
            onChange={(e) => setWhere({ ...where, app: e.target.checked })}
          />
          App <b>{nApp}</b>
        </label>
      </div>
    </>
  );

  const card = (r, i) => {
    const isOn = r.secs <= ONLINE_SECS;
    const f = r.phone ? flags[r.phone] : null;
    const paid = !!f?.paid;
    const props = f?.properties || 0;
    const isApp = r.platform === 'App';

    return (
      <div
        key={r.key}
        className={`lp-item ${toneOf(r.action || '')}${r.isNew ? ' lp-new' : ''}`}
        style={{ animationDelay: `${Math.min(i * 55, 900)}ms` }}
      >
        <span className="lp-ago" title={stTip(r.secs)}>
          <i className={`lp-dot${isOn ? ' lp-dot-on' : ''}`} />
          <span className={`lp-st${isOn ? ' lp-st-on' : ''}`}>{isOn ? 'Online' : 'Offline'}</span>
          {' · '}
          {ago(r.secs)}
        </span>

        <div className="lp-name">
          {r.phone || 'Guest visitor'}
          {r.phone ? (
            <span
              className={`lp-t ${paid ? 'lp-t-paid' : 'lp-t-free'}`}
              title={paidTitle(f?.paidVia)}
            >
              {paid ? 'PAID' : 'FREE'}
            </span>
          ) : (
            <span className="lp-t lp-t-guest">NOT LOGGED IN</span>
          )}
          <span
            className={`lp-t ${isApp ? 'lp-t-app' : 'lp-t-web'}`}
            title={isApp ? 'Android app (com.apps.rentpondy)' : 'Web browser'}
          >
            {isApp ? 'APP' : 'WEB'}
          </span>
          {props > 0 ? <span className="lp-props">{props} prop{props === 1 ? '' : 's'}</span> : null}
        </div>

        {/* Spelled out under the badge, because "PAID" alone sends staff to the
            wrong pitch — a points buyer is not an owner with a live listing. */}
        {paid && f?.paidVia?.length ? (
          <div className="lp-via">paid for {f.paidVia.map((v) => VIA_LABEL[v] || v).join(' + ')}</div>
        ) : null}

        {r.phone ? <div className="lp-mob">{r.phone}</div> : null}

        <div className="lp-do">{r.lastAction || '—'}</div>

        {r.lastPath ? <div className="lp-on">{r.lastPath}</div> : null}

        <div className="lp-on">
          {isApp ? <FaAndroid /> : r.device === 'Mobile' ? <FaMobileAlt /> : <FaDesktop />}
          {' '}{isApp ? 'Android app' : `${r.device || 'unknown'} web`} · {r.base || 'PY'} ·{' '}
          {r.hits} action{r.hits === 1 ? '' : 's'}
        </div>

        {r.phone ? (
          <div className="lp-btns">
            <button
              type="button"
              className="lp-b lp-b-h"
              title={`Everything known about ${r.phone}`}
              onClick={() => openDetail(r.phone)}
            >
              <FaHistory /> History
            </button>
          </div>
        ) : null}
      </div>
    );
  };

  const body = () => {
    if (loading && !rows.length) {
      return <div className="lp-empty"><Spinner animation="border" size="sm" /></div>;
    }
    if (!rows.length) {
      return (
        <div className="lp-empty">
          <FaMoon />
          {total
            ? `Nobody matching those boxes. Out there right now: ${nFree} free / ${nPaid} paid, ${nWeb} web / ${nApp} app.`
            : `Nobody has done anything in the last ${winLabel(minutes)}.`}
        </div>
      );
    }
    return rows.map(card);
  };

  return (
    <>
      <LeadPanelShell
        title="Live Now"
        subtitle="What people are doing in the user app"
        open={open}
        onClose={onClose}
        controls={controls}
        footer={updatedAt ? `updated ${moment(updatedAt).format('HH:mm')}` : 'waiting…'}
      >
        {body()}
      </LeadPanelShell>

      <Modal show={!!detail} onHide={() => setDetail(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1.05rem' }}>
            History — {detail?.phone}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {detail?.loading ? (
            <div className="text-center text-muted py-4">
              <Spinner animation="border" size="sm" /> Reading everything known about this number…
            </div>
          ) : !detail?.data ? (
            <div className="text-center text-muted py-4">Could not read the history.</div>
          ) : (
            <>
              <div className="mb-3">
                <Badge bg={detail.data.paid ? 'success' : 'secondary'}>{detail.data.paidLabel}</Badge>{' '}
                <span className="text-muted">
                  {detail.data.propertyCount} propert{detail.data.propertyCount === 1 ? 'y' : 'ies'} ·{' '}
                  {detail.data.followupCount} follow-up{detail.data.followupCount === 1 ? '' : 's'}
                </span>
              </div>

              <h6 className="text-uppercase text-muted" style={{ fontSize: 11 }}>Properties</h6>
              {detail.data.properties?.length ? (
                <Table size="sm" bordered className="mb-3" style={{ fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th>Rent ID</th><th>Status</th><th>Type</th><th>Area</th><th>Payment</th><th>Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.data.properties.map((p) => (
                      <tr key={p.rentId}>
                        <td>{p.rentId}</td>
                        <td>{p.displayStatus}</td>
                        <td>{p.propertyType}</td>
                        <td>{[p.area, p.city].filter(Boolean).join(', ')}</td>
                        <td>{p.paid ? `${p.planName || 'Paid'} ${p.amount || ''}` : p.paymentStatus}</td>
                        <td>{p.createdAt ? moment(p.createdAt).format('DD MMM YYYY') : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-muted fst-italic mb-3" style={{ fontSize: 12 }}>No properties.</div>
              )}

              <h6 className="text-uppercase text-muted" style={{ fontSize: 11 }}>Follow-ups</h6>
              {detail.data.followups?.length ? (
                <Table size="sm" bordered style={{ fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th>Raised by</th><th>Type</th><th>Status</th><th>Due</th><th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.data.followups.map((f, i) => (
                      <tr key={i}>
                        <td>{f.adminName}</td>
                        <td>{f.followupType}</td>
                        <td>{f.followupStatus}</td>
                        <td>{f.followupDate ? moment(f.followupDate).format('DD MMM YYYY') : ''}</td>
                        <td>{f.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-muted fst-italic" style={{ fontSize: 12 }}>
                  Nobody is chasing this number yet.
                </div>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LiveNowPanel;
