// Row-level data behind the Admin Detail (Excel) report.
//
// Where AdminReportMail sends COUNTS as a PDF, this sends the underlying ROWS
// as a spreadsheet — every phone number, date and amount behind those numbers.
//
// It calls the same endpoints as the screen, over 127.0.0.1, and applies the
// SAME filters as AdminReport.jsx so the row counts here reconcile with the
// figures there. Where the two must agree, the comment says so.
//
// Follow-ups and Bills are MONTH-ONLY by request — no all-time totals.

const axios = require('axios');
const moment = require('moment');

const API_BASE = String(
  process.env.ADMIN_EXCEL_API_BASE ||
  process.env.ADMIN_REPORT_API_BASE ||
  `http://127.0.0.1:${process.env.PORT || 5005}/PPC`
).replace(/\/+$/, '');

const TIMEOUT_MS = Number(process.env.ADMIN_EXCEL_TIMEOUT_MS) || 180000;

const makeSafeGet = (failures) => async (path) => {
  try {
    const res = await axios.get(`${API_BASE}${path}`, { timeout: TIMEOUT_MS });
    return res.data ?? {};
  } catch (error) {
    failures.push(`${path} (${error.response?.status || error.code || error.message})`);
    return {};
  }
};

const arr = (v) => (Array.isArray(v) ? v : []);
const pick = (...values) => { for (const v of values) if (v) return arr(v); return []; };

/** 'DD-MM-YYYY HH:mm' in IST, or '' — Excel-friendly and unambiguous. */
const stamp = (value) => (value ? moment(value).format('DD-MM-YYYY HH:mm') : '');
const dayOnly = (value) => (value ? moment(value).format('DD-MM-YYYY') : '');
const money = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/**
 * Build every sheet of the detail workbook.
 * @returns {Promise<{date,monthLabel,failures,sheets,summary}>}
 */
