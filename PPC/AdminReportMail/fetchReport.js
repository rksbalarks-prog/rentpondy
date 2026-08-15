// Gathers the numbers behind "Rent Pondy Overall Report - Admin".
//
// This is a server-side port of Rent_Pondy Admin/src/AdminReport.jsx
// (fetchData / fetchYesterdayActions / fetchBillCounts / fetchFollowupCounts).
// It calls the SAME public endpoints the screen calls, over localhost, rather
// than re-querying Mongo — so the PDF cannot drift from the page just because
// somebody changed a route's filtering.
//
// No `base` query parameter is sent, which cityScopePlugin reads as "no
// restriction" — i.e. the All Cities view the screen defaults to.
//
// IMPORTANT: the tab labels, row order and derivation of every figure below
// mirror AdminReport.jsx exactly. If that screen changes, change this too.

const axios = require('axios');
const moment = require('moment');

const API_BASE = String(
  process.env.ADMIN_REPORT_API_BASE || `http://127.0.0.1:${process.env.PORT || 5005}/PPC`
).replace(/\/+$/, '');

const TIMEOUT_MS = Number(process.env.ADMIN_REPORT_TIMEOUT_MS) || 120000;

// Per-endpoint failures are swallowed exactly as the screen does: several of
// these legitimately 404 when a list is empty (e.g. pay-failed-buyer), and one
// 404 must not zero out every other figure. They are collected per call rather
// than in module scope so two overlapping runs cannot pollute each other.
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

// Mirrors the screen's `a || b || []`: an EMPTY array is truthy, so `{payments:
// [], data: [...]}` yields [] here just as it does in the browser. Using
// `.length` to choose instead would silently disagree with the page.
const pick = (...values) => {
  for (const v of values) if (v) return arr(v);
  return [];
};

/**
 * Build the whole report.
 * @returns {Promise<{date: string, sections: object[], failures: string[]}>}
 */
