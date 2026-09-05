import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Table, Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  FaFileExcel, FaSyncAlt, FaSignInAlt, FaBuilding, FaMoneyBill,
  FaUserFriends, FaCoins, FaPhone,
} from 'react-icons/fa';
import PhoneCell from './components/PhoneCell';

const API = process.env.REACT_APP_API_URL;

// ── Helpers ───────────────────────────────────────────────────────────────────
const sectionHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginTop: '24px',
  marginBottom: '12px',
  padding: '10px 16px',
  borderRadius: '8px',
  background: 'linear-gradient(90deg, #e0f2fe 0%, #f0f9ff 100%)',
  borderLeft: '4px solid #0d6efd',
  fontWeight: 600,
  fontSize: '15px',
  color: '#1e3a8a',
};

const cardGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '14px',
};

const cardStyle = (color) => ({
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderLeft: `4px solid ${color}`,
  borderRadius: '8px',
  padding: '14px 16px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  transition: 'transform 0.15s, box-shadow 0.15s',
  cursor: 'default',
});

const cardLabel = { fontSize: '13px', color: '#6b7280', marginBottom: '6px' };
const cardValue = { fontSize: '24px', fontWeight: 700, color: '#111827' };

const inRangeFactory = (start, end) => {
  const s = moment(start).startOf('day');
  const e = moment(end).endOf('day');
  return (dateStr) => {
    if (!dateStr) return false;
    const d = moment(dateStr);
    if (!d.isValid()) return false;
    return d.isBetween(s, e, undefined, '[]');
  };
};

const safeArray = (val) => (Array.isArray(val) ? val : []);

// Pull a value out of a record using one or more candidate field names.
const pickField = (rec, keys) => {
  if (!rec) return undefined;
  const list = Array.isArray(keys) ? keys : [keys];
  for (const k of list) {
    if (k && rec[k] !== undefined && rec[k] !== null && rec[k] !== '') return rec[k];
  }
  return undefined;
};