async function fetchAdminDetail() {
  const failures = [];
  const safeGet = makeSafeGet(failures);

  const yStart = moment().subtract(1, 'days').startOf('day');
  const yEnd = moment().subtract(1, 'days').endOf('day');
  const isYesterday = (d) => Boolean(d) && moment(d).isBetween(yStart, yEnd, undefined, '[]');
  const isThisMonth = (d) => Boolean(d) && moment(d).isSame(moment(), 'month');

  const [
    contactRes, favoriteRes, photoRes, addressRes, offersRes, viewedRes, interestRes, calledRes,
    loginUsersRes,
    propPayFailedRes, propPayNowRes, propPayLaterRes,
    tenantPayFailedRes, tenantPayNowRes, tenantPayLaterRes,
    propFollowRes, tenantFollowRes, propBillsRes, tenantBillsRes,
  ] = await Promise.all([
    safeGet('/get-all-contact-requests'),
    safeGet('/get-all-favorite-requests'),
    safeGet('/all-photo-requests'),
    safeGet('/get-address-requests-all'),
    safeGet('/all-offers'),
    safeGet('/user-get-all-last-views'),
    safeGet('/get-all-sendinterest'),
    safeGet('/get-all-contact-sent-properties'),
    safeGet('/user/alls'),
    safeGet('/payments/pay-failed'),
    safeGet('/payments/pay-now'),
    safeGet('/payments/pay-later'),
    safeGet('/payments-with-plan/pay-failed-buyer'),
    safeGet('/payments-with-plan/pay-now-buyer'),
    safeGet('/payments-with-plan/pay-later-buyer'),
    safeGet('/followup-list'),
    safeGet('/followup-list-buyer'),
    safeGet('/bills'),
    safeGet('/buyer-bills-rent'),
  ]);

  // ── Sheet: Yesterday Actions ────────────────────────────────────────────────
  // One row per action. The row COUNT of each action here equals the number on
  // the PDF report's "Yesterday's Actions" tab — same source, same filter.
  const actions = [];
  const addAction = (action, date, userPhone, ownerPhone, id, detail) =>
    actions.push([action, stamp(date), String(userPhone || ''), String(ownerPhone || ''), String(id ?? ''), detail || '']);

  // CONTACT VIEWED counts each nested {phoneNumber,date} entry, not the parent.
  arr(contactRes.contactRequestsData).forEach((p) => {
    arr(p.contactRequestedUserPhoneNumbers)
      .filter((r) => isYesterday(r.date))
      .forEach((r) => addAction('CONTACT VIEWED', r.date, r.phoneNumber, p.postedUserPhoneNumber, p.rentId,
        [p.propertyType, p.area].filter(Boolean).join(' · ')));
  });

  // FAVORITE LIST / SEND INTEREST are counted per PROPERTY row (the nested
  // phone arrays are bare strings with no dates), so one row each, phones joined.
  arr(favoriteRes.favoriteRequestsData)
    .filter((f) => isYesterday(f.updatedAt || f.createdAt))
    .forEach((f) => addAction('FAVORITE LIST', f.updatedAt || f.createdAt,
      arr(f.favoritedUserPhoneNumbers).join(', '), f.postedUserPhoneNumber, f.rentId,
      [f.propertyType, f.area].filter(Boolean).join(' · ')));

  arr(photoRes).filter((r) => isYesterday(r.createdAt))
    .forEach((r) => addAction('PHOTO REQUEST', r.createdAt, r.requesterPhoneNumber, r.postedUserPhoneNumber, r.rentId,
      [r.propertyType, r.area].filter(Boolean).join(' · ')));

  arr(addressRes.requests).filter((r) => isYesterday(r.createdAt))
    .forEach((r) => addAction('ADDRESS REQUEST', r.createdAt, r.requesterPhoneNumber, r.postedUserPhoneNumber, r.rentId,
      [r.city, r.area].filter(Boolean).join(' · ')));

  arr(offersRes.offers).filter((r) => isYesterday(r.createdAt))
    .forEach((r) => addAction('OFFER RAISED', r.createdAt, r.phoneNumber, r.postedUserPhoneNumber, r.rentId,
      `Offered ${money(r.offeredPrice)} (asking ${money(r.originalPrice)})`));

  arr(viewedRes).filter((r) => isYesterday(r.createdAt || r.viewedAt))
    .forEach((r) => addAction('VIEWED PROPERTY', r.createdAt || r.viewedAt, r.phoneNumber,
      r.property?.phoneNumber, r.property?.rentId, r.property?.propertyType || ''));

  arr(interestRes.interestRequestsData).filter((r) => isYesterday(r.createdAt))
    .forEach((r) => addAction('SEND INTEREST', r.createdAt,
      arr(r.interestedUserPhoneNumbers).join(', '), r.postedUserPhoneNumber, r.rentId,
      [r.propertyType, r.area].filter(Boolean).join(' · ')));

  arr(calledRes.properties).filter((r) => isYesterday(r.contactedAt))
    .forEach((r) => addAction('CALLED LIST', r.contactedAt, r.userPhone, r.postedUserPhone, r.rentId,
      r.property?.propertyType || ''));

  // ── Users: one record per phone (verified wins, then newest login) ──────────
  // Identical de-duplication to AdminReport.jsx, or the login counts diverge.
  const userMap = new Map();
  arr(loginUsersRes.data).forEach((u) => {
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
  const isReported = (u) => u.remarks === 'seller' || u.remarks === 'buyer' || u.remarks === 'visitor';
  const roleOf = (u) => (u.remarks === 'seller' ? 'OWNER' : u.remarks === 'buyer' ? 'TENANT'
    : u.remarks === 'visitor' ? 'VISITOR' : 'UNREPORTED');

  // ── Sheet: Yesterday Login ──────────────────────────────────────────────────
  const logins = allUsers
    .filter((u) => isYesterday(u.loginDate))
    .sort((a, b) => new Date(b.loginDate) - new Date(a.loginDate))
    .map((u) => [
      String(u.phone || ''), stamp(u.loginDate), u.loginMode || '', u.otpStatus || '',
      roleOf(u), isReported(u) ? 'REPORTED' : 'UNREPORTED',
      u.conversionStatus || 'pending', u.staffName || '', u.reportedBy || '',
    ]);

  // ── Sheet: Unreported & Unconverted (all-time backlog) ──────────────────────
  const unreported = allUsers.filter((u) => !isReported(u));
  const unconverted = allUsers.filter((u) => !u.conversionStatus || u.conversionStatus === 'pending');
  const backlogMap = new Map();
  const addBacklog = (u, tag) => {
    const key = u.phone;
    if (!backlogMap.has(key)) backlogMap.set(key, { u, tags: new Set() });
    backlogMap.get(key).tags.add(tag);
  };
  unreported.forEach((u) => addBacklog(u, 'UNREPORTED'));
  unconverted.forEach((u) => addBacklog(u, 'CONVERSION PENDING'));
  const backlog = Array.from(backlogMap.values())
    .sort((a, b) => new Date(b.u.loginDate || 0) - new Date(a.u.loginDate || 0))
    .map(({ u, tags }) => [
      String(u.phone || ''), [...tags].join(' + '), stamp(u.loginDate),
      roleOf(u), u.conversionStatus || 'pending', u.otpStatus || '', u.loginMode || '', u.staffName || '',
    ]);

  // ── Sheet: Payments ─────────────────────────────────────────────────────────
  // Property buckets drop rows already marked paid, exactly as the counts do.
  const payments = [];
  const addPayments = (bucket, rows, idKey) =>
    rows.forEach((p) => payments.push([
      bucket, String(p.phone || p.firstname || ''), money(p.amount), p.planName || '',
      String(p[idKey] ?? ''), p.status || '', p.payustatususer || '',
      stamp(p.payUdate || p.createdAt), p.txnid || '',
    ]));

  const notPaid = (rows) => rows.filter((p) => p.payustatususer !== 'paid');
  addPayments('PROPERTY · PAY FAILED', notPaid(pick(propPayFailedRes.payments, propPayFailedRes.data)), 'rentId');
  addPayments('PROPERTY · PAY NOW', notPaid(pick(propPayNowRes.payments, propPayNowRes.data)), 'rentId');
  addPayments('PROPERTY · PAY LATER', notPaid(pick(propPayLaterRes.payments, propPayLaterRes.data)), 'rentId');
  addPayments('TENANT · PAY FAILED', arr(tenantPayFailedRes.data), 'Ra_Id');
  addPayments('TENANT · PAY NOW', arr(tenantPayNowRes.data), 'Ra_Id');
  addPayments('TENANT · PAY LATER', arr(tenantPayLaterRes.data), 'Ra_Id');

  // ── Sheet: Follow-ups (THIS MONTH ONLY) ─────────────────────────────────────
  // Month is decided by followupDate — work DUE this month, matching the PDF.
  const followups = [
    ...arr(propFollowRes.data).filter((f) => isThisMonth(f.followupDate || f.createdAt))
      .map((f) => ['PROPERTY', String(f.phoneNumber || ''), String(f.rentId ?? ''),
        dayOnly(f.followupDate), f.followupStatus || '', f.followupType || '',
        f.adminName || '', f.base || '', String(f.remarks || '').slice(0, 200), stamp(f.createdAt)]),
    ...arr(tenantFollowRes.data).filter((f) => isThisMonth(f.followupDate || f.createdAt))
      .map((f) => ['TENANT', String(f.phoneNumber || ''), String(f.Ra_Id ?? ''),
        dayOnly(f.followupDate), f.followupStatus || '', f.followupType || '',
        f.adminName || '', f.base || '', String(f.remarks || '').slice(0, 200), stamp(f.createdAt)]),
  ].sort((a, b) => moment(a[3], 'DD-MM-YYYY') - moment(b[3], 'DD-MM-YYYY'));

  // ── Sheet: Bills (THIS MONTH ONLY) ──────────────────────────────────────────
  const billRow = (type, b, idKey) => [
    type, b.billNo || '', dayOnly(b.billDate || b.createdAt), String(b.ownerPhone || ''),
    String(b[idKey] ?? ''), b.planName || '', b.paymentType || '',
    money(b.billAmount), money(b.featuredAmount), money(b.discount), money(b.netAmount),
    b.adminName || '', b.adminOffice || '',
  ];
  const billThisMonth = (b) => isThisMonth(b.billDate || b.createdAt);
  const propBillsMonth = arr(propBillsRes.data).filter(billThisMonth);
  const tenantBillsMonth = arr(tenantBillsRes.data).filter(billThisMonth);
  const bills = [
    ...propBillsMonth.map((b) => billRow('PROPERTY', b, 'rentId')),
    ...tenantBillsMonth.map((b) => billRow('TENANT', b, 'Ra_Id')),
  ].sort((a, b) => moment(a[2], 'DD-MM-YYYY') - moment(b[2], 'DD-MM-YYYY'));

  const sumNet = (rows) => rows.reduce((s, b) => s + money(b.netAmount ?? b.billAmount), 0);

  const date = moment().subtract(1, 'days').format('DD-MM-YYYY');
  const monthLabel = moment().format('MMM YYYY').toUpperCase();

  const summary = {
    actions: actions.length,
    logins: logins.length,
    backlog: backlog.length,
    unreported: unreported.length,
    unconverted: unconverted.length,
    payments: payments.length,
    followups: followups.length,
    bills: bills.length,
    billAmountMonth: sumNet(propBillsMonth) + sumNet(tenantBillsMonth),
  };

  return {
    date,
    monthLabel,
    generatedAt: new Date(),
    failures,
    summary,
    sheets: [
      {
        name: `Yesterday Actions`,
        title: `Yesterday's Actions — ${date}`,
        columns: ['ACTION', 'DATE / TIME', 'USER PHONE', 'OWNER PHONE', 'RENT ID', 'DETAIL'],
        rows: actions,
      },
      {
        name: 'Yesterday Login',
        title: `Yesterday's Login — ${date}`,
        columns: ['PHONE', 'LOGIN DATE', 'LOGIN MODE', 'OTP STATUS', 'ROLE', 'REPORTED?', 'CONVERSION', 'STAFF', 'REPORTED BY'],
        rows: logins,
      },
      {
        name: 'Unreported-Unconverted',
        title: 'Unreported & Conversion-Pending users (all time)',
        columns: ['PHONE', 'CATEGORY', 'LAST LOGIN', 'ROLE', 'CONVERSION', 'OTP STATUS', 'LOGIN MODE', 'STAFF'],
        rows: backlog,
      },
      {
        name: 'Payments',
        title: 'Payment Management (outstanding)',
        columns: ['BUCKET', 'PHONE', 'AMOUNT', 'PLAN', 'RENT / RA ID', 'STATUS', 'PAYU STATUS', 'DATE', 'TXN ID'],
        rows: payments,
      },
      {
        name: `Followups ${monthLabel}`,
        title: `Follow-ups due in ${monthLabel}`,
        columns: ['TYPE', 'PHONE', 'RENT / RA ID', 'FOLLOW-UP DATE', 'STATUS', 'FOLLOW-UP TYPE', 'ADMIN', 'BASE', 'REMARKS', 'CREATED'],
        rows: followups,
      },
      {
        name: `Bills ${monthLabel}`,
        title: `Bills raised in ${monthLabel}`,
        columns: ['TYPE', 'BILL NO', 'BILL DATE', 'OWNER PHONE', 'RENT / RA ID', 'PLAN', 'PAYMENT TYPE',
          'BILL AMOUNT', 'FEATURED', 'DISCOUNT', 'NET AMOUNT', 'ADMIN', 'OFFICE'],
        rows: bills,
      },
    ],
  };
}

module.exports = { fetchAdminDetail, API_BASE };