async function fetchAdminReport() {
  const failures = [];
  const safeGet = makeSafeGet(failures);

  const yesterdayStart = moment().subtract(1, 'days').startOf('day');
  const yesterdayEnd = moment().subtract(1, 'days').endOf('day');
  const isYesterday = (dateStr) =>
    Boolean(dateStr) && moment(dateStr).isBetween(yesterdayStart, yesterdayEnd, undefined, '[]');

  const [
    contactRes, favoriteRes, photoRes, addressRes, offersRes, viewedRes, interestRes, calledRes,
    loginUsersRes, approvedRes, freePlansRes, paidPlansRes, baActiveRes, allBuyerBillsRes,
    baFreeRes, baPaidRes, payuBuyerRes, preApprovedRes, allPropsRes, pendingRes, deletedRes,
    expiredRes, pendingBARes, allBARes, propPayFailedRes, propPayNowRes, propPayLaterRes,
    tenantPayFailedRes, tenantPayNowRes, tenantPayLaterRes, propBillsRes, tenantBillsRes,
    propFollowRes, tenantFollowRes,
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
    safeGet('/fetch-active-users-datas-all-rent'),
    safeGet('/fetch-all-free-plans'),
    safeGet('/fetch-all-paid-plans'),
    safeGet('/raActive-buyerAssistance-all-plans-rent'),
    safeGet('/buyer-bills-rent'),
    safeGet('/buyer-bills/free-with-assistance-rent'),
    safeGet('/buyer-bills/non-free-with-assistance-rent'),
    safeGet('/payments-with-plan/paid-buyer'),
    safeGet('/properties/pre-approved-all-rent'),
    safeGet('/fetch-alls-datas-all'),
    safeGet('/properties/pending-rent'),
    safeGet('/properties/deleted-rent'),
    safeGet('/all-expired-properties'),
    safeGet('/fetch-buyerAssistance-pending-rent'),
    safeGet('/fetch-buyer-assistance-rent'),
    safeGet('/payments/pay-failed'),
    safeGet('/payments/pay-now'),
    safeGet('/payments/pay-later'),
    safeGet('/payments-with-plan/pay-failed-buyer'),
    safeGet('/payments-with-plan/pay-now-buyer'),
    safeGet('/payments-with-plan/pay-later-buyer'),
    safeGet('/bills'),
    safeGet('/buyer-bills-rent'),
    safeGet('/followup-list'),
    safeGet('/followup-list-buyer'),
  ]);

  // ── Tab 1: Yesterday's Actions ──────────────────────────────────────────────
  const contactData = arr(contactRes.contactRequestsData);
  const favoriteData = arr(favoriteRes.favoriteRequestsData);
  const photoData = arr(photoRes);
  const addressData = arr(addressRes.requests);
  const offersData = arr(offersRes.offers);
  const viewedData = arr(viewedRes);
  const interestData = arr(interestRes.interestRequestsData);
  const calledData = calledRes.success ? arr(calledRes.properties) : [];

  const actions = {
    contactViewed: contactData.reduce(
      (sum, item) => sum + arr(item.contactRequestedUserPhoneNumbers).filter((r) => isYesterday(r.date)).length, 0),
    favoriteList: favoriteData.filter((i) => isYesterday(i.updatedAt || i.createdAt)).length,
    photoRequest: photoData.filter((i) => isYesterday(i.createdAt)).length,
    addressRequests: addressData.filter((i) => isYesterday(i.createdAt)).length,
    offerRaised: offersData.filter((i) => isYesterday(i.createdAt)).length,
    viewedProperties: viewedData.filter((i) => isYesterday(i.createdAt || i.viewedAt)).length,
    sendInterest: interestData.filter((i) => isYesterday(i.createdAt)).length,
    calledList: calledData.filter((i) => isYesterday(i.contactedAt)).length,
  };

  // ── Tab 2: Yesterday's Login ────────────────────────────────────────────────
  // One row per phone number: prefer the verified record, then the newest login.
  const allUsersRaw = Array.isArray(loginUsersRes?.data) ? loginUsersRes.data : [];
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
  const isReported = (u) => u.remarks === 'seller' || u.remarks === 'buyer' || u.remarks === 'visitor';

  const totalUnreported = allUsers.filter((u) => !isReported(u)).length;
  const totalConversionPending = allUsers.filter((u) => !u.conversionStatus || u.conversionStatus === 'pending').length;

  const yesterdayUsers = allUsers.filter((u) => isYesterday(u.loginDate));
  const login = {
    totalLogin: yesterdayUsers.length,
    reported: yesterdayUsers.filter(isReported).length,
    unreported: yesterdayUsers.filter((u) => !isReported(u)).length,
    owner: yesterdayUsers.filter((u) => u.remarks === 'seller').length,
    tenant: yesterdayUsers.filter((u) => u.remarks === 'buyer').length,
    visitor: yesterdayUsers.filter((u) => u.remarks === 'visitor').length,
    conversionPaid: yesterdayUsers.filter((u) => u.conversionStatus === 'paid').length,
    conversionFree: yesterdayUsers.filter((u) => u.conversionStatus === 'free').length,
    conversionPending: yesterdayUsers.filter((u) => !u.conversionStatus || u.conversionStatus === 'pending').length,
  };

  // ── Tab 3: Yesterday's Property ─────────────────────────────────────────────
  const approvedData = arr(approvedRes.users);
  const rentIdsFrom = (plans) => {
    const ids = new Set();
    arr(plans).forEach((item) => arr(item.properties).forEach((p) => { if (p.rentId) ids.add(p.rentId); }));
    return ids;
  };
  const freeRentIds = rentIdsFrom(freePlansRes.data);
  const paidRentIds = rentIdsFrom(paidPlansRes.data);

  const yesterdayApproved = approvedData.filter((i) => isYesterday(i.createdAt));

  // Tenant-assistance plans are classified free/paid by Ra_Id across three
  // sources, with the bill's paymentType as the fallback.
  const baFreeIds = new Set(arr(baFreeRes.data).map((i) => i.buyerAssistance?.Ra_Id).filter(Boolean));
  const baPaidIds = new Set(arr(baPaidRes.data).map((i) => i.buyerAssistance?.Ra_Id).filter(Boolean));
  arr(payuBuyerRes.data).forEach((p) => { if (p.Ra_Id) baPaidIds.add(p.Ra_Id); });
  arr(allBuyerBillsRes.data).forEach((bill) => {
    const raId = bill.Ra_Id;
    if (raId && !baFreeIds.has(raId) && !baPaidIds.has(raId)) {
      if (bill.paymentType?.toLowerCase() === 'free') baFreeIds.add(raId);
      else baPaidIds.add(raId);
    }
  });

  const yesterdayBA = arr(baActiveRes.data).filter((item) => {
    if (item.isDeleted) return false;
    return isYesterday(item.createdAt) || isYesterday(item.planDetails?.planCreatedAt) || isYesterday(item.updatedAt);
  });

  const property = {
    totalCreated: yesterdayApproved.length,
    freeProperty: yesterdayApproved.filter((i) => freeRentIds.has(i.rentId) && !paidRentIds.has(i.rentId)).length,
    paidProperty: yesterdayApproved.filter((i) => paidRentIds.has(i.rentId)).length,
    tenantTotal: yesterdayBA.length,
    tenantFree: yesterdayBA.filter((i) => baFreeIds.has(i.Ra_Id) && !baPaidIds.has(i.Ra_Id)).length,
    tenantPaid: yesterdayBA.filter((i) => baPaidIds.has(i.Ra_Id)).length,
  };

  // ── Tab 4: Property Status ──────────────────────────────────────────────────
  // Pre-approved is merged with expired-from-all, de-duplicated on rentId.
  const mergedPreApproved = new Map();
  arr(preApprovedRes.users).forEach((p) => mergedPreApproved.set(p.rentId, p));
  arr(allPropsRes.users).filter((p) => p.status === 'expired')
    .forEach((p) => { if (!mergedPreApproved.has(p.rentId)) mergedPreApproved.set(p.rentId, p); });

  const status = {
    preApproved: mergedPreApproved.size,
    pending: arr(pendingRes.users).length,
    deleted: arr(deletedRes.data).filter((p) => p.status === 'delete').length,
    expired: arr(expiredRes.expiredPlans).length,
    tenantPending: arr(pendingBARes.data).filter((i) => !i.isDeleted).length,
    tenantDeleted: arr(allBARes.data).filter((i) => i.isDeleted === true).length,
    totalUnreported,
    totalConversionPending,
  };

  // ── Tab 5: Payments ─────────────────────────────────────────────────────────
  const notPaid = (rows) => rows.filter((p) => p.payustatususer !== 'paid').length;
  const payments = {
    propPayFailed: notPaid(pick(propPayFailedRes.payments, propPayFailedRes.data)),
    propPayNow: notPaid(pick(propPayNowRes.payments, propPayNowRes.data)),
    propPayLater: notPaid(pick(propPayLaterRes.payments, propPayLaterRes.data)),
    tenantPayFailed: arr(tenantPayFailedRes.data).length,
    tenantPayNow: arr(tenantPayNowRes.data).length,
    tenantPayLater: arr(tenantPayLaterRes.data).length,
  };

  // ── Tab 6: Follow-ups ───────────────────────────────────────────────────────
  // "This month" counts follow-ups DUE in the current calendar month
  // (followupDate) — the workload the team has to get through — not ones merely
  // created in it. createdAt is the fallback for rows saved without a date.
  const inThisMonth = (value) => Boolean(value) && moment(value).isSame(moment(), 'month');

  const propFollowups = arr(propFollowRes.data);
  const tenantFollowups = arr(tenantFollowRes.data);
  const followups = {
    propertyFollowups: propFollowups.length,
    tenantFollowups: tenantFollowups.length,
    propertyThisMonth: propFollowups.filter((f) => inThisMonth(f.followupDate || f.createdAt)).length,
    tenantThisMonth: tenantFollowups.filter((f) => inThisMonth(f.followupDate || f.createdAt)).length,
  };

  // ── Tab 7: Bill Report ──────────────────────────────────────────────────────
  const billAmount = (b) => {
    const v = Number(b.netAmount ?? b.billAmount ?? 0);
    return Number.isFinite(v) ? v : 0;
  };
  const propBills = arr(propBillsRes.data);
  const tenantBills = arr(tenantBillsRes.data);
  const propertyBillAmount = propBills.reduce((s, b) => s + billAmount(b), 0);
  const tenantBillAmount = tenantBills.reduce((s, b) => s + billAmount(b), 0);

  // billDate is the business date on the bill; createdAt covers older rows
  // saved before that field existed.
  const billThisMonth = (b) => inThisMonth(b.billDate || b.createdAt);
  const propBillsMonth = propBills.filter(billThisMonth);
  const tenantBillsMonth = tenantBills.filter(billThisMonth);
  const propertyBillAmountMonth = propBillsMonth.reduce((s, b) => s + billAmount(b), 0);
  const tenantBillAmountMonth = tenantBillsMonth.reduce((s, b) => s + billAmount(b), 0);

  const bills = {
    propertyBillCount: propBills.length,
    propertyBillAmount,
    tenantBillCount: tenantBills.length,
    tenantBillAmount,
    totalBillCount: propBills.length + tenantBills.length,
    totalBillAmount: propertyBillAmount + tenantBillAmount,
    propertyBillCountMonth: propBillsMonth.length,
    propertyBillAmountMonth,
    tenantBillCountMonth: tenantBillsMonth.length,
    tenantBillAmountMonth,
    totalBillCountMonth: propBillsMonth.length + tenantBillsMonth.length,
    totalBillAmountMonth: propertyBillAmountMonth + tenantBillAmountMonth,
  };

  const yesterday = moment().subtract(1, 'days').format('DD-MM-YYYY');
  // Label for the "this month" rows, e.g. "AUG 2026". Derived, so it rolls over
  // on its own — matches AdminReport.jsx's thisMonthLabel.
  const monthLabel = moment().format('MMM YYYY').toUpperCase();

  // Shaped exactly like the seven tabs, so the PDF renderer stays dumb.
  return {
    date: yesterday,
    generatedAt: new Date(),
    failures: [...failures],
    sections: [
      {
        title: "Yesterday's Actions",
        subtitle: `Action Summary — ${yesterday}`,
        columns: ['SL NO', 'DESCRIPTION', 'TOTAL ACTION'],
        rows: [
          [1, 'CONTACT VIEWED', actions.contactViewed],
          [2, 'FAVORITE LIST', actions.favoriteList],
          [3, 'PHOTO REQUEST', actions.photoRequest],
          [4, 'ADDRESS REQUESTS', actions.addressRequests],
          [5, 'OFFER RAISED', actions.offerRaised],
          [6, 'VIEWED PROPERTIES', actions.viewedProperties],
          [7, 'SEND INTEREST', actions.sendInterest],
          [8, 'CALLED LIST', actions.calledList],
        ],
      },
      {
        title: "Yesterday's Login",
        subtitle: `Login Summary — ${yesterday}`,
        columns: ['SL NO', 'DESCRIPTION', 'COUNT'],
        rows: [
          [1, 'TOTAL LOGIN', login.totalLogin],
          [2, 'REPORTED', login.reported],
          [3, 'UNREPORTED', login.unreported],
          { header: 'REPORTED BREAKDOWN' },
          [4, 'OWNER', login.owner],
          [5, 'TENANT', login.tenant],
          [6, 'VISITOR', login.visitor],
          { header: 'CONVERSION BREAKDOWN' },
          [7, 'PAID', login.conversionPaid],
          [8, 'FREE', login.conversionFree],
          [9, 'PENDING', login.conversionPending],
        ],
      },
      {
        title: "Yesterday's Property",
        subtitle: `Property & Tenant Management (Approved) — ${yesterday}`,
        columns: ['SL NO', 'DESCRIPTION', 'COUNT'],
        rows: [
          { header: 'PROPERTY' },
          [1, 'NO. OF PROPERTY CREATED', property.totalCreated],
          [2, 'FREE PROPERTY', property.freeProperty],
          [3, 'PAID PROPERTY', property.paidProperty],
          { header: 'TENANT' },
          [4, 'NO. OF TENANT ASSISTANCE CREATED', property.tenantTotal],
          [5, 'FREE TENANT ASSISTANCE', property.tenantFree],
          [6, 'PAID TENANT ASSISTANCE', property.tenantPaid],
        ],
      },
      {
        title: 'Property Status',
        subtitle: 'Property Status Summary (Total Count)',
        columns: ['SL NO', 'DESCRIPTION', 'TOTAL COUNT'],
        rows: [
          { header: 'PROPERTY' },
          [1, 'PRE-APPROVED', status.preApproved],
          [2, 'PENDING', status.pending],
          [3, 'DELETED', status.deleted],
          [4, 'EXPIRED', status.expired],
          { header: 'TENANT' },
          [5, 'PENDING TENANT ASSISTANCE', status.tenantPending],
          [6, 'DELETED TENANT ASSISTANCE', status.tenantDeleted],
          { header: 'LOGIN REPORT' },
          [7, 'UNREPORTED', status.totalUnreported],
          [8, 'CONVERSION PENDING', status.totalConversionPending],
        ],
      },
      {
        title: 'Payments',
        subtitle: 'Payment Management (Total Count)',
        columns: ['SL NO', 'DESCRIPTION', 'TOTAL COUNT'],
        rows: [
          { header: 'PROPERTY PAYMENT MANAGEMENT' },
          [1, 'PAY FAILED', payments.propPayFailed],
          [2, 'PAY NOW', payments.propPayNow],
          [3, 'PAY LATER', payments.propPayLater],
          { header: 'TENANT PAYMENT MANAGEMENT' },
          [4, 'PAY FAILED', payments.tenantPayFailed],
          [5, 'PAY NOW', payments.tenantPayNow],
          [6, 'PAY LATER', payments.tenantPayLater],
        ],
      },
      {
        title: 'Follow-ups',
        subtitle: `Follow-up Data (Total Count, and ${monthLabel} due)`,
        columns: ['SL NO', 'DESCRIPTION', 'TOTAL COUNT'],
        rows: [
          { header: 'PROPERTY' },
          [1, 'PROPERTY FOLLOW-UPS', followups.propertyFollowups],
          [2, `PROPERTY FOLLOW-UPS (${monthLabel})`, followups.propertyThisMonth],
          { header: 'TENANT' },
          [3, 'TENANT FOLLOW-UPS', followups.tenantFollowups],
          [4, `TENANT FOLLOW-UPS (${monthLabel})`, followups.tenantThisMonth],
          { total: [`TOTAL (${monthLabel})`, followups.propertyThisMonth + followups.tenantThisMonth] },
        ],
      },
      {
        title: 'Bill Report',
        subtitle: 'Bill Report (Total Count & Amount)',
        columns: ['SL NO', 'DESCRIPTION', 'BILL COUNT', 'TOTAL AMOUNT (Rs.)'],
        rows: [
          { header: 'PROPERTY' },
          [1, 'PROPERTY BILLS', bills.propertyBillCount, bills.propertyBillAmount.toLocaleString('en-IN')],
          { header: 'TENANT' },
          [2, 'TENANT BILLS', bills.tenantBillCount, bills.tenantBillAmount.toLocaleString('en-IN')],
          { total: ['GRAND TOTAL', bills.totalBillCount, bills.totalBillAmount.toLocaleString('en-IN')] },
          // Labels repeat the month because the e-mail body renders rows
          // without the section bands — "PROPERTY BILLS" twice with different
          // numbers and no separator would be unreadable there.
          { header: `THIS MONTH — ${monthLabel}` },
          [3, `PROPERTY BILLS (${monthLabel})`, bills.propertyBillCountMonth, bills.propertyBillAmountMonth.toLocaleString('en-IN')],
          [4, `TENANT BILLS (${monthLabel})`, bills.tenantBillCountMonth, bills.tenantBillAmountMonth.toLocaleString('en-IN')],
          { total: [`MONTH TOTAL (${monthLabel})`, bills.totalBillCountMonth, bills.totalBillAmountMonth.toLocaleString('en-IN')] },
        ],
      },
    ],
    raw: { actions, login, property, status, payments, followups, bills },
  };
}

module.exports = { fetchAdminReport, API_BASE };