const fmtCell = (val, type) => {
  if (val === undefined || val === null || val === '') return <span style={{ color: '#9ca3af' }}>—</span>;
  if (type === 'date') {
    const m = moment(val);
    return m.isValid() ? m.format('DD-MM-YYYY HH:mm') : String(val);
  }
  if (type === 'amount') {
    const n = Number(val);
    return Number.isFinite(n) ? `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : String(val);
  }
  if (typeof val === 'object') {
    try { return JSON.stringify(val); } catch { return String(val); }
  }
  return String(val);
};

// Column maps for the Summary-table expand drill-down.
// keys[] is a list of field-name fallbacks; first defined value wins.
// type: 'phone' renders the value via <PhoneCell /> (green = follow-up exists, red = none).
//   phoneType: 'owner' | 'tenant' picks which follow-up bucket to check.
const userCols = [
  { label: 'Phone', keys: ['phone', 'phoneNumber'], type: 'phone', phoneType: 'owner' },
  { label: 'Name', keys: ['name', 'firstname', 'fullName'] },
  { label: 'OTP Status', keys: ['otpStatus'] },
  { label: 'Login Date', keys: ['loginDate', 'createdAt'], type: 'date' },
];
const propertyCols = [
  { label: 'Rent ID', keys: ['rentId'] },
  { label: 'Owner Phone', keys: ['ownerPhoneNumber', 'ownerPhone', 'phoneNumber'], type: 'phone', phoneType: 'owner' },
  { label: 'Mode', keys: ['propertyMode'] },
  { label: 'Type', keys: ['propertyType'] },
  { label: 'Status', keys: ['status'] },
  { label: 'Created By', keys: ['createdBy'] },
  { label: 'Created At', keys: ['createdAt'], type: 'date' },
];
const rpPaymentCols = [
  { label: 'Txn ID', keys: ['txnid', '_id'] },
  { label: 'Rent ID', keys: ['rentId'] },
  { label: 'Phone', keys: ['phone'], type: 'phone', phoneType: 'owner' },
  { label: 'Plan', keys: ['planName'] },
  { label: 'Amount', keys: ['amount'], type: 'amount' },
  { label: 'PayU Status', keys: ['payustatususer', 'status'] },
  { label: 'Created At', keys: ['createdAt'], type: 'date' },
];
const tenantPaymentCols = [
  { label: 'Txn ID', keys: ['txnid', '_id'] },
  { label: 'Buyer ID', keys: ['Ra_Id', 'buyerId'] },
  { label: 'Phone', keys: ['phone'], type: 'phone', phoneType: 'tenant' },
  { label: 'Plan', keys: ['planName'] },
  { label: 'Amount', keys: ['amount'], type: 'amount' },
  { label: 'PayU Status', keys: ['payustatususer', 'status'] },
  { label: 'Created At', keys: ['createdAt'], type: 'date' },
];
const pointsPaymentCols = [
  { label: 'Txn ID', keys: ['txnid', '_id'] },
  { label: 'Phone', keys: ['phone'], type: 'phone', phoneType: 'owner' },
  { label: 'Points', keys: ['points'] },
  { label: 'Amount', keys: ['amount'], type: 'amount' },
  { label: 'PayU Status', keys: ['payustatususer', 'status'] },
  { label: 'Created At', keys: ['createdAt'], type: 'date' },
];
const customerCareCols = [
  { label: 'Rent ID', keys: ['rentId'] },
  { label: 'Phone', keys: ['phoneNumber', 'ownerPhoneNumber'], type: 'phone', phoneType: 'owner' },
  { label: 'Mode', keys: ['propertyMode'] },
  { label: 'Type', keys: ['propertyType'] },
  { label: 'Created At', keys: ['createdAt'], type: 'date' },
];
const contactUsCols = [
  { label: 'Name', keys: ['name'] },
  { label: 'Email', keys: ['email'] },
  { label: 'Phone', keys: ['phoneNumber', 'mobile'], type: 'phone', phoneType: 'owner' },
  { label: 'Message', keys: ['message'] },
  { label: 'Date', keys: ['date', 'createdAt'], type: 'date' },
];
const needHelpCols = [
  { label: 'Rent ID', keys: ['rentId'] },
  { label: 'Phone', keys: ['phoneNumber', 'ownerPhoneNumber'], type: 'phone', phoneType: 'owner' },
  { label: 'Reason', keys: ['selectHelpReason'] },
  { label: 'Comment', keys: ['comment'] },
  { label: 'Requested At', keys: ['requestedAt', 'createdAt'], type: 'date' },
];
const reportedCols = [
  { label: 'Rent ID', keys: ['rentId'] },
  { label: 'Owner', keys: ['ownerName'] },
  { label: 'Phone', keys: ['ownerPhoneNumber', 'phoneNumber'], type: 'phone', phoneType: 'owner' },
  { label: 'Reports', keys: ['totalReports'] },
  { label: 'Created At', keys: ['createdAt'], type: 'date' },
];
const soldOutCols = [
  { label: 'Rent ID', keys: ['rentId'] },
  { label: 'Posted Phone', keys: ['postedUserPhoneNumber'], type: 'phone', phoneType: 'owner' },
  { label: 'Mode', keys: ['propertyMode'] },
  { label: 'Type', keys: ['propertyType'] },
  { label: 'Created At', keys: ['createdAt'], type: 'date' },
];

const detailColumns = {
  otpLogin: userCols,
  preApproved: propertyCols,
  approved: propertyCols,
  pending: propertyCols,
  rpPaidSuccess: rpPaymentCols,
  rpPaidFailed: rpPaymentCols,
  rpPayLater: rpPaymentCols,
  rpPayNow: rpPaymentCols,
  tenantPaidSuccess: tenantPaymentCols,
  tenantPaidFailed: tenantPaymentCols,
  tenantPayNow: tenantPaymentCols,
  tenantPayLater: tenantPaymentCols,
  pointsPaid: pointsPaymentCols,
  pointsPayNow: pointsPaymentCols,
  pointsPayLater: pointsPaymentCols,
  pointsPayFailed: pointsPaymentCols,
  customerCare: customerCareCols,
  contactUs: contactUsCols,
  needHelp: needHelpCols,
  reportedByUser: reportedCols,
  reportedRentOut: soldOutCols,
};

const MAX_DETAIL_ROWS = 100;

// When a date range is applied, the Summary Table shows one count column per
// calendar day in the range. Per-date columns are hidden past this many days
// to keep the table from becoming unusably wide.
const MAX_DATE_COLUMNS = 45;

// ── Follow-up metric model ────────────────────────────────────────────────
// Every follow-up metric is tracked split by category across five sources:
//   `<base>_prop`  → Property follow-ups   (Rent ID)
//   `<base>_ten`   → Tenant follow-ups     (RA ID)
//   `<base>_nores` → No-Response follow-ups (phone only)
//   `<base>_visit` → Visitor follow-ups     (phone only)
//   `<base>_notint` → Not-Interested follow-ups (phone only)
// The two follow-up tables render each as a "P / T / N / V / NI" cell, with a
// legend, so the row count stays readable.
const FOLLOWUP_BASES = [
  'allFollowups',          // every follow-up record (with + without ID, all types)
  'followWithId',
  'followWithoutId',
  'followUpdated',
  'todayFollowup',
  'upcomingFollowup',      // future follow-ups
  'pastFollowup',
  'activePaymentFollowup',
  'todayPaymentFollowup',
];

// Zeroed split keys (…_prop / …_ten / …_nores / …_visit / …_notint) for a fresh bucket.
const makeSplitZero = () => {
  const z = {};
  FOLLOWUP_BASES.forEach((b) => {
    z[`${b}_prop`] = 0; z[`${b}_ten`] = 0; z[`${b}_nores`] = 0; z[`${b}_visit`] = 0;
    z[`${b}_notint`] = 0;
  });
  return z;
};

// Map a follow-up's `_source` flag to its split-key suffix.
const SOURCE_SUFFIX = {
  tenant: '_ten',
  noresponse: '_nores',
  visitor: '_visit',
  notinterested: '_notint',
  property: '_prop',
};
const catOf = (source) => SOURCE_SUFFIX[source] || '_prop';

// Rows shared by both follow-up tables (and the Excel export). `split` rows
// render "<property> / <tenant>"; plain rows render a single value.
const FOLLOWUP_DISPLAY_ROWS = [
  { label: 'All Follow-ups',              base: 'allFollowups',          split: true },
  { label: 'Follow with ID',              base: 'followWithId',          split: true },
  { label: 'Follow without ID',           base: 'followWithoutId',       split: true },
  { label: 'Follow Updated',              base: 'followUpdated',         split: true },
  { label: "Today's Follow-up",           base: 'todayFollowup',         split: true },
  { label: 'Upcoming (Future) Follow-up', base: 'upcomingFollowup',      split: true },
  { label: 'Past Follow-up',              base: 'pastFollowup',          split: true },
  { label: 'Active Payment Follow-up',    base: 'activePaymentFollowup', split: true },
  { label: "Today's Payment Follow-up",   base: 'todayPaymentFollowup',  split: true },
  { label: 'Total Bill Count',            key: 'billCount' },
  { label: 'Total Amount',                key: 'totalAmount', format: 'amount' },
];

// Read a split metric's P/T/N/V/NI quintet off a bucket (missing → 0).
const splitPair = (bucket, base) => ({
  prop: (bucket && bucket[`${base}_prop`]) || 0,
  ten: (bucket && bucket[`${base}_ten`]) || 0,
  nores: (bucket && bucket[`${base}_nores`]) || 0,
  visit: (bucket && bucket[`${base}_visit`]) || 0,
  notint: (bucket && bucket[`${base}_notint`]) || 0,
});

const RentStaffReport = () => {
  const defaultStart = moment().subtract(30, 'days').format('YYYY-MM-DD');
  const defaultEnd = moment().format('YYYY-MM-DD');

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [appliedRange, setAppliedRange] = useState({ start: defaultStart, end: defaultEnd });
  const [loading, setLoading] = useState(false);

  const [counts, setCounts] = useState({
    // 1. Login (OTP) Report
    otpLogin: 0,

    // 2. Rent Property Menu
    preApproved: 0,
    approved: 0,
    pending: 0,

    // 3. RP Property Account
    rpPaidSuccess: 0,
    rpPaidFailed: 0,
    rpPayLater: 0,
    rpPayNow: 0,

    // 4. Tenant Account
    tenantPaidSuccess: 0,
    tenantPaidFailed: 0,
    tenantPayNow: 0,
    tenantPayLater: 0,

    // 5. Points PayU Transactions
    pointsPaid: 0,
    pointsPayNow: 0,
    pointsPayLater: 0,
    pointsPayFailed: 0,

    // 6. Customer Care
    customerCare: 0,
    contactUs: 0,
    needHelp: 0,
    reportedByUser: 0,
    reportedRentOut: 0,
  });

  // Raw rows used for the Staff Daily Follow-up table (already filtered to range)
  const [followupsInRange, setFollowupsInRange] = useState([]);
  const [billsInRange, setBillsInRange] = useState([]);

  // Per-summary-row underlying records (for the Expand-row drill-down)
  const [details, setDetails] = useState({});
  const [expandedRow, setExpandedRow] = useState(null); // row key | null

  // Calendar dates in the applied range → one Summary-table column per day.
  //   array of 'YYYY-MM-DD' = the day columns to render
  //   null                  = range too wide (over MAX_DATE_COLUMNS), columns hidden
  //   []                    = no valid range
  const summaryDateList = useMemo(() => {
    const { start, end } = appliedRange || {};
    if (!start || !end) return [];
    const s = moment(start, 'YYYY-MM-DD').startOf('day');
    const e = moment(end, 'YYYY-MM-DD').startOf('day');
    if (!s.isValid() || !e.isValid() || e.isBefore(s)) return [];
    const days = e.diff(s, 'days') + 1;
    if (days > MAX_DATE_COLUMNS) return null;
    const list = [];
    const cur = s.clone();
    for (let i = 0; i < days; i++) {
      list.push(cur.format('YYYY-MM-DD'));
      cur.add(1, 'day');
    }
    return list;
  }, [appliedRange]);

  // Hourly Activity table (per selected staff + day, 9 AM → 9 PM)
  const [hourlyStaff, setHourlyStaff] = useState('');
  const [hourlyDate, setHourlyDate] = useState('');

  // Staff list for the Hourly Activity dropdown — sourced from the Users
  // page (`/admin-all`) so the dropdown matches Staff Management exactly,
  // independent of which adminNames happen to appear in the date range.
  const [adminUsers, setAdminUsers] = useState([]);
  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API}/admin-all`)
      .then((res) => {
        if (cancelled) return;
        setAdminUsers(Array.isArray(res?.data) ? res.data : []);
      })
      .catch((err) => {
        console.error('RentStaffReport: failed to load /admin-all:', err);
        if (!cancelled) setAdminUsers([]);
      });
    return () => { cancelled = true; };
  }, []);

  const fetchData = useCallback(async (rangeStart, rangeEnd) => {
    const inRange = inRangeFactory(rangeStart, rangeEnd);
    setLoading(true);

    // Helper to swallow errors so a single failed endpoint doesn't kill the page.
    const safeGet = (url) =>
      axios.get(url).then(r => r.data).catch(() => null);

    try {
      const [
        otpRes,
        preApprovedRes, allPropsRes, approvedRes, pendingRes,
        rpPaidRes, rpFailedRes, rpLaterRes, rpNowRes,
        tenantPaidRes, tenantFailedRes, tenantNowRes, tenantLaterRes,
        pointsPaidRes, pointsNowRes, pointsLaterRes, pointsFailedRes,
        customerCareRes, contactUsRes, needHelpRes, reportedRes, soldOutRes,
        followupListRes, followupBuyerListRes, followupNoResponseListRes, followupVisitorListRes, followupNotInterestedListRes, billsRes,
      ] = await Promise.all([
        // OTP / login users
        safeGet(`${API}/user/alls`),

        // Property: pre-approved + expired (matches PreApprovedCar.jsx)
        safeGet(`${API}/properties/pre-approved-all-rent`),
        safeGet(`${API}/fetch-alls-datas-all`),
        safeGet(`${API}/fetch-active-users-datas-all-rent`),
        safeGet(`${API}/properties/pending-rent`),

        // RP Property Account (PayU)
        safeGet(`${API}/payments/paid`),
        safeGet(`${API}/payments/pay-failed`),
        safeGet(`${API}/payments/pay-later`),
        safeGet(`${API}/payments/pay-now`),

        // Tenant Account
        safeGet(`${API}/payments-with-plan/paid-buyer`),
        safeGet(`${API}/payments-with-plan/pay-failed-buyer`),
        safeGet(`${API}/payments-with-plan/pay-now-buyer`),
        safeGet(`${API}/payments-with-plan/pay-later-buyer`),

        // Points PayU
        safeGet(`${API}/payu/points-payments/paid`),
        safeGet(`${API}/payu/points-payments/pay-now`),
        safeGet(`${API}/payu/points-payments/pay-later`),
        safeGet(`${API}/payu/points-payments/pay-failed`),

        // Customer Care
        safeGet(`${API}/fetch-all-property-details`),
        safeGet(`${API}/all-contactUs`),
        safeGet(`${API}/get-help-requests`),
        safeGet(`${API}/get-reported-properties`),
        safeGet(`${API}/get-all-soldout-requests`),

        // Staff Daily Follow-up table sources
        //   - /followup-list             → Property follow-ups   (Rent ID)
        //   - /followup-list-buyer       → Tenant follow-ups     (RA ID / Ra_Id)
        //   - /noresponse-followup-list  → No-Response follow-ups (phone only)
        //   - /visitor-followup-list     → Visitor follow-ups     (phone only)
        //   - /notinterested-followup-list → Not-Interested follow-ups (phone only)
        // All five feed the same Staff Daily Follow-up / Hourly tables.
        safeGet(`${API}/followup-list`),
        safeGet(`${API}/followup-list-buyer`),
        safeGet(`${API}/noresponse-followup-list`),
        safeGet(`${API}/visitor-followup-list`),
        safeGet(`${API}/notinterested-followup-list`),
        safeGet(`${API}/bills`),
      ]);

      // ── 1. OTP login (de-dupe by phone, prefer verified) ────────────
      const allUsersRaw = safeArray(otpRes?.data);
      const userMap = new Map();
      allUsersRaw.forEach((u) => {
        const phone = u.phone || '';
        if (!phone) return;
        const existing = userMap.get(phone);
        if (!existing) { userMap.set(phone, u); return; }
        const pri = (s) => (s === 'verified' ? 2 : s === 'pending' ? 1 : 0);
        if (pri(u.otpStatus) > pri(existing.otpStatus)) { userMap.set(phone, u); return; }
        if (pri(u.otpStatus) === pri(existing.otpStatus)) {
          const ed = existing.loginDate ? new Date(existing.loginDate) : null;
          const cd = u.loginDate ? new Date(u.loginDate) : null;
          if ((!ed && cd) || (ed && cd && cd > ed)) userMap.set(phone, u);
        }
      });
      const allUsers = Array.from(userMap.values());
      const otpLoginRows = allUsers.filter(u => inRange(u.loginDate));
      const otpLogin = otpLoginRows.length;

      // ── 2. Rent Property Menu ─────────────────────────────────────
      // PreApproved (merge with expired from all-props, like PreApprovedCar.jsx)
      const preApprovedUsers = safeArray(preApprovedRes?.users);
      const allPropsData = safeArray(allPropsRes?.users);
      const expiredFromAll = allPropsData.filter(p => p.status === 'expired');
      const merged = new Map();
      preApprovedUsers.forEach(p => merged.set(p.rentId, p));
      expiredFromAll.forEach(p => { if (!merged.has(p.rentId)) merged.set(p.rentId, p); });
      const preApprovedRows = Array.from(merged.values()).filter(p => inRange(p.createdAt));
      const preApproved = preApprovedRows.length;

      // Approved
      const approvedData = safeArray(approvedRes?.users);
      const approvedRows = approvedData.filter(p => inRange(p.createdAt));
      const approved = approvedRows.length;

      // Pending
      const pendingData = safeArray(pendingRes?.users);
      const pendingRows = pendingData.filter(p => inRange(p.createdAt));
      const pending = pendingRows.length;

      // ── 3. RP Property Account (PayU) ─────────────────────────────
      const rpPaidArr     = safeArray(rpPaidRes?.payments);
      const rpFailedArr   = safeArray(rpFailedRes?.payments);
      const rpLaterArr    = safeArray(rpLaterRes?.payments);
      const rpNowArr      = safeArray(rpNowRes?.payments);

      const rpPaidSuccessRows = rpPaidArr.filter(p => inRange(p.createdAt) || inRange(p.updatedAt));
      const rpPaidFailedRows  = rpFailedArr.filter(p => p.payustatususer !== 'paid' && (inRange(p.createdAt) || inRange(p.updatedAt)));
      const rpPayLaterRows    = rpLaterArr.filter(p => p.payustatususer !== 'paid' && (inRange(p.createdAt) || inRange(p.updatedAt)));
      const rpPayNowRows      = rpNowArr.filter(p => p.payustatususer !== 'paid' && (inRange(p.createdAt) || inRange(p.updatedAt)));
      const rpPaidSuccess = rpPaidSuccessRows.length;
      const rpPaidFailed  = rpPaidFailedRows.length;
      const rpPayLater    = rpPayLaterRows.length;
      const rpPayNow      = rpPayNowRows.length;

      // ── 4. Tenant Account (PayU buyer) ────────────────────────────
      const tenantPaidArr   = safeArray(tenantPaidRes?.data);
      const tenantFailedArr = safeArray(tenantFailedRes?.data);
      const tenantNowArr    = safeArray(tenantNowRes?.data);
      const tenantLaterArr  = safeArray(tenantLaterRes?.data);

      const tenantPaidSuccessRows = tenantPaidArr.filter(p => inRange(p.createdAt) || inRange(p.updatedAt));
      const tenantPaidFailedRows  = tenantFailedArr.filter(p => inRange(p.createdAt) || inRange(p.updatedAt));
      const tenantPayNowRows      = tenantNowArr.filter(p => inRange(p.createdAt) || inRange(p.updatedAt));
      const tenantPayLaterRows    = tenantLaterArr.filter(p => inRange(p.createdAt) || inRange(p.updatedAt));
      const tenantPaidSuccess = tenantPaidSuccessRows.length;
      const tenantPaidFailed  = tenantPaidFailedRows.length;
      const tenantPayNow      = tenantPayNowRows.length;
      const tenantPayLater    = tenantPayLaterRows.length;

      // ── 5. Points PayU Transactions ───────────────────────────────
      const pointsPaidArr   = safeArray(pointsPaidRes?.payments);
      const pointsNowArr    = safeArray(pointsNowRes?.payments);
      const pointsLaterArr  = safeArray(pointsLaterRes?.payments);
      const pointsFailedArr = safeArray(pointsFailedRes?.payments);

      const pointsPaidRows      = pointsPaidArr.filter(p => inRange(p.createdAt) || inRange(p.updatedAt));
      const pointsPayNowRows    = pointsNowArr.filter(p => inRange(p.createdAt) || inRange(p.updatedAt));
      const pointsPayLaterRows  = pointsLaterArr.filter(p => inRange(p.createdAt) || inRange(p.updatedAt));
      const pointsPayFailedRows = pointsFailedArr.filter(p => inRange(p.createdAt) || inRange(p.updatedAt));
      const pointsPaid      = pointsPaidRows.length;
      const pointsPayNow    = pointsPayNowRows.length;
      const pointsPayLater  = pointsPayLaterRows.length;
      const pointsPayFailed = pointsPayFailedRows.length;

      // ── 6. Customer Care ──────────────────────────────────────────
      const ccData = safeArray(customerCareRes?.data);
      const customerCareRows = ccData.filter(p => inRange(p.createdAt) || inRange(p.updatedAt));
      const customerCare = customerCareRows.length;

      // Some endpoints wrap rows in `data`, others in domain-specific keys.
      // Prefer the explicit key if present, else fall back to `data`.
      const pickArr = (...candidates) => {
        for (const c of candidates) if (Array.isArray(c)) return c;
        return [];
      };

      const contactUsArr = pickArr(contactUsRes?.contactUsData, contactUsRes?.data);
      const contactUsRows = contactUsArr.filter(p => inRange(p.createdAt) || inRange(p.date));
      const contactUs = contactUsRows.length;

      const helpArr = pickArr(needHelpRes?.data, needHelpRes?.helpRequests);
      const needHelpRows = helpArr.filter(p => inRange(p.createdAt) || inRange(p.date));
      const needHelp = needHelpRows.length;

      const reportedArr = pickArr(reportedRes?.reportedPropertiesData, reportedRes?.data);
      const reportedByUserRows = reportedArr.filter(p => inRange(p.createdAt) || inRange(p.date));
      const reportedByUser = reportedByUserRows.length;

      const soldOutArr = safeArray(soldOutRes?.soldOutRequestsData);
      const reportedRentOutRows = soldOutArr.filter(p => inRange(p.createdAt) || inRange(p.date));
      const reportedRentOut = reportedRentOutRows.length;

      // ── Staff Daily Follow-up sources (filter by createdAt within range) ──
      // Combine PROPERTY (rentId) + TENANT (Ra_Id) + NO-RESPONSE + VISITOR +
      // NOT-INTERESTED follow-ups so the Staff Daily Follow-up Summary and Hourly
      // Activity tables count all five. Each row is tagged with a `_source` flag —
      // the aggregator uses this to pick the right split bucket (P/T/N/V/NI) and the
      // right ID field when classifying Follow-with-ID vs without-ID.
      const propertyFollowups = safeArray(followupListRes?.data)
        .map(f => ({ ...f, _source: 'property' }));
      const tenantFollowups = safeArray(followupBuyerListRes?.data)
        .map(f => ({ ...f, _source: 'tenant' }));
      const noResponseFollowups = safeArray(followupNoResponseListRes?.data)
        .map(f => ({ ...f, _source: 'noresponse' }));
      const visitorFollowups = safeArray(followupVisitorListRes?.data)
        .map(f => ({ ...f, _source: 'visitor' }));
      const notInterestedFollowups = safeArray(followupNotInterestedListRes?.data)
        .map(f => ({ ...f, _source: 'notinterested' }));
      const allFollowups = [
        ...propertyFollowups, ...tenantFollowups,
        ...noResponseFollowups, ...visitorFollowups, ...notInterestedFollowups,
      ];
      const followupRows = allFollowups.filter(f => inRange(f.createdAt));
      setFollowupsInRange(followupRows);

      const allBills = safeArray(billsRes?.data);
      const billRows = allBills.filter(b => inRange(b.createdAt) || inRange(b.billDate));
      setBillsInRange(billRows);

      // ── Stash filtered arrays for the Summary Table's expand-row drill-down ──
      setDetails({
        otpLogin: otpLoginRows,
        preApproved: preApprovedRows,
        approved: approvedRows,
        pending: pendingRows,
        rpPaidSuccess: rpPaidSuccessRows,
        rpPaidFailed: rpPaidFailedRows,
        rpPayLater: rpPayLaterRows,
        rpPayNow: rpPayNowRows,
        tenantPaidSuccess: tenantPaidSuccessRows,
        tenantPaidFailed: tenantPaidFailedRows,
        tenantPayNow: tenantPayNowRows,
        tenantPayLater: tenantPayLaterRows,
        pointsPaid: pointsPaidRows,
        pointsPayNow: pointsPayNowRows,
        pointsPayLater: pointsPayLaterRows,
        pointsPayFailed: pointsPayFailedRows,
        customerCare: customerCareRows,
        contactUs: contactUsRows,
        needHelp: needHelpRows,
        reportedByUser: reportedByUserRows,
        reportedRentOut: reportedRentOutRows,
      });

      setCounts({
        otpLogin,
        preApproved, approved, pending,
        rpPaidSuccess, rpPaidFailed, rpPayLater, rpPayNow,
        tenantPaidSuccess, tenantPaidFailed, tenantPayNow, tenantPayLater,
        pointsPaid, pointsPayNow, pointsPayLater, pointsPayFailed,
        customerCare, contactUs, needHelp, reportedByUser, reportedRentOut,
      });
    } catch (err) {
      console.error('RentStaffReport fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(appliedRange.start, appliedRange.end);
  }, [appliedRange, fetchData]);

  // ── Staff Daily Follow-up aggregation ──────────────────────────────────────
  // Groups followups + bills by (Staff, Date, Session) where:
  //   A1 = 00:00 → 12:59:59 (12-hour midnight–noon block before 1 PM)
  //   A2 = 13:00 → 23:59:59
  // Date/Session is derived from each record's createdAt.
  // adminName may be a comma-separated list; we credit each staff once.
  const dailyStaffRows = useMemo(() => {
    const today = moment().startOf('day');

    const sessionOf = (ts) => {
      const m = moment(ts);
      if (!m.isValid()) return 'A1';
      return m.hour() < 13 ? 'A1' : 'A2';
    };
    const dateOf = (ts) => {
      const m = moment(ts);
      return m.isValid() ? m.format('YYYY-MM-DD') : '—';
    };
    const splitStaff = (raw) => {
      const list = String(raw || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      return list.length ? list : ['Unassigned'];
    };

    const buckets = new Map(); // key = `${staff}|${date}|${session}`
    const ensure = (staff, date, session) => {
      const key = `${staff}|${date}|${session}`;
      if (!buckets.has(key)) {
        buckets.set(key, {
          staff,
          date,
          session,
          followWithId: 0,
          followWithoutId: 0,
          followUpdated: 0,
          todayFollowup: 0,
          upcomingFollowup: 0,
          pastFollowup: 0,
          activePaymentFollowup: 0,
          todayPaymentFollowup: 0,
          billCount: 0,
          totalAmount: 0,
          ...makeSplitZero(), // per-category (…_prop / …_ten) counters
        });
      }
      return buckets.get(key);
    };

    // Followups
    followupsInRange.forEach((f) => {
      const date = dateOf(f.createdAt);
      const session = sessionOf(f.createdAt);
      const staffs = splitStaff(f.adminName);

      const created = moment(f.createdAt);
      const updated = moment(f.updatedAt);
      // Treat as "updated" only when the change is meaningful (>5s after create).
      const wasUpdated =
        created.isValid() && updated.isValid() && updated.diff(created, 'seconds') > 5;

      const followDay = moment(f.followupDate).startOf('day');
      const isToday = followDay.isValid() && followDay.isSame(today, 'day');
      const isFuture = followDay.isValid() && followDay.isAfter(today);
      const isPast = followDay.isValid() && followDay.isBefore(today);

      const isPayment = f.followupType === 'Payment Followup';
      const isClosed =
        f.followupStatus === 'Paid Closed' ||
        f.followupStatus === 'Not Interested-Closed';

      // Property records carry `rentId`; tenant records carry `Ra_Id`.
      // Either non-empty / non-"N/A" value counts as "Follow with ID".
      // No-Response / Visitor / Not-Interested are phone-only (no ID) → always "without ID".
      const idValue =
        f._source === 'tenant'
          ? (f.Ra_Id ?? f.buyerId)
          : f.rentId;
      const hasId =
        idValue !== undefined &&
        idValue !== null &&
        String(idValue).trim() !== '' &&
        String(idValue).trim().toUpperCase() !== 'N/A';

      const cat = catOf(f._source);

      staffs.forEach((staff) => {
        const b = ensure(staff, date, session);
        // bump: combined key + matching category key (…_prop / …_ten / …)
        const bump = (base, cond = true) => {
          if (!cond) return;
          b[base] = (b[base] || 0) + 1;
          b[base + cat] = (b[base + cat] || 0) + 1;
        };
        bump('allFollowups');                              // every record
        bump('followWithId', hasId);
        bump('followWithoutId', !hasId);
        bump('followUpdated', wasUpdated);
        bump('todayFollowup', isToday);
        bump('upcomingFollowup', isFuture);
        bump('pastFollowup', isPast);
        bump('activePaymentFollowup', isPayment && !isClosed);
        bump('todayPaymentFollowup', isPayment && isToday);
      });
    });

    // Bills — credit by adminName, fall back to billCreatedBy.
    billsInRange.forEach((b) => {
      const ts = b.createdAt || b.billDate;
      const date = dateOf(ts);
      const session = sessionOf(ts);
      const staffs = splitStaff(b.adminName || b.billCreatedBy);
      const amount = Number(b.netAmount ?? b.billAmount ?? 0) || 0;

      staffs.forEach((staff) => {
        const bucket = ensure(staff, date, session);
        bucket.billCount += 1;
        bucket.totalAmount += amount;
      });
    });

    return Array.from(buckets.values()).sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date); // newest first
      if (a.staff !== b.staff) return a.staff.localeCompare(b.staff);
      return a.session.localeCompare(b.session); // A1 before A2
    });
  }, [followupsInRange, billsInRange]);

  const dailyTotals = useMemo(() => {
    return dailyStaffRows.reduce(
      (acc, r) => {
        acc.followWithId += r.followWithId;
        acc.followWithoutId += r.followWithoutId;
        acc.followUpdated += r.followUpdated;
        acc.todayFollowup += r.todayFollowup;
        acc.upcomingFollowup += r.upcomingFollowup;
        acc.pastFollowup += r.pastFollowup;
        acc.activePaymentFollowup += r.activePaymentFollowup;
        acc.todayPaymentFollowup += r.todayPaymentFollowup;
        acc.billCount += r.billCount;
        acc.totalAmount += r.totalAmount;
        return acc;
      },
      {
        followWithId: 0, followWithoutId: 0, followUpdated: 0,
        todayFollowup: 0, upcomingFollowup: 0, pastFollowup: 0,
        activePaymentFollowup: 0, todayPaymentFollowup: 0,
        billCount: 0, totalAmount: 0,
      }
    );
  }, [dailyStaffRows]);

  // Pivot dailyStaffRows by (staff, date) so each group exposes A1, A2 and a
  // pre-summed `total` bucket — used by the transposed "Staff Daily Follow-up
  // Summary" table where each (staff, date) becomes 3 columns: A1 | A2 | Total.
  const dailyStaffGroups = useMemo(() => {
    const ZERO = {
      followWithId: 0, followWithoutId: 0, followUpdated: 0,
      todayFollowup: 0, upcomingFollowup: 0, pastFollowup: 0,
      activePaymentFollowup: 0, todayPaymentFollowup: 0,
      billCount: 0, totalAmount: 0,
      ...makeSplitZero(), // per-category (…_prop / …_ten) counters
    };
    const groups = new Map();
    dailyStaffRows.forEach((r) => {
      const key = `${r.staff}|${r.date}`;
      if (!groups.has(key)) groups.set(key, { staff: r.staff, date: r.date, A1: { ...ZERO }, A2: { ...ZERO } });
      // r.session is 'A1' | 'A2'; copy every numeric metric field (combined + split).
      const g = groups.get(key);
      const metrics = { ...ZERO };
      Object.keys(r).forEach((k) => { if (typeof r[k] === 'number') metrics[k] = r[k]; });
      g[r.session] = metrics;
    });
    return Array.from(groups.values())
      .map((g) => {
        const total = Object.keys(ZERO).reduce((acc, k) => {
          acc[k] = (g.A1[k] || 0) + (g.A2[k] || 0);
          return acc;
        }, {});
        return { ...g, total };
      })
      .sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date); // newest first
        return a.staff.localeCompare(b.staff);
      });
  }, [dailyStaffRows]);

  // ── Hourly Activity (per selected staff & day) ─────────────────────────────
  // Staff dropdown is sourced from the Users page (`/admin-all`) so it shows
  // the canonical staff list managed in Staff Management, not just the names
  // that happen to appear in the current date-range's followups/bills.
  const allStaffNames = useMemo(() => {
    const set = new Set();
    adminUsers.forEach((u) => {
      const name = String(u?.name || '').trim();
      if (name) set.add(name);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [adminUsers]);

  // Default the staff dropdown once data is available.
  useEffect(() => {
    if (!hourlyStaff && allStaffNames.length > 0) {
      setHourlyStaff(allStaffNames[0]);
    } else if (hourlyStaff && !allStaffNames.includes(hourlyStaff) && allStaffNames.length > 0) {
      // Selected staff disappeared from the new range — fall back to the first.
      setHourlyStaff(allStaffNames[0]);
    }
  }, [allStaffNames, hourlyStaff]);

  // Default the date to the end of the applied range (or today) when range changes.
  useEffect(() => {
    const end = appliedRange.end || moment().format('YYYY-MM-DD');
    const start = appliedRange.start || end;
    if (!hourlyDate) {
      setHourlyDate(end);
      return;
    }
    if (moment(hourlyDate).isBefore(start) || moment(hourlyDate).isAfter(end)) {
      setHourlyDate(end);
    }
  }, [appliedRange, hourlyDate]);

  // 12 one-hour buckets from 9 AM (hour 9) through 9 PM (hour 21 exclusive).
  const HOURLY_LABELS = useMemo(() => {
    const fmt = (h) => {
      if (h === 0 || h === 24) return '12 AM';
      if (h < 12) return `${h} AM`;
      if (h === 12) return '12 PM';
      return `${h - 12} PM`;
    };
    const labels = [];
    for (let h = 9; h <= 20; h += 1) {
      labels.push({ hour: h, label: `${fmt(h)} – ${fmt(h + 1)}` });
    }
    return labels;
  }, []);

  const hourlyBuckets = useMemo(() => {
    const ZERO = {
      followWithId: 0, followWithoutId: 0, followUpdated: 0,
      todayFollowup: 0, upcomingFollowup: 0, pastFollowup: 0,
      activePaymentFollowup: 0, todayPaymentFollowup: 0,
      billCount: 0, totalAmount: 0,
      ...makeSplitZero(), // per-category (…_prop / …_ten) counters
    };
    const buckets = HOURLY_LABELS.map((h) => ({ ...h, ...ZERO }));
    if (!hourlyStaff || !hourlyDate) return buckets;

    const today = moment().startOf('day');
    const splitStaff = (raw) =>
      String(raw || '').split(',').map((s) => s.trim()).filter(Boolean);

    // Follow-ups
    followupsInRange.forEach((f) => {
      const created = moment(f.createdAt);
      if (!created.isValid()) return;
      if (created.format('YYYY-MM-DD') !== hourlyDate) return;
      const staffs = splitStaff(f.adminName);
      if (!staffs.includes(hourlyStaff)) return;

      const hour = created.hour();
      if (hour < 9 || hour > 20) return; // outside the 9 AM – 9 PM window
      const bucket = buckets[hour - 9];

      const updated = moment(f.updatedAt);
      const wasUpdated =
        updated.isValid() && updated.diff(created, 'seconds') > 5;
      const followDay = moment(f.followupDate).startOf('day');
      const isToday = followDay.isValid() && followDay.isSame(today, 'day');
      const isFuture = followDay.isValid() && followDay.isAfter(today);
      const isPast = followDay.isValid() && followDay.isBefore(today);
      const isPayment = f.followupType === 'Payment Followup';
      const isClosed =
        f.followupStatus === 'Paid Closed' ||
        f.followupStatus === 'Not Interested-Closed';
      // Property → rentId, Tenant → Ra_Id (see dailyStaffRows above).
      // No-Response / Visitor / Not-Interested are phone-only → always "without ID".
      const idValue =
        f._source === 'tenant'
          ? (f.Ra_Id ?? f.buyerId)
          : f.rentId;
      const hasId =
        idValue !== undefined &&
        idValue !== null &&
        String(idValue).trim() !== '' &&
        String(idValue).trim().toUpperCase() !== 'N/A';

      const cat = catOf(f._source);
      const bump = (base, cond = true) => {
        if (!cond) return;
        bucket[base] = (bucket[base] || 0) + 1;
        bucket[base + cat] = (bucket[base + cat] || 0) + 1;
      };
      bump('allFollowups');
      bump('followWithId', hasId);
      bump('followWithoutId', !hasId);
      bump('followUpdated', wasUpdated);
      bump('todayFollowup', isToday);
      bump('upcomingFollowup', isFuture);
      bump('pastFollowup', isPast);
      bump('activePaymentFollowup', isPayment && !isClosed);
      bump('todayPaymentFollowup', isPayment && isToday);
    });

    // Bills
    billsInRange.forEach((b) => {
      const ts = b.createdAt || b.billDate;
      const created = moment(ts);
      if (!created.isValid()) return;
      if (created.format('YYYY-MM-DD') !== hourlyDate) return;
      const staffs = splitStaff(b.adminName).length
        ? splitStaff(b.adminName)
        : splitStaff(b.billCreatedBy);
      if (!staffs.includes(hourlyStaff)) return;

      const hour = created.hour();
      if (hour < 9 || hour > 20) return;
      const bucket = buckets[hour - 9];
      bucket.billCount += 1;
      bucket.totalAmount += Number(b.netAmount ?? b.billAmount ?? 0) || 0;
    });

    return buckets;
  }, [followupsInRange, billsInRange, hourlyStaff, hourlyDate, HOURLY_LABELS]);

  const hourlyTotal = useMemo(() => {
    // Sum every numeric metric key across the 12 hour buckets (covers the
    // combined keys, the …_prop / …_ten splits and allFollowups). `hour` is
    // the only numeric non-metric field, so skip it.
    const acc = {};
    hourlyBuckets.forEach((b) => {
      Object.keys(b).forEach((k) => {
        if (k === 'hour') return;
        if (typeof b[k] === 'number') acc[k] = (acc[k] || 0) + b[k];
      });
    });
    return acc;
  }, [hourlyBuckets]);

  const handleApply = () => {
    if (!startDate || !endDate) return;
    if (moment(startDate).isAfter(moment(endDate))) {
      alert('Start date cannot be after end date.');
      return;
    }
    setAppliedRange({ start: startDate, end: endDate });
  };

  const handleReset = () => {
    setStartDate(defaultStart);
    setEndDate(defaultEnd);
    setAppliedRange({ start: defaultStart, end: defaultEnd });
  };

  const handleExport = () => {
    const rangeLabel = `${moment(appliedRange.start).format('DD-MM-YYYY')} to ${moment(appliedRange.end).format('DD-MM-YYYY')}`;

    const rows = [
      ['Section', 'Report', 'Count'],

      ['Login User Report', 'Login (OTP) Report', counts.otpLogin],

      ['Rent Property', 'PreApproved Properties', counts.preApproved],
      ['Rent Property', 'Approved Properties', counts.approved],
      ['Rent Property', 'Pending Properties', counts.pending],

      ['RP Property Account', 'Payment Paid Success', counts.rpPaidSuccess],
      ['RP Property Account', 'Payment Paid Failed', counts.rpPaidFailed],
      ['RP Property Account', 'Payment Pay Later', counts.rpPayLater],
      ['RP Property Account', 'Payment Pay Now', counts.rpPayNow],

      ['Tenant Account', 'Tenant Assistant Paid Success', counts.tenantPaidSuccess],
      ['Tenant Account', 'Tenant Assistant Paid Failed', counts.tenantPaidFailed],
      ['Tenant Account', 'Tenant Assistant Pay Now', counts.tenantPayNow],
      ['Tenant Account', 'Tenant Assistant Pay Later', counts.tenantPayLater],

      ['Points PayU Transactions', 'Points - Paid', counts.pointsPaid],
      ['Points PayU Transactions', 'Points - Pay Now', counts.pointsPayNow],
      ['Points PayU Transactions', 'Points - Pay Later', counts.pointsPayLater],
      ['Points PayU Transactions', 'Points - Pay Failed', counts.pointsPayFailed],

      ['Customer Care', 'Customer Care', counts.customerCare],
      ['Customer Care', 'Contact Us Report', counts.contactUs],
      ['Customer Care', 'User Need Help', counts.needHelp],
      ['Customer Care', 'Property Reported (User)', counts.reportedByUser],
      ['Customer Care', 'Property Reported - Rent Out', counts.reportedRentOut],
    ];

    const ws = XLSX.utils.aoa_to_sheet([
      [`Rent Staff Report — ${rangeLabel}`],
      [],
      ...rows,
    ]);

    // Merge title across 3 cols and set basic column widths
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];
    ws['!cols'] = [{ wch: 26 }, { wch: 36 }, { wch: 10 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rent Staff Report');

    // ── Sheet 2: Staff Daily Follow-up Summary (PIVOTED) ──
    // Layout mirrors the on-screen pivot:
    //   • Column A holds the row labels (Sl.No, Name, Date, then metrics)
    //   • Each (Staff, Date) group occupies ONE column showing the day's totals
    const metricDefs = FOLLOWUP_DISPLAY_ROWS;

    const groupCount = dailyStaffGroups.length;
    const totalCols = 1 + groupCount + 1; // label + one column per (Staff, Date) + Total

    const formatVal = (v, fmt) =>
      fmt === 'amount'
        ? `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
        : Number(v || 0);

    // Render one metric cell from a bucket; split rows → "P / T / N / V / NI".
    const formatCell = (bucket, m) => {
      if (m.split) {
        const p = (bucket && bucket[`${m.base}_prop`]) || 0;
        const t = (bucket && bucket[`${m.base}_ten`]) || 0;
        const n = (bucket && bucket[`${m.base}_nores`]) || 0;
        const v = (bucket && bucket[`${m.base}_visit`]) || 0;
        const ni = (bucket && bucket[`${m.base}_notint`]) || 0;
        return `${p} / ${t} / ${n} / ${v} / ${ni}`;
      }
      return formatVal((bucket || {})[m.key], m.format);
    };

    // "Total" column = grand total across all (staff, date) groups in the range.
    const grandTotal = {};
    dailyStaffGroups.forEach((g) => {
      const t = g.total || {};
      Object.keys(t).forEach((k) => {
        if (typeof t[k] === 'number') grandTotal[k] = (grandTotal[k] || 0) + t[k];
      });
    });

    // Helper: build a row = [label, ...per-group cells, total cell].
    const buildRow = (label, valueFor, totalCell = '') => {
      const row = new Array(totalCols).fill('');
      row[0] = label;
      dailyStaffGroups.forEach((g, gi) => {
        row[1 + gi] = valueFor(g, gi);
      });
      row[1 + groupCount] = totalCell;
      return row;
    };

    const titleRow = new Array(totalCols).fill('');
    titleRow[0] = `Staff Daily Follow-up Summary — ${rangeLabel}`;

    const slnoRow = buildRow('Sl.No', (_g, i) => i + 1, '—');
    const nameRow = buildRow('Name', (g) => g.staff, 'All Staff');
    const dateRow = buildRow(
      'Date',
      (g) => (moment(g.date).isValid() ? moment(g.date).format('DD-MM-YYYY') : g.date),
      'Total (range)'
    );

    const metricRowsAoa = metricDefs.map((m) =>
      buildRow(
        m.label + (m.split ? ' (P / T / N / V / NI)' : ''),
        (g) => formatCell(g && g.total, m),
        formatCell(grandTotal, m)
      )
    );

    const ws2Aoa =
      groupCount === 0
        ? [
            [`Staff Daily Follow-up Summary — ${rangeLabel}`],
            [],
            ['No follow-up or bill activity in this date range.'],
          ]
        : [
            titleRow,
            new Array(totalCols).fill(''), // spacer row
            slnoRow,
            nameRow,
            dateRow,
            ...metricRowsAoa,
          ];

    const ws2 = XLSX.utils.aoa_to_sheet(ws2Aoa);

    // Title row spans the full sheet.
    ws2['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: Math.max(0, totalCols - 1) } },
    ];

    // Column widths: label column wide, each data column uniform.
    ws2['!cols'] = [
      { wch: 28 },
      ...Array(Math.max(0, totalCols - 1)).fill({ wch: 14 }),
    ];

    XLSX.utils.book_append_sheet(wb, ws2, 'Staff Daily Follow-up');

    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(
      new Blob([buf], { type: 'application/octet-stream' }),
      `Rent_Staff_Report_${moment(appliedRange.start).format('YYYYMMDD')}_${moment(appliedRange.end).format('YYYYMMDD')}.xlsx`
    );
  };

  // ── Card definition -------------------------------------------------------
  const Card = ({ label, value, color }) => (
    <div style={cardStyle(color)}>
      <div style={cardLabel}>{label}</div>
      <div style={cardValue}>{loading ? <Spinner animation="border" size="sm" /> : value}</div>
    </div>
  );

  return (
    <div className="p-3" style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <div
        style={{
          background: '#fff', borderRadius: '10px', padding: '18px 22px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '16px',
        }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3" style={{ gap: '10px' }}>
          <div>
            <h4 style={{ margin: 0, color: '#111827', fontWeight: 700 }}>Rent Staff Report</h4>
            <small style={{ color: '#6b7280' }}>
              Showing data for {moment(appliedRange.start).format('DD-MM-YYYY')} – {moment(appliedRange.end).format('DD-MM-YYYY')}
            </small>
          </div>
          <div className="d-flex flex-wrap align-items-center" style={{ gap: '8px' }}>
            <button
              type="button"
              className="btn btn-success btn-sm d-flex align-items-center"
              onClick={handleExport}
              disabled={loading}
              style={{ gap: '6px' }}
            >
              <FaFileExcel /> Export Excel
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="d-flex flex-wrap align-items-end" style={{ gap: '10px' }}>
          <div>
            <label className="form-label mb-1" style={{ fontSize: '12px', color: '#374151' }}>Start Date</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
            />
          </div>
          <div>
            <label className="form-label mb-1" style={{ fontSize: '12px', color: '#374151' }}>End Date</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
              max={moment().format('YYYY-MM-DD')}
            />
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleApply} disabled={loading}>
            Apply
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center"
            onClick={handleReset}
            disabled={loading}
            style={{ gap: '6px' }}
          >
            <FaSyncAlt /> Reset
          </button>
        </div>
      </div>

      {/* 1. Login (OTP) Report */}
      <div style={sectionHeader}>
        <FaSignInAlt /> 1. Login User Report
      </div>
      <div style={cardGrid}>
        <Card label="Login (OTP) Report" value={counts.otpLogin} color="#8b5cf6" />
      </div>

      {/* 2. Rent Property */}
      <div style={sectionHeader}>
        <FaBuilding /> 2. Rent Property
      </div>
      <div style={cardGrid}>
        <Card label="PreApproved Properties" value={counts.preApproved} color="#0ea5e9" />
        <Card label="Approved Properties" value={counts.approved} color="#10b981" />
        <Card label="Pending Properties" value={counts.pending} color="#f59e0b" />
      </div>

      {/* 3. RP Property Account */}
      <div style={sectionHeader}>
        <FaMoneyBill /> 3. RP Property Account
      </div>
      <div style={cardGrid}>
        <Card label="Payment Paid Success" value={counts.rpPaidSuccess} color="#10b981" />
        <Card label="Payment Paid Failed"  value={counts.rpPaidFailed}  color="#ef4444" />
        <Card label="Payment Pay Later"    value={counts.rpPayLater}    color="#f59e0b" />
        <Card label="Payment Pay Now"      value={counts.rpPayNow}      color="#3b82f6" />
      </div>

      {/* 4. Tenant Account */}
      <div style={sectionHeader}>
        <FaUserFriends /> 4. Tenant Account
      </div>
      <div style={cardGrid}>
        <Card label="Tenant Assistant Paid Success" value={counts.tenantPaidSuccess} color="#10b981" />
        <Card label="Tenant Assistant Paid Failed"  value={counts.tenantPaidFailed}  color="#ef4444" />
        <Card label="Tenant Assistant Pay Now"      value={counts.tenantPayNow}      color="#3b82f6" />
        <Card label="Tenant Assistant Pay Later"    value={counts.tenantPayLater}    color="#f59e0b" />
      </div>

      {/* 5. Points PayU Transactions */}
      <div style={sectionHeader}>
        <FaCoins /> 5. Points Pricing — PayU Records
      </div>
      <div style={cardGrid}>
        <Card label="Points - Paid"       value={counts.pointsPaid}      color="#10b981" />
        <Card label="Points - Pay Now"    value={counts.pointsPayNow}    color="#3b82f6" />
        <Card label="Points - Pay Later"  value={counts.pointsPayLater}  color="#f59e0b" />
        <Card label="Points - Pay Failed" value={counts.pointsPayFailed} color="#ef4444" />
      </div>

      {/* 6. Customer Care */}
      <div style={sectionHeader}>
        <FaPhone /> 6. Customer Care
      </div>
      <div style={cardGrid}>
        <Card label="Customer Care"               value={counts.customerCare}     color="#06b6d4" />
        <Card label="Contact Us Report"           value={counts.contactUs}        color="#6366f1" />
        <Card label="User Need Help"              value={counts.needHelp}         color="#ec4899" />
        <Card label="Property Reported (User)"    value={counts.reportedByUser}   color="#f97316" />
        <Card label="Property Reported - Rent Out" value={counts.reportedRentOut} color="#a855f7" />
      </div>

      {/* Summary table view */}
      <div style={sectionHeader}>📋 Summary Table</div>
      <div style={{ background: '#fff', borderRadius: '8px', padding: '12px', border: '1px solid #e5e7eb' }}>
        {summaryDateList === null && (
          <div style={{ fontSize: '12px', color: '#92400e', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '6px 10px', marginBottom: '8px' }}>
            Per-date columns are hidden because the selected range is longer than {MAX_DATE_COLUMNS} days. Narrow the Start/End dates to see a column for each date.
          </div>
        )}
        <Table responsive bordered hover size="sm" className="mb-0">
          <thead style={{ background: '#f3f4f6' }}>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>Section</th>
              <th>Report</th>
              <th style={{ width: '110px', textAlign: 'center' }}>Action</th>
              <th style={{ width: '120px', textAlign: 'right' }}>Total Count</th>
              {Array.isArray(summaryDateList) && summaryDateList.map((d, di) => (
                <th
                  key={d}
                  style={{
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    fontSize: '11px',
                    minWidth: '52px',
                    borderLeft: di === 0 ? '2px solid #c7d2fe' : undefined,
                  }}
                  title={moment(d).format('dddd, DD MMM YYYY')}
                >
                  {moment(d).format('DD MMM')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(() => {
              const summaryRows = [
                { key: 'otpLogin',         section: 'Login User Report',        report: 'Login (OTP) Report' },
                { key: 'preApproved',      section: 'Rent Property',            report: 'PreApproved Properties' },
                { key: 'approved',         section: 'Rent Property',            report: 'Approved Properties' },
                { key: 'pending',          section: 'Rent Property',            report: 'Pending Properties' },
                { key: 'rpPaidSuccess',    section: 'RP Property Account',      report: 'Payment Paid Success' },
                { key: 'rpPaidFailed',     section: 'RP Property Account',      report: 'Payment Paid Failed' },
                { key: 'rpPayLater',       section: 'RP Property Account',      report: 'Payment Pay Later' },
                { key: 'rpPayNow',         section: 'RP Property Account',      report: 'Payment Pay Now' },
                { key: 'tenantPaidSuccess',section: 'Tenant Account',           report: 'Tenant Assistant Paid Success' },
                { key: 'tenantPaidFailed', section: 'Tenant Account',           report: 'Tenant Assistant Paid Failed' },
                { key: 'tenantPayNow',     section: 'Tenant Account',           report: 'Tenant Assistant Pay Now' },
                { key: 'tenantPayLater',   section: 'Tenant Account',           report: 'Tenant Assistant Pay Later' },
                { key: 'pointsPaid',       section: 'Points PayU Transactions', report: 'Points - Paid' },
                { key: 'pointsPayNow',     section: 'Points PayU Transactions', report: 'Points - Pay Now' },
                { key: 'pointsPayLater',   section: 'Points PayU Transactions', report: 'Points - Pay Later' },
                { key: 'pointsPayFailed',  section: 'Points PayU Transactions', report: 'Points - Pay Failed' },
                { key: 'customerCare',     section: 'Customer Care',            report: 'Customer Care' },
                { key: 'contactUs',        section: 'Customer Care',            report: 'Contact Us Report' },
                { key: 'needHelp',         section: 'Customer Care',            report: 'User Need Help' },
                { key: 'reportedByUser',   section: 'Customer Care',            report: 'Property Reported (User)' },
                { key: 'reportedRentOut',  section: 'Customer Care',            report: 'Property Reported - Rent Out' },
              ];

              // Per-date columns (only when a range within the cap is applied).
              const dateCols = Array.isArray(summaryDateList) ? summaryDateList : [];
              const totalCols = 5 + dateCols.length;

              // Count a row's in-range records per calendar date, keyed on the
              // same date field that report is displayed/filtered by.
              const perDateCountFor = (rowKey) => {
                if (!dateCols.length) return null;
                const recs = safeArray(details[rowKey]);
                const dateCol = (detailColumns[rowKey] || []).find(c => c.type === 'date');
                const keys = dateCol ? dateCol.keys : ['createdAt'];
                const map = {};
                for (const r of recs) {
                  const v = pickField(r, keys);
                  if (!v) continue;
                  const m = moment(v);
                  if (!m.isValid()) continue;
                  const d = m.format('YYYY-MM-DD');
                  map[d] = (map[d] || 0) + 1;
                }
                return map;
              };

              return summaryRows.map((row, i) => {
                const count = counts[row.key];
                const rows = safeArray(details[row.key]);
                const cols = detailColumns[row.key] || [];
                const isExpanded = expandedRow === row.key;
                const canExpand = !loading && rows.length > 0;
                const perDate = perDateCountFor(row.key);
                return (
                  <React.Fragment key={row.key}>
                    <tr>
                      <td>{i + 1}</td>
                      <td>{row.section}</td>
                      <td>{row.report}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className={`btn btn-sm ${isExpanded ? 'btn-secondary' : 'btn-outline-primary'}`}
                          onClick={() => setExpandedRow(isExpanded ? null : row.key)}
                          disabled={!canExpand}
                          style={{ minWidth: '88px', padding: '2px 8px', fontSize: '12px' }}
                          title={canExpand ? 'View underlying records' : 'No records'}
                        >
                          {isExpanded ? '▲ Collapse' : '▼ Expand'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {loading ? '…' : count}
                      </td>
                      {dateCols.map((d, di) => {
                        const c = perDate && perDate[d] ? perDate[d] : 0;
                        return (
                          <td
                            key={d}
                            style={{
                              textAlign: 'center',
                              borderLeft: di === 0 ? '2px solid #c7d2fe' : undefined,
                              color: c ? '#111827' : '#d1d5db',
                              fontWeight: c ? 600 : 400,
                            }}
                          >
                            {loading ? '' : c}
                          </td>
                        );
                      })}
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={totalCols} style={{ background: '#f9fafb', padding: '12px' }}>
                          <div style={{ marginBottom: '8px', fontSize: '12px', color: '#6b7280' }}>
                            <strong>{row.report}</strong> — showing {Math.min(rows.length, MAX_DETAIL_ROWS)} of {rows.length} record{rows.length === 1 ? '' : 's'}
                            {rows.length > MAX_DETAIL_ROWS && ` (capped at ${MAX_DETAIL_ROWS})`}
                          </div>
                          <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                            <Table responsive bordered hover size="sm" className="mb-0">
                              <thead style={{ background: '#eef2ff' }}>
                                <tr>
                                  <th style={{ width: '50px' }}>#</th>
                                  {cols.map(c => (
                                    <th key={c.label} style={{ whiteSpace: 'nowrap' }}>{c.label}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {rows.slice(0, MAX_DETAIL_ROWS).map((r, ri) => (
                                  <tr key={r._id || ri}>
                                    <td>{ri + 1}</td>
                                    {cols.map(c => {
                                      const raw = pickField(r, c.keys);
                                      // Phone columns get the green/red follow-up indicator via <PhoneCell />.
                                      if (c.type === 'phone') {
                                        return (
                                          <td key={c.label} style={{ whiteSpace: 'nowrap' }}>
                                            {raw ? (
                                              <PhoneCell
                                                phone={String(raw)}
                                                type={c.phoneType || 'owner'}
                                                rentId={pickField(r, ['rentId'])}
                                                Ra_Id={pickField(r, ['Ra_Id', 'buyerId'])}
                                              />
                                            ) : (
                                              <span style={{ color: '#9ca3af' }}>—</span>
                                            )}
                                          </td>
                                        );
                                      }
                                      return (
                                        <td key={c.label} style={{ whiteSpace: 'nowrap', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                          {fmtCell(raw, c.type)}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              });
            })()}
          </tbody>
        </Table>
      </div>

      {/* Staff Daily Follow-up Summary — pivoted: labels on the left,
          one column per (Staff, Date) showing each day's totals. */}
      <div style={sectionHeader}>
        <FaUserFriends /> 📞 Staff Daily Follow-up Summary
      </div>
      <div style={{ background: '#fff', borderRadius: '8px', padding: '12px', border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
          Each column is one staff member on a given day. Follow-up rows show{' '}
          <strong>Property / Tenant / No-Response / Visitor / Not Interested</strong>{' '}
          (P = Rent ID, T = RA ID, N = No Response, V = Visitor, NI = Not Interested); the{' '}
          <strong>Total</strong> column is the grand total across the whole selected date range.
          Counts are based on follow-up <em>created</em> time and credited to every admin name on the record.
        </div>
        <div style={{ overflowX: 'auto' }}>
          {(() => {
            const metricRows = FOLLOWUP_DISPLAY_ROWS;

            const fmt = (v, format) =>
              format === 'amount'
                ? `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
                : (v ?? 0);

            // Render a metric cell from a bucket. Split rows show "P / T / N / V / NI".
            const renderCell = (bucket, m) => {
              if (m.split) {
                const { prop, ten, nores, visit, notint } = splitPair(bucket, m.base);
                return `${prop} / ${ten} / ${nores} / ${visit} / ${notint}`;
              }
              return fmt((bucket || {})[m.key], m.format);
            };

            // "Total" column = grand total over the whole selected range:
            // sum every (staff, date) group's day-total bucket.
            const grandTotal = {};
            dailyStaffGroups.forEach((g) => {
              const t = g.total || {};
              Object.keys(t).forEach((k) => {
                if (typeof t[k] === 'number') grandTotal[k] = (grandTotal[k] || 0) + t[k];
              });
            });

            const labelTh = {
              background: '#3b82f6',
              color: '#fff',
              fontWeight: 700,
              textAlign: 'center',
              border: '1px solid #1d4ed8',
              padding: '8px 10px',
              minWidth: '210px',
              whiteSpace: 'nowrap',
            };
            const dataTd = {
              border: '1px solid #cbd5e1',
              padding: '8px 12px',
              textAlign: 'center',
              minWidth: '120px',
              whiteSpace: 'nowrap',
              background: '#ffffff',
            };
            const headTd = { ...dataTd, fontWeight: 600 };
            const totalTd = {
              ...dataTd, background: '#eef2ff', fontWeight: 700,
              color: '#1e3a8a', minWidth: '130px',
            };

            if (loading) {
              return (
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <Spinner animation="border" size="sm" /> Loading…
                </div>
              );
            }
            if (dailyStaffGroups.length === 0) {
              return (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '24px' }}>
                  No follow-up or bill activity in this date range.
                </div>
              );
            }

            return (
              <table className="mb-0" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                  <tr>
                    <th style={labelTh}>Sl.No</th>
                    {dailyStaffGroups.map((g, i) => (
                      <td key={`slno-${g.staff}-${g.date}`} style={headTd}>{i + 1}</td>
                    ))}
                    <td style={totalTd}>—</td>
                  </tr>
                  <tr>
                    <th style={labelTh}>Name</th>
                    {dailyStaffGroups.map((g) => (
                      <td key={`name-${g.staff}-${g.date}`} style={headTd}>{g.staff}</td>
                    ))}
                    <td style={totalTd}>All Staff</td>
                  </tr>
                  <tr>
                    <th style={labelTh}>Date</th>
                    {dailyStaffGroups.map((g) => (
                      <td key={`date-${g.staff}-${g.date}`} style={dataTd}>
                        {moment(g.date).isValid() ? moment(g.date).format('DD-MM-YYYY') : g.date}
                      </td>
                    ))}
                    <td style={totalTd}>Total (range)</td>
                  </tr>
                  {metricRows.map((m) => {
                    const rowKey = m.key || m.base;
                    return (
                      <tr key={rowKey}>
                        <th style={labelTh}>{m.label}{m.split ? ' (P / T / N / V / NI)' : ''}</th>
                        {dailyStaffGroups.map((g) => (
                          <td key={`${rowKey}-${g.staff}-${g.date}`} style={dataTd}>
                            {renderCell(g.total, m)}
                          </td>
                        ))}
                        <td style={totalTd}>{renderCell(grandTotal, m)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
          })()}
        </div>
      </div>

      {/* Hourly Activity — pick one staff + one day, see 9 AM → 9 PM hour-by-hour */}
      <div style={sectionHeader}>
        <FaPhone /> 🕐 Hourly Activity (9 AM – 9 PM)
      </div>
      <div style={{ background: '#fff', borderRadius: '8px', padding: '12px', border: '1px solid #e5e7eb' }}>
        <div className="d-flex flex-wrap align-items-end" style={{ gap: '12px', marginBottom: '12px' }}>
          <div>
            <label className="form-label mb-1" style={{ fontSize: '12px', color: '#374151' }}>Staff</label>
            <select
              className="form-select form-select-sm"
              value={hourlyStaff}
              onChange={(e) => setHourlyStaff(e.target.value)}
              disabled={loading || allStaffNames.length === 0}
              style={{ minWidth: '200px' }}
            >
              <option value="">— Select staff —</option>
              {allStaffNames.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label mb-1" style={{ fontSize: '12px', color: '#374151' }}>Date</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={hourlyDate}
              onChange={(e) => setHourlyDate(e.target.value)}
              min={appliedRange.start || undefined}
              max={appliedRange.end || moment().format('YYYY-MM-DD')}
              style={{ width: '170px' }}
              disabled={loading}
            />
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', alignSelf: 'center' }}>
            {hourlyStaff && hourlyDate
              ? `Showing ${hourlyStaff} on ${moment(hourlyDate).format('DD-MM-YYYY')}`
              : 'Pick a staff member and date to see the hourly breakdown.'}
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
          Follow-up rows show <strong>Property / Tenant / No-Response / Visitor / Not Interested</strong>{' '}
          (P = Rent ID, T = RA ID, N = No Response, V = Visitor, NI = Not Interested).
          The <strong>Total (EOD)</strong> column is the whole-day end-of-day total.
        </div>

        <div style={{ overflowX: 'auto' }}>
          {(() => {
            const hourlyMetricRows = FOLLOWUP_DISPLAY_ROWS;

            const fmtH = (v, format) =>
              format === 'amount'
                ? `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
                : (v ?? 0);

            // Split rows show "P / T / N / V / NI"; plain rows show one value.
            const renderCellH = (bucket, m) => {
              if (m.split) {
                const { prop, ten, nores, visit, notint } = splitPair(bucket, m.base);
                return `${prop} / ${ten} / ${nores} / ${visit} / ${notint}`;
              }
              return fmtH((bucket || {})[m.key], m.format);
            };

            const labelTh = {
              background: '#3b82f6',
              color: '#fff',
              fontWeight: 700,
              textAlign: 'center',
              border: '1px solid #1d4ed8',
              padding: '8px 10px',
              minWidth: '210px',
              whiteSpace: 'nowrap',
            };
            const dataTd = {
              border: '1px solid #cbd5e1',
              padding: '8px 12px',
              textAlign: 'center',
              minWidth: '110px',
              whiteSpace: 'nowrap',
              background: '#ffffff',
            };
            const headerTd = {
              ...dataTd,
              fontWeight: 700,
              background: '#eff6ff',
              color: '#1e3a8a',
            };
            const totalTd = {
              ...dataTd,
              background: '#f8fafc',
              fontWeight: 700,
              minWidth: '120px',
            };

            if (loading) {
              return (
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <Spinner animation="border" size="sm" /> Loading…
                </div>
              );
            }
            if (!hourlyStaff) {
              return (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '24px' }}>
                  Select a staff member to see their hourly activity.
                </div>
              );
            }

            const dataColCount = hourlyBuckets.length; // 12 hours

            return (
              <table className="mb-0" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                  <tr>
                    <th style={labelTh}>Name</th>
                    <td colSpan={dataColCount + 1} style={{ ...dataTd, fontWeight: 600 }}>
                      {hourlyStaff}
                    </td>
                  </tr>
                  <tr>
                    <th style={labelTh}>Date</th>
                    <td colSpan={dataColCount + 1} style={dataTd}>
                      {moment(hourlyDate).isValid()
                        ? moment(hourlyDate).format('DD-MM-YYYY')
                        : hourlyDate}
                    </td>
                  </tr>
                  <tr>
                    <th style={labelTh}>Hour</th>
                    {hourlyBuckets.map((b) => (
                      <td key={`hour-${b.hour}`} style={headerTd}>{b.label}</td>
                    ))}
                    <td style={{ ...totalTd, color: '#1e3a8a' }}>Total (EOD)</td>
                  </tr>
                  {hourlyMetricRows.map((m) => {
                    const rowKey = m.key || m.base;
                    return (
                      <tr key={rowKey}>
                        <th style={labelTh}>{m.label}{m.split ? ' (P / T / N / V / NI)' : ''}</th>
                        {hourlyBuckets.map((b) => (
                          <td key={`${rowKey}-${b.hour}`} style={dataTd}>
                            {renderCellH(b, m)}
                          </td>
                        ))}
                        <td style={totalTd}>{renderCellH(hourlyTotal, m)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default RentStaffReport;
