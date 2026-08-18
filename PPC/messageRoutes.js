import express from "express";
import axios from "axios";
import cron from "node-cron";
import moment from "moment";
import whatsapp from "./services/whatsapp.js";

const router = express.Router();

// ─── Recipients ───────────────────────────────────────────────────────────────

const RECIPIENTS = ["919944244409", "918220437673", "917094422941"];
const REPORT_RECIPIENT = ["917094422941", "919944244409", "918220437673"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Send a WhatsApp message via the SmartGrowth AI campaign API.
//
// ⚠ SmartGrowth is TEMPLATE-ONLY: the payload has no message body, so `message`
// is logged for the audit trail but the recipient receives the approved
// template. Give each flow its own approved template via
// SMARTGROWTH_REPORT_TEMPLATE_ID / SMARTGROWTH_NOTIFY_TEMPLATE_ID when you want
// different wording.
async function sendWhatsAppMessage(to, message, opts = {}) {
  return whatsapp.sendCampaign({
    phoneNumbers: [to],
    campaignName: opts.campaignName || "notify",
    templateId: opts.templateId || whatsapp.TEMPLATES.notify(),
  });
}

// ─── Scheduled WhatsApp Greeting Messages ────────────────────────────────────

const SCHEDULED_MESSAGES = [
  { cron: "0 8 * * *",  message: "Good morning one msg is working" },
  { cron: "0 12 * * *", message: "Good afternoon one msg is working" },
  { cron: "0 15 * * *", message: "Good evening one msg is working" },
  { cron: "0 20 * * *", message: "Good night one msg is working" },
];

function initScheduledMessages() {
  SCHEDULED_MESSAGES.forEach(({ cron: cronExpr, message }) => {
    cron.schedule(
      cronExpr,
      async () => {
        console.log(`[${new Date().toISOString()}] Sending: "${message}"`);
        const results = await Promise.allSettled(
          RECIPIENTS.map((number) => sendWhatsAppMessage(number, message))
        );
        results.forEach((result, i) => {
          if (result.status === "fulfilled") {
            console.log(`  Sent to ${RECIPIENTS[i]}`);
          } else {
            console.error(`  Failed to send to ${RECIPIENTS[i]}:`, result.reason?.message);
          }
        });
      },
      { timezone: "Asia/Kolkata" }
    );
  });
  console.log("Scheduled WhatsApp messages initialized (08:00, 12:00, 15:00, 20:00 IST)");
}

initScheduledMessages();

// ─── Daily Admin Report ──────────────────────────────────────────────────────

const BASE_URL = process.env.REACT_APP_API_URL || process.env.API_URL || "http://localhost:5005/PPC";

async function fetchAndSendDailyReport() {
  const yesterday = moment().subtract(1, "days");
  const yesterdayStart = yesterday.clone().startOf("day");
  const yesterdayEnd = yesterday.clone().endOf("day");
  const dateLabel = yesterday.format("DD-MM-YYYY");

  const isYesterday = (dateStr) => {
    if (!dateStr) return false;
    return moment(dateStr).isBetween(yesterdayStart, yesterdayEnd, undefined, "[]");
  };

  // Parallel fetch
  const [
    loginUsersRes, contactRes, favoriteRes, photoRes, addressRes,
    offersRes, viewedRes, interestRes, calledRes,
    approvedRes, freePlansRes, paidPlansRes,
    baActiveRes, baFreeRes, baPaidRes, allBuyerBillsRes, payuBuyerRes,
    preApprovedRes, allPropsRes, pendingRes, deletedRes, expiredRes,
    pendingBARes, allBARes,
    propPayFailedRes, propPayNowRes, propPayLaterRes,
    tenantPayFailedRes, tenantPayNowRes, tenantPayLaterRes,
    followupPropRes, followupTenantRes,
  ] = await Promise.all([
    axios.get(`${BASE_URL}/user/alls`),
    axios.get(`${BASE_URL}/get-all-contact-requests`),
    axios.get(`${BASE_URL}/get-all-favorite-requests`),
    axios.get(`${BASE_URL}/all-photo-requests`),
    axios.get(`${BASE_URL}/get-address-requests-all`),
    axios.get(`${BASE_URL}/all-offers`),
    axios.get(`${BASE_URL}/user-get-all-last-views`),
    axios.get(`${BASE_URL}/get-all-sendinterest`),
    axios.get(`${BASE_URL}/get-all-contact-sent-properties`),
    axios.get(`${BASE_URL}/fetch-active-users-datas-all-rent`),
    axios.get(`${BASE_URL}/fetch-all-free-plans`),
    axios.get(`${BASE_URL}/fetch-all-paid-plans`),
    axios.get(`${BASE_URL}/raActive-buyerAssistance-all-plans-rent`),
    axios.get(`${BASE_URL}/buyer-bills/free-with-assistance-rent`),
    axios.get(`${BASE_URL}/buyer-bills/non-free-with-assistance-rent`),
    axios.get(`${BASE_URL}/buyer-bills-rent`),
    axios.get(`${BASE_URL}/payments-with-plan/paid-buyer`),
    axios.get(`${BASE_URL}/properties/pre-approved-all-rent`),
    axios.get(`${BASE_URL}/fetch-alls-datas-all`),
    axios.get(`${BASE_URL}/properties/pending-rent`),
    axios.get(`${BASE_URL}/properties/deleted-rent`),
    axios.get(`${BASE_URL}/all-expired-properties`),
    axios.get(`${BASE_URL}/fetch-buyerAssistance-pending-rent`),
    axios.get(`${BASE_URL}/fetch-buyer-assistance-rent`),
    axios.get(`${BASE_URL}/payments/pay-failed`),
    axios.get(`${BASE_URL}/payments/pay-now`),
    axios.get(`${BASE_URL}/payments/pay-later`),
    axios.get(`${BASE_URL}/payments-with-plan/pay-failed-buyer`),
    axios.get(`${BASE_URL}/payments-with-plan/pay-now-buyer`),
    axios.get(`${BASE_URL}/payments-with-plan/pay-later-buyer`),
    axios.get(`${BASE_URL}/followup-list`),
    axios.get(`${BASE_URL}/followup-list-buyer`),
  ]);

  // Yesterday's Actions
  const contactData = contactRes.data.contactRequestsData || [];
  const favoriteData = favoriteRes.data.favoriteRequestsData || [];
  const photoData = Array.isArray(photoRes.data) ? photoRes.data : [];
  const addressData = addressRes.data.requests || [];
  const offersData = offersRes.data.offers || [];
  const viewedData = Array.isArray(viewedRes.data) ? viewedRes.data : [];
  const interestData = interestRes.data.interestRequestsData || [];
  const calledData = calledRes.data.success ? (calledRes.data.properties || []) : [];

  const contactCount = contactData.reduce((sum, i) => sum + (i.contactRequestedUserPhoneNumbers || []).filter(r => isYesterday(r.date)).length, 0);
  const favoriteCount = favoriteData.filter(i => isYesterday(i.updatedAt || i.createdAt)).length;
  const photoCount = photoData.filter(i => isYesterday(i.createdAt)).length;
  const addressCount = addressData.filter(i => isYesterday(i.createdAt)).length;
  const offerCount = offersData.filter(i => isYesterday(i.createdAt)).length;
  const viewedCount = viewedData.filter(i => isYesterday(i.createdAt || i.viewedAt)).length;
  const interestCount = interestData.filter(i => isYesterday(i.createdAt)).length;
  const calledCount = calledData.filter(i => isYesterday(i.contactedAt)).length;

  // Login Summary (deduplicated by phone)
  const allUsersRaw = loginUsersRes.data?.data && Array.isArray(loginUsersRes.data.data) ? loginUsersRes.data.data : [];
  const userMap = new Map();
  allUsersRaw.forEach((u) => {
    const phone = u.phone || "";
    if (!phone) return;
    const existing = userMap.get(phone);
    if (!existing) { userMap.set(phone, u); return; }
    const pri = (s) => (s === "verified" ? 2 : s === "pending" ? 1 : 0);
    if (pri(u.otpStatus) > pri(existing.otpStatus)) { userMap.set(phone, u); return; }
    if (pri(u.otpStatus) === pri(existing.otpStatus)) {
      const ed = existing.loginDate ? new Date(existing.loginDate) : null;
      const cd = u.loginDate ? new Date(u.loginDate) : null;
      if ((!ed && cd) || (ed && cd && cd > ed)) userMap.set(phone, u);
    }
  });
  const allUsers = Array.from(userMap.values());
  const totalUnreported = allUsers.filter(u => !["seller", "buyer", "visitor"].includes(u.remarks)).length;
  const totalConvPending = allUsers.filter(u => !u.conversionStatus || u.conversionStatus === "pending").length;
  const yesterdayUsers = allUsers.filter(u => isYesterday(u.loginDate));
  const reportedCount = yesterdayUsers.filter(u => ["seller", "buyer", "visitor"].includes(u.remarks)).length;
  const unreportedCount = yesterdayUsers.length - reportedCount;
  const ownerCount = yesterdayUsers.filter(u => u.remarks === "seller").length;
  const tenantLoginCount = yesterdayUsers.filter(u => u.remarks === "buyer").length;
  const visitorCount = yesterdayUsers.filter(u => u.remarks === "visitor").length;
  const convPaid = yesterdayUsers.filter(u => u.conversionStatus === "paid").length;
  const convFree = yesterdayUsers.filter(u => u.conversionStatus === "free").length;
  const convPending = yesterdayUsers.filter(u => !u.conversionStatus || u.conversionStatus === "pending").length;

  // Property (Approved) yesterday
  const approvedData = Array.isArray(approvedRes.data?.users) ? approvedRes.data.users : [];
  const freePlansData = Array.isArray(freePlansRes.data?.data) ? freePlansRes.data.data : [];
  const paidPlansData = Array.isArray(paidPlansRes.data?.data) ? paidPlansRes.data.data : [];
  const freeRentIds = new Set();
  freePlansData.forEach(item => {
    if (Array.isArray(item.properties)) {
      item.properties.forEach(p => { if (p.rentId) freeRentIds.add(p.rentId); });
    }
  });
  const paidRentIds = new Set();
  paidPlansData.forEach(item => {
    if (Array.isArray(item.properties)) {
      item.properties.forEach(p => { if (p.rentId) paidRentIds.add(p.rentId); });
    }
  });
  const yesterdayApproved = approvedData.filter(i => isYesterday(i.createdAt));
  const freeProps = yesterdayApproved.filter(i => freeRentIds.has(i.rentId) && !paidRentIds.has(i.rentId)).length;
  const paidProps = yesterdayApproved.filter(i => paidRentIds.has(i.rentId)).length;

  // Tenant Assistance yesterday
  const baActiveData = baActiveRes.data?.data || [];
  const baFreeIds = new Set((baFreeRes.data.data || []).map(i => i.buyerAssistance?.Ra_Id).filter(Boolean));
  const baPaidIds = new Set((baPaidRes.data.data || []).map(i => i.buyerAssistance?.Ra_Id).filter(Boolean));
  (payuBuyerRes.data.data || []).forEach(p => { if (p.Ra_Id) baPaidIds.add(p.Ra_Id); });
  (allBuyerBillsRes.data?.data || []).forEach(bill => {
    const raId = bill.Ra_Id;
    if (raId && !baFreeIds.has(raId) && !baPaidIds.has(raId)) {
      if (bill.paymentType?.toLowerCase() === "free") baFreeIds.add(raId);
      else baPaidIds.add(raId);
    }
  });
  const yesterdayBA = baActiveData.filter(i => {
    if (i.isDeleted) return false;
    return isYesterday(i.createdAt) || isYesterday(i.planDetails?.planCreatedAt) || isYesterday(i.updatedAt);
  });
  const baFreeCount = yesterdayBA.filter(i => baFreeIds.has(i.Ra_Id) && !baPaidIds.has(i.Ra_Id)).length;
  const baPaidCount = yesterdayBA.filter(i => baPaidIds.has(i.Ra_Id)).length;

  // Property Status (total counts)
  const preApprovedUsers = preApprovedRes.data.users || [];
  const allPropsData = allPropsRes.data.users || [];
  const expiredFromAll = allPropsData.filter(p => p.status === "expired");
  const mergedPre = new Map();
  preApprovedUsers.forEach(p => mergedPre.set(p.rentId, p));
  expiredFromAll.forEach(p => { if (!mergedPre.has(p.rentId)) mergedPre.set(p.rentId, p); });
  const pendingUsers = (pendingRes.data.users || []);
  const deletedUsers = (deletedRes.data.data || []).filter(p => p.status === "delete");
  const expiredPlans = expiredRes.data.expiredPlans || [];
  const pendingBAActive = (pendingBARes.data?.data || []).filter(i => !i.isDeleted);
  const deletedBA = (allBARes.data?.data || []).filter(i => i.isDeleted === true);

  // Payment Counts
  const propFailed = (propPayFailedRes.data.payments || propPayFailedRes.data.data || []).filter(p => p.payustatususer !== "paid").length;
  const propNow = (propPayNowRes.data.payments || propPayNowRes.data.data || []).filter(p => p.payustatususer !== "paid").length;
  const propLater = (propPayLaterRes.data.payments || propPayLaterRes.data.data || []).filter(p => p.payustatususer !== "paid").length;
  const tPayFailed = (tenantPayFailedRes.data.data || []).length;
  const tPayNow = (tenantPayNowRes.data.data || []).length;
  const tPayLater = (tenantPayLaterRes.data.data || []).length;

  // Follow-up Counts
  const propFollowups = (Array.isArray(followupPropRes.data?.data) ? followupPropRes.data.data : []).length;
  const tenantFollowups = (Array.isArray(followupTenantRes.data?.data) ? followupTenantRes.data.data : []).length;

  const messagePart1 = `*Rent Pondy Admin Report* (1/3)
Date: ${dateLabel}

*Yesterday's Action Summary*
1. Contact Viewed: ${contactCount}
2. Favorite List: ${favoriteCount}
3. Photo Request: ${photoCount}
4. Address Requests: ${addressCount}
5. Offer Raised: ${offerCount}
6. Viewed Properties: ${viewedCount}
7. Send Interest: ${interestCount}
8. Called List: ${calledCount}

*Yesterday's Login Summary*
Total Login: ${yesterdayUsers.length}
Reported: ${reportedCount}
Unreported: ${unreportedCount}
-- Reported Breakdown --
  Owner: ${ownerCount}
  Tenant: ${tenantLoginCount}
  Visitor: ${visitorCount}
-- Conversion Breakdown --
  Paid: ${convPaid}
  Free: ${convFree}
  Pending: ${convPending}`;

  const messagePart2 = `*Rent Pondy Admin Report* (2/3)
Date: ${dateLabel}

*Property & Tenant - Approved*
-- Property --
  Created: ${yesterdayApproved.length}
  Free: ${freeProps}
  Paid: ${paidProps}
-- Tenant --
  Created: ${yesterdayBA.length}
  Free: ${baFreeCount}
  Paid: ${baPaidCount}

*Property Status (Total)*
-- Property --
  Pre-Approved: ${mergedPre.size}
  Pending: ${pendingUsers.length}
  Deleted: ${deletedUsers.length}
  Expired: ${expiredPlans.length}
-- Tenant --
  Pending: ${pendingBAActive.length}
  Deleted: ${deletedBA.length}
-- Login Report --
  Unreported: ${totalUnreported}
  Conversion Pending: ${totalConvPending}`;

  const messagePart3 = `*Rent Pondy Admin Report* (3/3)
Date: ${dateLabel}

*Payment Management (Total)*
-- Property --
  Pay Failed: ${propFailed}
  Pay Now: ${propNow}
  Pay Later: ${propLater}
-- Tenant --
  Pay Failed: ${tPayFailed}
  Pay Now: ${tPayNow}
  Pay Later: ${tPayLater}

*Follow-up Data (Total)*
  Property Follow-ups: ${propFollowups}
  Tenant Follow-ups: ${tenantFollowups}`;

  const messageParts = [messagePart1, messagePart2, messagePart3];

  // Random gap between parts: 15-45 seconds
  const getReportPartDelay = () =>
    Math.floor(Math.random() * (45000 - 15000 + 1)) + 15000;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Send to all report recipients
  const recipients = Array.isArray(REPORT_RECIPIENT) ? REPORT_RECIPIENT : [REPORT_RECIPIENT];
  for (const number of recipients) {
    for (let i = 0; i < messageParts.length; i++) {
      try {
        await sendWhatsAppMessage(number, messageParts[i], {
          campaignName: "adminreport",
          templateId: whatsapp.TEMPLATES.report(),
        });
        console.log(`[${new Date().toISOString()}] Report part ${i + 1}/${messageParts.length} sent to ${number}`);
      } catch (sendErr) {
        console.error(`[${new Date().toISOString()}] Failed to send part ${i + 1} to ${number}:`, sendErr.message);
      }
      if (i < messageParts.length - 1) {
        const delay = getReportPartDelay();
        console.log(`[${new Date().toISOString()}] Waiting ${Math.round(delay / 1000)}s before next part...`);
        await sleep(delay);
      }
    }
  }
}

// Schedule daily at 8:00 AM IST
cron.schedule("0 8 * * *", async () => {
  console.log(`[${new Date().toISOString()}] Cron triggered - sending daily report...`);
  try {
    await fetchAndSendDailyReport();
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Cron report error:`, err.message);
    if (err.response) console.error("Response status:", err.response.status);
    if (err.code) console.error("Error code:", err.code);
  }
}, { timezone: "Asia/Kolkata" });

console.log("Daily Admin Report scheduled at 8:00 AM IST -> " + REPORT_RECIPIENT);
console.log("API BASE_URL =", BASE_URL);

// ─── Routes ──────────────────────────────────────────────────────────────────

// Send yesterday's report: curl http://localhost:5005/PPC/rent-yesterday-report
router.get("/rent-yesterday-report", async (req, res) => {
  try {
    console.log("rent-yesterday-report triggered...");
    await fetchAndSendDailyReport();
    res.json({ success: true, message: "Report sent to " + REPORT_RECIPIENT });
  } catch (err) {
    console.error("rent-yesterday-report failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Send message to individual
router.post("/send-message", async (req, res) => {
  try {
    const { to, message, campaignName, templateId } = req.body;
    const result = await sendWhatsAppMessage(to, message, { campaignName, templateId });
    res.json(result);
  } catch (err) {
    res.status(500).json(err.response?.data || { error: err.message });
  }
});

// ─── WhatsApp Message Queue System (v2 — Template Based) ────────────────────
//
// Flow: User Action → POST /queue-message { to, category, data }
//       → Store in queue (FIFO, no priority)
//       → Cron drains queue ONE message at a time
//       → Random delay 30-200s between each send
//       → Pick random template for that category
//       → Fill variables → Send via the SmartGrowth AI campaign API
//
// NOTE: the composed text below is now audit-log only. SmartGrowth delivers an
// approved template, so the wording a recipient sees comes from
// SMARTGROWTH_NOTIFY_TEMPLATE_ID, not from these strings.
//
// The existing POST /send-message route is NOT changed.
// ─────────────────────────────────────────────────────────────────────────────

// --- Queue Storage ---
const messageQueue = [];  // { id, to, category, data, addedAt, retries }
const sentLog = [];       // { to, category, sentAt }
let isQueueProcessing = false;
let queueTimer = null;

// --- Config ---
const QUEUE_CONFIG = {
  DELAY_MIN: 30000,       // 30 seconds minimum
  DELAY_MAX: 200000,      // 200 seconds maximum
  MAX_PER_HOUR: 30,       // Global hourly cap
  MAX_PER_NUMBER_PER_HOUR: 3,
  MAX_RETRIES: 3,
  DEDUP_WINDOW_MS: 5 * 60 * 1000,  // 5 min
};

function getRandomDelay() {
  return Math.floor(Math.random() * (QUEUE_CONFIG.DELAY_MAX - QUEUE_CONFIG.DELAY_MIN + 1)) + QUEUE_CONFIG.DELAY_MIN;
}

// --- Sent Log Helpers ---

function trimSentLog() {
  const cutoff = Date.now() - 60 * 60 * 1000;
  while (sentLog.length > 0 && sentLog[0].sentAt < cutoff) sentLog.shift();
}

function canSendTo(to) {
  trimSentLog();
  const cutoff = Date.now() - 60 * 60 * 1000;
  const recent = sentLog.filter(e => e.sentAt > cutoff);
  if (recent.length >= QUEUE_CONFIG.MAX_PER_HOUR) return false;
  if (recent.filter(e => e.to === to).length >= QUEUE_CONFIG.MAX_PER_NUMBER_PER_HOUR) return false;
  return true;
}

function isDuplicate(to, category) {
  const cutoff = Date.now() - QUEUE_CONFIG.DEDUP_WINDOW_MS;
  return sentLog.some(e => e.to === to && e.category === category && e.sentAt > cutoff);
}

// ─── Message Template Components ────────────────────────────────────────────
// Greetings, closings, and body templates are randomly combined.
// This produces thousands of unique message combinations per category.

const GREETINGS = [
  (name) => `Hi ${name} 👋`,
  (name) => `Hello ${name}!`,
  (name) => `Hey ${name},`,
  (name) => `Dear ${name},`,
  (name) => `Hi there ${name}!`,
  (name) => `Good day ${name} 👋`,
  (name) => `Greetings ${name}!`,
  (name) => `Hi ${name}, hope you're doing well!`,
  (name) => `Hello there ${name}!`,
  (name) => `${name}, good to connect with you!`,
  (name) => `Hey there ${name} 👋`,
  (name) => `Hi ${name}, here's an update!`,
];

const CLOSINGS = [
  "Thank you for using Rent Pondy 🙏",
  "Warm regards,\n– Team Rent Pondy",
  "Best wishes,\nRent Pondy Team",
  "Thanks for choosing Rent Pondy!",
  "Happy house hunting! 🏡\n– Rent Pondy",
  "We're here to help!\n– Rent Pondy Team",
  "Best regards,\nTeam Rent Pondy 🙏",
  "Thank you for trusting Rent Pondy!",
  "Cheers,\n– Your Rent Pondy Team",
  "Stay connected with Rent Pondy! 🏠",
  "Regards,\n– Rent Pondy Support",
  "Thanks & regards,\nRent Pondy 🙏",
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function v(val, fallback = "N/A") {
  return val && String(val).trim() !== "" ? val : fallback;
}

// ─── Body Templates Per Category ────────────────────────────────────────────
// Each category has 10-15 body variations. {data} object is passed in.

const BODY_TEMPLATES = {

  // ── Interest ──────────────────────────────────────────────
  "interest-owner": [
    (d) => `⭐ A user has shown interest in your property on Rent Pondy!\n\n📋 Property Details:\n🆔 Rent ID: ${v(d.rentId)}\n👤 User: ${v(d.userName)}\n📞 Phone: ${v(d.userPhone)}\n📍 Location: ${v(d.location)}\n\nThey'd like to know more about your listing.`,
    (d) => `Great news! Someone is interested in your property.\n\n🆔 Rent ID: ${v(d.rentId)}\n📍 ${v(d.location)}\n👤 Interested User: ${v(d.userName)}\n📞 Reach them: ${v(d.userPhone)}\n\nPlease connect with them soon.`,
    (d) => `🎉 Your property has caught someone's eye!\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nUser: ${v(d.userName)} (${v(d.userPhone)})\n\nGet in touch to discuss the details.`,
    (d) => `A potential tenant wants to connect with you!\n\n🆔 ${v(d.rentId)}\n📍 ${v(d.location)}\n👤 ${v(d.userName)}\n📞 ${v(d.userPhone)}\n\nConsider reaching out at your earliest.`,
    (d) => `Someone showed interest in your listing at ${v(d.location)}.\n\nRent ID: ${v(d.rentId)}\nContact: ${v(d.userName)} — ${v(d.userPhone)}\n\nDon't miss this lead!`,
    (d) => `📢 New interest alert!\n\nYour property (${v(d.rentId)}) at ${v(d.location)} has a new interested user.\nName: ${v(d.userName)}\nPhone: ${v(d.userPhone)}`,
    (d) => `A user from Rent Pondy is interested in your property.\n\n🆔 Rent ID: ${v(d.rentId)}\n📍 Area: ${v(d.location)}\n👤 Name: ${v(d.userName)}\n📞 Contact: ${v(d.userPhone)}\n\nYou may want to follow up.`,
    (d) => `New inquiry for your property!\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nFrom: ${v(d.userName)}\nPhone: ${v(d.userPhone)}\n\nPlease respond when convenient.`,
    (d) => `✨ Your listing has a new lead!\n\n${v(d.userName)} is interested in Rent ID ${v(d.rentId)} at ${v(d.location)}.\n📞 ${v(d.userPhone)}\n\nReach out and close the deal.`,
    (d) => `🏠 Interest received!\n\nProperty: ${v(d.rentId)}\nArea: ${v(d.location)}\nInterested person: ${v(d.userName)}\nPhone: ${v(d.userPhone)}`,
    (d) => `You've got a new interest on your property at ${v(d.location)}!\n\nRent ID: ${v(d.rentId)}\n${v(d.userName)} — ${v(d.userPhone)}\n\nFeel free to connect.`,
    (d) => `Hey! A user just expressed interest in your property.\n\nID: ${v(d.rentId)} | Location: ${v(d.location)}\nUser: ${v(d.userName)} | Phone: ${v(d.userPhone)}`,
  ],

  "interest-user": [
    (d) => `✅ Your interest has been sent to the property owner!\n\n🆔 Rent ID: ${v(d.rentId)}\n📍 Location: ${v(d.location)}\n👨‍💼 Owner: ${v(d.ownerName)}\n📞 Phone: ${v(d.ownerPhone)}\n\nThe owner will be notified shortly.`,
    (d) => `Your interest was submitted successfully.\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nOwner: ${v(d.ownerName)} (${v(d.ownerPhone)})\n\nSit tight — the owner will get back to you.`,
    (d) => `🎉 Done! We've sent your interest to the owner.\n\n📋 ${v(d.rentId)} at ${v(d.location)}\n👨‍💼 ${v(d.ownerName)} — ${v(d.ownerPhone)}\n\nExpect a response soon.`,
    (d) => `Interest sent!\n\nProperty: ${v(d.rentId)}\nArea: ${v(d.location)}\nOwner: ${v(d.ownerName)}\nContact: ${v(d.ownerPhone)}\n\nWe've notified the owner on your behalf.`,
    (d) => `Your request has been forwarded to ${v(d.ownerName)}.\n\nRent ID: ${v(d.rentId)}\n📍 ${v(d.location)}\n📞 ${v(d.ownerPhone)}\n\nThey'll reach out shortly.`,
    (d) => `✅ We notified the owner about your interest.\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nOwner: ${v(d.ownerName)}\nPhone: ${v(d.ownerPhone)}`,
    (d) => `All set! Your interest in ${v(d.rentId)} at ${v(d.location)} was shared with ${v(d.ownerName)}.\n\n📞 ${v(d.ownerPhone)}`,
    (d) => `Your interest is on its way to the owner.\n\n🆔 ${v(d.rentId)}\n📍 ${v(d.location)}\n👨‍💼 ${v(d.ownerName)}\n📞 ${v(d.ownerPhone)}\n\nWe'll keep you posted.`,
    (d) => `We've shared your interest with the property owner.\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nOwner details: ${v(d.ownerName)} — ${v(d.ownerPhone)}`,
    (d) => `Successfully submitted!\n\nYour interest for property ${v(d.rentId)} at ${v(d.location)} was sent to ${v(d.ownerName)} (${v(d.ownerPhone)}).`,
    (d) => `📤 Interest delivered!\n\nRent ID: ${v(d.rentId)} | ${v(d.location)}\nOwner: ${v(d.ownerName)} | ${v(d.ownerPhone)}\n\nHope you find your perfect home!`,
    (d) => `Great choice! We've told ${v(d.ownerName)} about your interest.\n\nProperty: ${v(d.rentId)} at ${v(d.location)}\nReach out: ${v(d.ownerPhone)}`,
  ],

  // ── Contact Request ───────────────────────────────────────
  "contact-owner": [
    (d) => `👤 Someone viewed your contact details!\n\n🆔 Rent ID: ${v(d.rentId)}\n👤 User: ${v(d.userName)}\n📞 Phone: ${v(d.userPhone)}\n\nThey may call you about your property.`,
    (d) => `A user has accessed your contact info on Rent Pondy.\n\nRent ID: ${v(d.rentId)}\nUser: ${v(d.userName)} — ${v(d.userPhone)}\n\nBe ready for a call!`,
    (d) => `📞 Contact viewed!\n\nYour phone number was viewed by ${v(d.userName)} (${v(d.userPhone)}) for property ${v(d.rentId)}.`,
    (d) => `A user looked up your contact for property ${v(d.rentId)}.\n\nName: ${v(d.userName)}\nPhone: ${v(d.userPhone)}\n\nExpect an inquiry soon.`,
    (d) => `${v(d.userName)} viewed your contact for Rent ID ${v(d.rentId)}.\n📞 Their number: ${v(d.userPhone)}\n\nThey're interested in connecting.`,
    (d) => `Someone wants to reach you about your property!\n\nRent ID: ${v(d.rentId)}\nViewer: ${v(d.userName)}\nPhone: ${v(d.userPhone)}`,
    (d) => `Your contact was shared with ${v(d.userName)} for listing ${v(d.rentId)}.\n📞 ${v(d.userPhone)}\n\nYou might get a call shortly.`,
    (d) => `📋 Contact access alert!\n\nProperty: ${v(d.rentId)}\nAccessed by: ${v(d.userName)}\nTheir phone: ${v(d.userPhone)}`,
    (d) => `A potential tenant just viewed your number.\n\n🆔 ${v(d.rentId)}\n👤 ${v(d.userName)} — ${v(d.userPhone)}`,
    (d) => `Heads up! ${v(d.userName)} checked your contact for property ${v(d.rentId)}.\nReach them: ${v(d.userPhone)}`,
    (d) => `New contact view on your listing ${v(d.rentId)}!\n\n${v(d.userName)} (${v(d.userPhone)}) is looking to connect with you.`,
    (d) => `Your contact details were viewed.\n\nRent ID: ${v(d.rentId)}\nBy: ${v(d.userName)}\nPhone: ${v(d.userPhone)}\n\nThey seem interested!`,
  ],

  "contact-user": [
    (d) => `✅ You've viewed the owner's contact!\n\n🆔 Rent ID: ${v(d.rentId)}\n👨‍💼 Owner: ${v(d.ownerName)}\n📞 Phone: ${v(d.ownerPhone)}\n\nFeel free to reach out directly.`,
    (d) => `Owner's contact details:\n\nRent ID: ${v(d.rentId)}\nOwner: ${v(d.ownerName)}\nPhone: ${v(d.ownerPhone)}\n\nYou can now call or message them.`,
    (d) => `📞 Contact unlocked!\n\n${v(d.ownerName)} — ${v(d.ownerPhone)}\nProperty: ${v(d.rentId)}\n\nConnect with the owner anytime.`,
    (d) => `Here's the owner's info:\n\n🆔 ${v(d.rentId)}\n👨‍💼 ${v(d.ownerName)}\n📞 ${v(d.ownerPhone)}\n\nGood luck with your search!`,
    (d) => `You now have the owner's details for property ${v(d.rentId)}.\n\n${v(d.ownerName)} — ${v(d.ownerPhone)}\n\nReach out when ready.`,
    (d) => `Contact retrieved!\n\nOwner: ${v(d.ownerName)}\nPhone: ${v(d.ownerPhone)}\nRent ID: ${v(d.rentId)}\n\nHope it works out!`,
    (d) => `✅ Owner info shared.\n\n${v(d.ownerName)} (${v(d.ownerPhone)})\nProperty ${v(d.rentId)}\n\nFeel free to connect.`,
    (d) => `Successfully viewed!\n\nRent ID: ${v(d.rentId)}\nOwner: ${v(d.ownerName)}\n📞 ${v(d.ownerPhone)}\n\nDon't hesitate to call.`,
    (d) => `You've unlocked ${v(d.ownerName)}'s contact for ${v(d.rentId)}.\n📞 ${v(d.ownerPhone)}\n\nAll the best!`,
    (d) => `Here's who to call:\n\n${v(d.ownerName)} — ${v(d.ownerPhone)}\nFor property: ${v(d.rentId)}`,
    (d) => `Contact details ready!\n\n👨‍💼 ${v(d.ownerName)}\n📞 ${v(d.ownerPhone)}\n🆔 ${v(d.rentId)}`,
    (d) => `The owner's number is now available to you.\n\n${v(d.ownerName)}: ${v(d.ownerPhone)}\nProperty: ${v(d.rentId)}\n\nGo ahead and connect.`,
  ],

  // ── Address Request ───────────────────────────────────────
  "address-owner": [
    (d) => `📍 A user has requested your property address!\n\n🆔 Rent ID: ${v(d.rentId)}\n📍 ${v(d.location)}\n👤 ${v(d.userName)}\n📞 ${v(d.userPhone)}\n\nPlease share the address at your convenience.`,
    (d) => `Someone wants to visit your property at ${v(d.location)}.\n\nRent ID: ${v(d.rentId)}\nRequested by: ${v(d.userName)} (${v(d.userPhone)})\n\nKindly share the full address.`,
    (d) => `Address request received!\n\n🆔 ${v(d.rentId)} | ${v(d.location)}\nFrom: ${v(d.userName)} — ${v(d.userPhone)}\n\nThey'd like to visit your property.`,
    (d) => `A user wants the complete address of your property.\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nUser: ${v(d.userName)}\nPhone: ${v(d.userPhone)}`,
    (d) => `${v(d.userName)} requested the address for your property ${v(d.rentId)} at ${v(d.location)}.\n📞 ${v(d.userPhone)}\n\nPlease respond when possible.`,
    (d) => `📬 New address request!\n\nProperty: ${v(d.rentId)}\nArea: ${v(d.location)}\nRequester: ${v(d.userName)} (${v(d.userPhone)})`,
    (d) => `A potential tenant needs your property address.\n\n${v(d.rentId)} at ${v(d.location)}\nContact: ${v(d.userName)} — ${v(d.userPhone)}`,
    (d) => `Someone is interested in visiting your property!\n\nRent ID: ${v(d.rentId)}\n${v(d.location)}\n${v(d.userName)} — ${v(d.userPhone)}`,
    (d) => `🏠 Address requested for ${v(d.rentId)}!\n\nBy: ${v(d.userName)}\nPhone: ${v(d.userPhone)}\nArea: ${v(d.location)}`,
    (d) => `Please share your property address with ${v(d.userName)}.\n\nRent ID: ${v(d.rentId)} | ${v(d.location)}\nTheir number: ${v(d.userPhone)}`,
    (d) => `Hey! ${v(d.userName)} wants to know where your property (${v(d.rentId)}) is located.\n📞 ${v(d.userPhone)}`,
    (d) => `A user is looking for directions to your listing at ${v(d.location)}.\n\n${v(d.rentId)} — ${v(d.userName)} (${v(d.userPhone)})`,
  ],

  "address-user": [
    (d) => `✅ Your address request has been sent to the owner!\n\n🆔 Rent ID: ${v(d.rentId)}\n👨‍💼 Owner: ${v(d.ownerName)}\n📞 Phone: ${v(d.ownerPhone)}\n📍 ${v(d.location)}\n\nThe owner will share the address soon.`,
    (d) => `Address request submitted!\n\nRent ID: ${v(d.rentId)}\nOwner: ${v(d.ownerName)} (${v(d.ownerPhone)})\nLocation: ${v(d.location)}\n\nExpect a response shortly.`,
    (d) => `We've asked ${v(d.ownerName)} to share the address for ${v(d.rentId)}.\n📞 ${v(d.ownerPhone)}\n📍 ${v(d.location)}`,
    (d) => `Your request is on its way!\n\n🆔 ${v(d.rentId)} at ${v(d.location)}\n👨‍💼 ${v(d.ownerName)} — ${v(d.ownerPhone)}\n\nThe owner will respond soon.`,
    (d) => `📍 Address request sent!\n\nProperty: ${v(d.rentId)}\nArea: ${v(d.location)}\nOwner: ${v(d.ownerName)}\nPhone: ${v(d.ownerPhone)}`,
    (d) => `Done! We've forwarded your address request to ${v(d.ownerName)}.\n\nRent ID: ${v(d.rentId)} | ${v(d.location)}\n📞 ${v(d.ownerPhone)}`,
    (d) => `The owner has been notified about your address request.\n\n${v(d.rentId)} at ${v(d.location)}\n${v(d.ownerName)} — ${v(d.ownerPhone)}`,
    (d) => `Sit tight! ${v(d.ownerName)} will share the property address.\n\nRent ID: ${v(d.rentId)}\n📍 ${v(d.location)}\n📞 ${v(d.ownerPhone)}`,
    (d) => `Request sent to ${v(d.ownerName)} for property ${v(d.rentId)}.\nArea: ${v(d.location)}\nCall: ${v(d.ownerPhone)}`,
    (d) => `📤 Submitted! Your address request for ${v(d.rentId)} (${v(d.location)}) was forwarded to the owner.`,
    (d) => `We told ${v(d.ownerName)} you'd like the address.\n\n${v(d.rentId)} | ${v(d.location)} | ${v(d.ownerPhone)}`,
    (d) => `Address request delivered!\n\nOwner: ${v(d.ownerName)}\nProperty: ${v(d.rentId)}\nLocation: ${v(d.location)}\nPhone: ${v(d.ownerPhone)}`,
  ],

  // ── Call Notification ─────────────────────────────────────
  "call-owner": [
    (d) => `📞 A user is trying to reach you about your property!\n\n🆔 Rent ID: ${v(d.rentId)}\n👤 ${v(d.userName)}\n📞 ${v(d.userPhone)}\n📍 ${v(d.location)}\n\nPlease be available to take the call.`,
    (d) => `Incoming call alert!\n\n${v(d.userName)} (${v(d.userPhone)}) wants to talk about property ${v(d.rentId)} at ${v(d.location)}.`,
    (d) => `A user is calling you from Rent Pondy.\n\nRent ID: ${v(d.rentId)}\nCaller: ${v(d.userName)} — ${v(d.userPhone)}\nArea: ${v(d.location)}`,
    (d) => `${v(d.userName)} is reaching out about your listing!\n\n🆔 ${v(d.rentId)}\n📍 ${v(d.location)}\n📞 ${v(d.userPhone)}`,
    (d) => `📱 Call incoming!\n\nProperty: ${v(d.rentId)} at ${v(d.location)}\nCaller: ${v(d.userName)}\nPhone: ${v(d.userPhone)}`,
    (d) => `Heads up — ${v(d.userName)} wants to call you about ${v(d.rentId)}.\n📞 ${v(d.userPhone)}\n📍 ${v(d.location)}`,
    (d) => `A potential tenant is trying to connect with you via call.\n\n${v(d.rentId)} | ${v(d.location)}\n${v(d.userName)} — ${v(d.userPhone)}`,
    (d) => `🔔 Call alert for property ${v(d.rentId)}!\n\nFrom: ${v(d.userName)}\nPhone: ${v(d.userPhone)}\nLocation: ${v(d.location)}`,
    (d) => `Someone wants to discuss your property at ${v(d.location)}.\n\nRent ID: ${v(d.rentId)}\n${v(d.userName)} (${v(d.userPhone)})`,
    (d) => `Be ready for a call from ${v(d.userName)}!\n\nProperty: ${v(d.rentId)}\nArea: ${v(d.location)}\nPhone: ${v(d.userPhone)}`,
    (d) => `A user wants to speak with you.\n\n📋 ${v(d.rentId)} at ${v(d.location)}\n👤 ${v(d.userName)}\n📞 ${v(d.userPhone)}`,
    (d) => `Call notification!\n\n${v(d.userName)} is calling about your listing.\nRent ID: ${v(d.rentId)} | ${v(d.location)}\n📞 ${v(d.userPhone)}`,
  ],

  "call-user": [
    (d) => `📞 You're connecting with the property owner!\n\n🆔 Rent ID: ${v(d.rentId)}\n👨‍💼 Owner: ${v(d.ownerName)}\n📞 ${v(d.ownerPhone)}\n📍 ${v(d.location)}\n\nHave a great conversation!`,
    (d) => `Calling the owner!\n\n${v(d.ownerName)} — ${v(d.ownerPhone)}\nProperty: ${v(d.rentId)} at ${v(d.location)}\n\nGood luck!`,
    (d) => `You're about to connect with ${v(d.ownerName)} for property ${v(d.rentId)}.\n📞 ${v(d.ownerPhone)}\n📍 ${v(d.location)}`,
    (d) => `Here's the owner's number:\n\n${v(d.ownerName)} — ${v(d.ownerPhone)}\nRent ID: ${v(d.rentId)}\nArea: ${v(d.location)}`,
    (d) => `📱 Call initiated!\n\nOwner: ${v(d.ownerName)}\nPhone: ${v(d.ownerPhone)}\nProperty: ${v(d.rentId)} | ${v(d.location)}`,
    (d) => `You're connecting with the owner of ${v(d.rentId)} at ${v(d.location)}.\n\n${v(d.ownerName)} — ${v(d.ownerPhone)}`,
    (d) => `Calling ${v(d.ownerName)} about property ${v(d.rentId)}.\n📞 ${v(d.ownerPhone)}\n📍 ${v(d.location)}`,
    (d) => `Get ready to discuss the property!\n\n${v(d.ownerName)} (${v(d.ownerPhone)})\n${v(d.rentId)} at ${v(d.location)}`,
    (d) => `Owner details for your call:\n\n${v(d.ownerName)}: ${v(d.ownerPhone)}\nRent ID: ${v(d.rentId)}\n${v(d.location)}`,
    (d) => `You're calling the owner.\n\n👨‍💼 ${v(d.ownerName)} — ${v(d.ownerPhone)}\n🆔 ${v(d.rentId)}\n📍 ${v(d.location)}`,
    (d) => `✅ Call logged!\n\nProperty: ${v(d.rentId)}\nOwner: ${v(d.ownerName)}\nPhone: ${v(d.ownerPhone)}\nLocation: ${v(d.location)}`,
    (d) => `Connecting you with ${v(d.ownerName)} for listing ${v(d.rentId)} at ${v(d.location)}.\n📞 ${v(d.ownerPhone)}`,
  ],

  // ── Photo Request ─────────────────────────────────────────
  "photo-request-owner": [
    (d) => `📸 A user has requested photos of your property!\n\n🆔 Rent ID: ${v(d.rentId)}\n👤 Requested by: ${v(d.userName, "A User")}\n📞 ${v(d.userPhone)}\n\nPlease upload updated photos in the app.`,
    (d) => `Photos needed!\n\n${v(d.userName, "A user")} wants to see photos of your property ${v(d.rentId)}.\n📞 ${v(d.userPhone)}\n\nUpload them when convenient.`,
    (d) => `A user wants photos for property ${v(d.rentId)}.\n\nRequester: ${v(d.userName, "User")} — ${v(d.userPhone)}\n\nKindly add photos to your listing.`,
    (d) => `📷 Photo request!\n\nRent ID: ${v(d.rentId)}\nFrom: ${v(d.userName, "A user")} (${v(d.userPhone)})\n\nPlease upload property images.`,
    (d) => `${v(d.userName, "Someone")} requested photos for ${v(d.rentId)}.\n📞 ${v(d.userPhone)}\n\nAdd photos to attract more tenants!`,
    (d) => `Your property listing needs photos!\n\n${v(d.userName, "A user")} asked for images of ${v(d.rentId)}.\nContact: ${v(d.userPhone)}`,
    (d) => `Photo request received for your property.\n\nRent ID: ${v(d.rentId)}\nBy: ${v(d.userName, "A user")}\nPhone: ${v(d.userPhone)}`,
    (d) => `A user would like to see your property photos.\n\n${v(d.rentId)} — Requester: ${v(d.userName, "User")} (${v(d.userPhone)})`,
    (d) => `📸 New photo request!\n\nProperty: ${v(d.rentId)}\nFrom: ${v(d.userName, "User")}\nPhone: ${v(d.userPhone)}\n\nUpload photos to increase visibility.`,
    (d) => `Someone wants to see your property before visiting.\n\nRent ID: ${v(d.rentId)}\n${v(d.userName, "User")} — ${v(d.userPhone)}`,
    (d) => `Please share property photos!\n\n${v(d.userName, "A user")} made a photo request for ${v(d.rentId)}.\n📞 ${v(d.userPhone)}`,
    (d) => `📷 Upload request for ${v(d.rentId)}.\n\nA user (${v(d.userPhone)}) wants to see property images.`,
  ],

  "photo-request-user": [
    (d) => `✅ Your photo request has been sent!\n\n🆔 Rent ID: ${v(d.rentId)}\n📍 Property: ${v(d.location)}\n👨‍💼 Owner: ${v(d.ownerName)}\n\nWe've notified the owner.`,
    (d) => `Photo request submitted!\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nOwner: ${v(d.ownerName)}\n\nPhotos will be uploaded soon.`,
    (d) => `📸 Done! The owner of ${v(d.rentId)} has been asked for photos.\n\n${v(d.ownerName)} at ${v(d.location)}`,
    (d) => `We've forwarded your photo request to ${v(d.ownerName)}.\n\nProperty: ${v(d.rentId)}\nArea: ${v(d.location)}`,
    (d) => `Request sent!\n\n🆔 ${v(d.rentId)}\n📍 ${v(d.location)}\n👨‍💼 ${v(d.ownerName)}\n\nYou'll be able to see photos soon.`,
    (d) => `Photo request delivered!\n\nRent ID: ${v(d.rentId)} | ${v(d.location)}\nOwner: ${v(d.ownerName)}`,
    (d) => `The owner has been notified to upload photos.\n\n${v(d.rentId)} at ${v(d.location)}\nOwner: ${v(d.ownerName)}`,
    (d) => `📸 Request submitted! ${v(d.ownerName)} will upload photos for ${v(d.rentId)}.\n\n📍 ${v(d.location)}`,
    (d) => `Your photo request for property ${v(d.rentId)} (${v(d.location)}) was sent to ${v(d.ownerName)}.`,
    (d) => `All set! We asked the owner for property photos.\n\n${v(d.rentId)} | ${v(d.location)} | ${v(d.ownerName)}`,
    (d) => `✅ Photo request queued!\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nOwner: ${v(d.ownerName)}`,
    (d) => `We told ${v(d.ownerName)} you'd like photos of ${v(d.rentId)} at ${v(d.location)}.`,
  ],

  // ── Favorite ──────────────────────────────────────────────
  "favorite-owner": [
    (d) => `❤️ A user has favorited your property!\n\n🆔 Rent ID: ${v(d.rentId)}\n📍 ${v(d.location)}\n👤 User: ${v(d.userName, "A user")}\n📞 ${v(d.userPhone)}\n\nYour property is gaining traction!`,
    (d) => `Someone shortlisted your property ${v(d.rentId)}!\n\nLocation: ${v(d.location)}\nUser: ${v(d.userName, "A user")} — ${v(d.userPhone)}`,
    (d) => `Your listing got favorited!\n\n🆔 ${v(d.rentId)} at ${v(d.location)}\n👤 ${v(d.userName, "User")} (${v(d.userPhone)})`,
    (d) => `❤️ New favorite on your property!\n\nRent ID: ${v(d.rentId)}\nArea: ${v(d.location)}\nBy: ${v(d.userName, "A user")}\nPhone: ${v(d.userPhone)}`,
    (d) => `${v(d.userName, "A user")} saved your property to favorites.\n\n${v(d.rentId)} | ${v(d.location)}\n📞 ${v(d.userPhone)}`,
    (d) => `Great! Your property is being noticed.\n\nRent ID: ${v(d.rentId)}\n${v(d.userName, "User")} favorited it.\n📞 ${v(d.userPhone)}`,
    (d) => `A user added your listing to their favorites.\n\n${v(d.rentId)} at ${v(d.location)}\nContact: ${v(d.userPhone)}`,
    (d) => `🌟 Property favorited!\n\n${v(d.rentId)} | ${v(d.location)}\nBy: ${v(d.userName, "A user")} — ${v(d.userPhone)}`,
    (d) => `Someone likes your property!\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nPhone: ${v(d.userPhone)}`,
    (d) => `Your property ${v(d.rentId)} was just favorited by ${v(d.userName, "a user")}.\n📞 ${v(d.userPhone)}`,
    (d) => `❤️ ${v(d.userName, "A user")} shortlisted your property.\n\n${v(d.rentId)} at ${v(d.location)}\nCall them: ${v(d.userPhone)}`,
    (d) => `Favorite alert! ${v(d.rentId)} at ${v(d.location)} was saved.\nUser: ${v(d.userPhone)}`,
  ],

  "favorite-user": [
    (d) => `✅ Property added to favorites!\n\n🆔 Rent ID: ${v(d.rentId)}\n📍 ${v(d.location)}\n👨‍💼 Owner: ${v(d.ownerName)}\n\nWe've notified the owner.`,
    (d) => `Saved to favorites!\n\n${v(d.rentId)} at ${v(d.location)}\nOwner: ${v(d.ownerName)}`,
    (d) => `❤️ Favorited!\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nOwner: ${v(d.ownerName)}\n\nThe owner has been notified.`,
    (d) => `Property shortlisted!\n\n🆔 ${v(d.rentId)}\n📍 ${v(d.location)}\n👨‍💼 ${v(d.ownerName)}`,
    (d) => `You favorited ${v(d.rentId)} at ${v(d.location)}.\nOwner: ${v(d.ownerName)}\n\nGood choice!`,
    (d) => `Added to your favorites list!\n\nRent ID: ${v(d.rentId)} | ${v(d.location)}\nOwner: ${v(d.ownerName)}`,
    (d) => `✅ Done! ${v(d.rentId)} is in your favorites.\n\n📍 ${v(d.location)}\n👨‍💼 ${v(d.ownerName)}`,
    (d) => `Nice pick! Property ${v(d.rentId)} at ${v(d.location)} saved.\nOwner: ${v(d.ownerName)}`,
    (d) => `Property favorited successfully!\n\n${v(d.rentId)} | ${v(d.location)} | ${v(d.ownerName)}`,
    (d) => `❤️ Saved! Rent ID ${v(d.rentId)} at ${v(d.location)}.\nOwner: ${v(d.ownerName)}`,
    (d) => `Your favorite has been recorded!\n\n${v(d.rentId)} at ${v(d.location)}\n${v(d.ownerName)} was notified.`,
    (d) => `Shortlisted! ${v(d.ownerName)}'s property (${v(d.rentId)}) at ${v(d.location)}.`,
  ],

  // ── Report Property ───────────────────────────────────────
  "report-owner": [
    (d) => `⚠️ Your property has been reported by a user.\n\n👨‍💼 Owner: ${v(d.ownerName)}\n📞 Reported by: ${v(d.userPhone)}\n\nIf you need help, contact:\n📞 8300622013\n📧 info.rentpondy@gmail.com`,
    (d) => `A user reported your property listing.\n\nOwner: ${v(d.ownerName)}\nReporter: ${v(d.userPhone)}\n\nContact support if needed: 8300622013`,
    (d) => `⚠️ Report notification!\n\nYour property was reported.\nOwner: ${v(d.ownerName)}\nBy: ${v(d.userPhone)}\n\nReach support: info.rentpondy@gmail.com`,
    (d) => `Your listing received a report from ${v(d.userPhone)}.\n\nOwner: ${v(d.ownerName)}\n\nFor assistance: 📞 8300622013`,
    (d) => `A user has flagged your property.\n\n${v(d.ownerName)} — reported by ${v(d.userPhone)}\n\nContact us: info.rentpondy@gmail.com`,
    (d) => `⚠️ Property reported.\n\nOwner: ${v(d.ownerName)}\nReporter phone: ${v(d.userPhone)}\n\nSupport: 8300622013 / info.rentpondy@gmail.com`,
    (d) => `Notice: Your property was reported.\n\n${v(d.ownerName)}\nBy: ${v(d.userPhone)}\n\nContact Rent Pondy support for details.`,
    (d) => `A report was submitted against your listing.\n\nOwner: ${v(d.ownerName)}\nFrom: ${v(d.userPhone)}\n\nWe'll review it. Reach us: 8300622013`,
    (d) => `⚠️ Report alert for ${v(d.ownerName)}'s property.\n\nReported by: ${v(d.userPhone)}\n\nFor queries: info.rentpondy@gmail.com`,
    (d) => `Your property received a user report.\n\n${v(d.ownerName)} — Reporter: ${v(d.userPhone)}\n\nSupport: 📞 8300622013`,
    (d) => `A user flagged your listing. We're looking into it.\n\nOwner: ${v(d.ownerName)}\nPhone: ${v(d.userPhone)}`,
    (d) => `Report received for your property.\n\n${v(d.ownerName)}\nBy: ${v(d.userPhone)}\n\nNo action needed yet. We'll review.`,
  ],

  "report-user": [
    (d) => `✅ Your report has been submitted.\n\n🆔 Rent ID: ${v(d.rentId)}\n📍 Location: ${v(d.location)}\n👨‍💼 Owner: ${v(d.ownerName)}\n\nWe'll review and take action.`,
    (d) => `Report submitted!\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nOwner: ${v(d.ownerName)}\n\nOur team will look into it.`,
    (d) => `We've received your report for property ${v(d.rentId)} at ${v(d.location)}.\n\nOwner: ${v(d.ownerName)}\n\nThank you for keeping the platform safe.`,
    (d) => `Report noted!\n\n🆔 ${v(d.rentId)}\n📍 ${v(d.location)}\n👨‍💼 ${v(d.ownerName)}\n\nWe'll investigate shortly.`,
    (d) => `Your report for ${v(d.rentId)} has been recorded.\n\nLocation: ${v(d.location)}\nOwner: ${v(d.ownerName)}`,
    (d) => `✅ Reported! We'll review property ${v(d.rentId)} at ${v(d.location)}.`,
    (d) => `Thanks for reporting.\n\nRent ID: ${v(d.rentId)}\n${v(d.location)}\nOwner: ${v(d.ownerName)}\n\nWe take this seriously.`,
    (d) => `Report acknowledged for ${v(d.rentId)}.\n\n${v(d.location)} — ${v(d.ownerName)}\n\nOur team is on it.`,
    (d) => `We received your feedback on ${v(d.rentId)} at ${v(d.location)}.\nOwner: ${v(d.ownerName)}\n\nAction will follow.`,
    (d) => `Your report is being processed.\n\n${v(d.rentId)} | ${v(d.location)} | ${v(d.ownerName)}`,
    (d) => `✅ Property ${v(d.rentId)} reported.\n\nLocation: ${v(d.location)}\nOwner: ${v(d.ownerName)}\n\nWe'll handle it.`,
    (d) => `Noted! Your report for ${v(d.ownerName)}'s property at ${v(d.location)} is under review.`,
  ],

  // ── Share ─────────────────────────────────────────────────
  "share-owner": [
    (d) => `🔗 Your property has been shared by a user!\n\n🆔 Rent ID: ${v(d.rentId)}\n📍 ${v(d.location)}\n👤 Shared by: ${v(d.userPhone)}\n\nMore visibility means more leads!`,
    (d) => `Someone shared your property listing!\n\n${v(d.rentId)} at ${v(d.location)}\nShared by: ${v(d.userPhone)}`,
    (d) => `📤 Your listing was shared!\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nBy: ${v(d.userPhone)}\n\nGreat exposure for your property!`,
    (d) => `Good news! Your property ${v(d.rentId)} is being shared around.\n\n${v(d.location)}\nSharer: ${v(d.userPhone)}`,
    (d) => `A user shared your listing with their network.\n\n${v(d.rentId)} | ${v(d.location)}\nPhone: ${v(d.userPhone)}`,
    (d) => `🔗 Share notification!\n\nProperty: ${v(d.rentId)}\nArea: ${v(d.location)}\nShared by: ${v(d.userPhone)}`,
    (d) => `Your property is spreading!\n\n${v(d.rentId)} at ${v(d.location)} was shared.\nBy: ${v(d.userPhone)}`,
    (d) => `Someone is helping promote your property!\n\nRent ID: ${v(d.rentId)}\n${v(d.location)}\nUser: ${v(d.userPhone)}`,
    (d) => `Property ${v(d.rentId)} shared by ${v(d.userPhone)}.\n📍 ${v(d.location)}\n\nMore eyes on your listing!`,
    (d) => `📣 Your listing got shared!\n\n${v(d.rentId)} | ${v(d.location)}\nBy: ${v(d.userPhone)}`,
    (d) => `A user is spreading the word about your property.\n\n${v(d.rentId)} at ${v(d.location)}\n${v(d.userPhone)}`,
    (d) => `Share alert!\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nShared by: ${v(d.userPhone)}`,
  ],

  "share-user": [
    (d) => `🔗 You shared a property!\n\n🆔 Rent ID: ${v(d.rentId)}\n📍 ${v(d.location)}\n👨‍💼 Owner: ${v(d.ownerName)}\n\nGreat way to help someone find a home!`,
    (d) => `Property shared!\n\n${v(d.rentId)} at ${v(d.location)}\nOwner: ${v(d.ownerName)}`,
    (d) => `Thanks for sharing property ${v(d.rentId)}!\n\n📍 ${v(d.location)}\n👨‍💼 ${v(d.ownerName)}`,
    (d) => `📤 Shared! Rent ID ${v(d.rentId)} at ${v(d.location)}.\nOwner: ${v(d.ownerName)}`,
    (d) => `You shared ${v(d.ownerName)}'s property at ${v(d.location)}.\n\nRent ID: ${v(d.rentId)}\n\nThanks for spreading the word!`,
    (d) => `Property ${v(d.rentId)} shared successfully.\n\n${v(d.location)} | ${v(d.ownerName)}`,
    (d) => `🔗 Done! Property shared with your network.\n\n${v(d.rentId)} at ${v(d.location)}`,
    (d) => `Thanks for sharing!\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nOwner: ${v(d.ownerName)}`,
    (d) => `You've shared a listing!\n\n${v(d.rentId)} | ${v(d.location)} | ${v(d.ownerName)}`,
    (d) => `Share confirmed for ${v(d.rentId)} at ${v(d.location)}.`,
    (d) => `📤 Property shared! ${v(d.rentId)} — ${v(d.location)}.\nOwner: ${v(d.ownerName)}`,
    (d) => `Great! You shared ${v(d.rentId)} (${v(d.location)}) with your contacts.`,
  ],

  // ── Offer ─────────────────────────────────────────────────
  "offer-owner": [
    (d) => `💰 A user has made an offer on your property!\n\n💵 Offered Rent: ₹${v(d.offerAmount)}/month\n🆔 Rent ID: ${v(d.rentId)}\n📍 ${v(d.location)}\n👤 ${v(d.userName)}\n📞 ${v(d.userPhone)}\n\nPlease review the offer.`,
    (d) => `New offer received!\n\n₹${v(d.offerAmount)}/month for ${v(d.rentId)} at ${v(d.location)}\nFrom: ${v(d.userName)} (${v(d.userPhone)})\n\nRespond at your convenience.`,
    (d) => `💰 Offer alert!\n\nAmount: ₹${v(d.offerAmount)}/mo\nProperty: ${v(d.rentId)}\nArea: ${v(d.location)}\nUser: ${v(d.userName)} — ${v(d.userPhone)}`,
    (d) => `${v(d.userName)} offered ₹${v(d.offerAmount)}/month for your property.\n\nRent ID: ${v(d.rentId)}\n${v(d.location)}\n📞 ${v(d.userPhone)}`,
    (d) => `An offer was made on your listing!\n\n₹${v(d.offerAmount)}/mo | ${v(d.rentId)} | ${v(d.location)}\n${v(d.userName)} — ${v(d.userPhone)}`,
    (d) => `A tenant wants to negotiate rent!\n\nOffer: ₹${v(d.offerAmount)}/month\nProperty: ${v(d.rentId)} at ${v(d.location)}\nContact: ${v(d.userName)} (${v(d.userPhone)})`,
    (d) => `💰 Price offer!\n\n${v(d.userName)} is willing to pay ₹${v(d.offerAmount)}/mo for ${v(d.rentId)}.\n📍 ${v(d.location)}\n📞 ${v(d.userPhone)}`,
    (d) => `You received an offer of ₹${v(d.offerAmount)}/month.\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nFrom: ${v(d.userName)}\nPhone: ${v(d.userPhone)}`,
    (d) => `Offer notification!\n\n₹${v(d.offerAmount)}/mo for property ${v(d.rentId)} at ${v(d.location)}.\nOffered by: ${v(d.userName)} — ${v(d.userPhone)}`,
    (d) => `New rent offer: ₹${v(d.offerAmount)}/month\n\n🆔 ${v(d.rentId)} | 📍 ${v(d.location)}\n👤 ${v(d.userName)} | 📞 ${v(d.userPhone)}`,
    (d) => `${v(d.userName)} wants your property at ₹${v(d.offerAmount)}/month!\n\n${v(d.rentId)} at ${v(d.location)}\n📞 ${v(d.userPhone)}`,
    (d) => `A rent proposal was submitted.\n\nAmount: ₹${v(d.offerAmount)}/mo\nProperty: ${v(d.rentId)}\nFrom: ${v(d.userName)} (${v(d.userPhone)})`,
  ],

  "offer-user": [
    (d) => `✅ Your offer has been submitted!\n\n💵 ₹${v(d.offerAmount)}/month\n🆔 Rent ID: ${v(d.rentId)}\n📍 ${v(d.location)}\n👨‍💼 Owner: ${v(d.ownerName)}\n📞 ${v(d.ownerPhone)}\n\nThe owner will review shortly.`,
    (d) => `Offer sent!\n\n₹${v(d.offerAmount)}/mo for ${v(d.rentId)} at ${v(d.location)}\nOwner: ${v(d.ownerName)} (${v(d.ownerPhone)})`,
    (d) => `Your offer of ₹${v(d.offerAmount)}/month was submitted.\n\n${v(d.rentId)} | ${v(d.location)}\nOwner: ${v(d.ownerName)} — ${v(d.ownerPhone)}`,
    (d) => `💰 Offer submitted!\n\n₹${v(d.offerAmount)}/mo\nProperty: ${v(d.rentId)}\n${v(d.location)}\nOwner: ${v(d.ownerName)} (${v(d.ownerPhone)})`,
    (d) => `We've sent your offer to ${v(d.ownerName)}.\n\n₹${v(d.offerAmount)}/mo for ${v(d.rentId)} at ${v(d.location)}\n📞 ${v(d.ownerPhone)}`,
    (d) => `Done! Your ₹${v(d.offerAmount)}/month offer for ${v(d.rentId)} was delivered.\n\nOwner: ${v(d.ownerName)} — ${v(d.ownerPhone)}`,
    (d) => `Offer recorded!\n\nAmount: ₹${v(d.offerAmount)}/mo\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nOwner: ${v(d.ownerName)}`,
    (d) => `✅ Submitted! ₹${v(d.offerAmount)}/mo for property ${v(d.rentId)}.\n\n${v(d.ownerName)} at ${v(d.location)}\n📞 ${v(d.ownerPhone)}`,
    (d) => `Your rent offer is with the owner.\n\n₹${v(d.offerAmount)}/mo | ${v(d.rentId)} | ${v(d.location)}\n${v(d.ownerName)} — ${v(d.ownerPhone)}`,
    (d) => `Offer delivered to ${v(d.ownerName)}!\n\n₹${v(d.offerAmount)}/month\nProperty: ${v(d.rentId)} at ${v(d.location)}\nCall: ${v(d.ownerPhone)}`,
    (d) => `💰 ₹${v(d.offerAmount)}/mo offer sent for ${v(d.rentId)}.\n\nOwner: ${v(d.ownerName)}\nLocation: ${v(d.location)}\nPhone: ${v(d.ownerPhone)}`,
    (d) => `Your offer was forwarded to the property owner.\n\n₹${v(d.offerAmount)}/mo — ${v(d.rentId)}\n${v(d.ownerName)} | ${v(d.ownerPhone)}`,
  ],

  // ── Property View ─────────────────────────────────────────
  "property-view-owner": [
    (d) => `👁️ Your property was viewed!\n\n🆔 Rent ID: ${v(d.rentId)}\n📍 ${v(d.location)}\n👤 Viewed by: ${v(d.viewerPhone)}\n\nYour listing is getting attention!`,
    (d) => `Someone checked out your property ${v(d.rentId)} at ${v(d.location)}.\nViewer: ${v(d.viewerPhone)}`,
    (d) => `Property view alert!\n\n${v(d.rentId)} | ${v(d.location)}\nViewed by: ${v(d.viewerPhone)}`,
    (d) => `Your listing got a view!\n\nRent ID: ${v(d.rentId)}\nArea: ${v(d.location)}\nViewer: ${v(d.viewerPhone)}`,
    (d) => `👁️ ${v(d.viewerPhone)} viewed your property.\n\n${v(d.rentId)} at ${v(d.location)}`,
    (d) => `A user just browsed your property listing.\n\n${v(d.rentId)} | ${v(d.location)}\nPhone: ${v(d.viewerPhone)}`,
    (d) => `New view on your listing!\n\nRent ID: ${v(d.rentId)}\n${v(d.location)}\nViewer: ${v(d.viewerPhone)}`,
    (d) => `Your property ${v(d.rentId)} was viewed by ${v(d.viewerPhone)} in ${v(d.location)}.`,
    (d) => `View notification!\n\n${v(d.rentId)} at ${v(d.location)}\nBy: ${v(d.viewerPhone)}`,
    (d) => `Someone's eyeing your property!\n\n🆔 ${v(d.rentId)} | 📍 ${v(d.location)}\n📞 ${v(d.viewerPhone)}`,
    (d) => `Property viewed!\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nViewer phone: ${v(d.viewerPhone)}`,
    (d) => `👁️ View recorded for ${v(d.rentId)} (${v(d.location)}).\nBy: ${v(d.viewerPhone)}`,
  ],

  "property-view-user": [
    (d) => `✅ You viewed a property!\n\n🆔 Rent ID: ${v(d.rentId)}\n📍 ${v(d.location)}\n👨‍💼 Owner: ${v(d.ownerName)}\n📞 ${v(d.ownerPhone)}\n\nInterested? Send your interest!`,
    (d) => `Property details:\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nOwner: ${v(d.ownerName)} (${v(d.ownerPhone)})`,
    (d) => `You just viewed ${v(d.rentId)} at ${v(d.location)}.\n\nOwner: ${v(d.ownerName)} — ${v(d.ownerPhone)}`,
    (d) => `🏠 Property viewed!\n\n${v(d.rentId)} | ${v(d.location)}\n${v(d.ownerName)} — ${v(d.ownerPhone)}`,
    (d) => `Here's the property you checked out:\n\n${v(d.rentId)} at ${v(d.location)}\nContact: ${v(d.ownerName)} (${v(d.ownerPhone)})`,
    (d) => `✅ Viewed! Rent ID ${v(d.rentId)} at ${v(d.location)}.\nOwner: ${v(d.ownerName)}\nPhone: ${v(d.ownerPhone)}`,
    (d) => `Property visit logged!\n\n🆔 ${v(d.rentId)}\n📍 ${v(d.location)}\n👨‍💼 ${v(d.ownerName)} — ${v(d.ownerPhone)}`,
    (d) => `You browsed a property at ${v(d.location)}.\n\nRent ID: ${v(d.rentId)}\nOwner: ${v(d.ownerName)}\nPhone: ${v(d.ownerPhone)}`,
    (d) => `View recorded!\n\n${v(d.rentId)} | ${v(d.location)}\n${v(d.ownerName)} (${v(d.ownerPhone)})`,
    (d) => `Checking out ${v(d.rentId)} at ${v(d.location)}!\n\nOwner: ${v(d.ownerName)} — ${v(d.ownerPhone)}`,
    (d) => `Nice find! ${v(d.rentId)} in ${v(d.location)}.\n\n${v(d.ownerName)} — ${v(d.ownerPhone)}`,
    (d) => `Property viewed: ${v(d.rentId)}\nArea: ${v(d.location)}\nOwner: ${v(d.ownerName)} | ${v(d.ownerPhone)}`,
  ],

  // ── Need Help (Admin) ─────────────────────────────────────
  "need-help": [
    (d) => `🆘 NEED HELP REQUEST\n\n📞 User: ${v(d.userPhone)}\n🆔 Rent ID: ${v(d.rentId)}\n📍 Location: ${v(d.location)}\n👨‍💼 Owner: ${v(d.ownerName)}\n\n🎯 Reason: ${v(d.reason)}\n💬 Comment: ${v(d.comment, "No comment")}\n\nPlease respond ASAP.`,
    (d) => `🆘 Help needed!\n\nUser: ${v(d.userPhone)}\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nOwner: ${v(d.ownerName)}\nReason: ${v(d.reason)}\nDetails: ${v(d.comment, "None")}`,
    (d) => `🔴 Support request\n\n📞 ${v(d.userPhone)}\n🆔 ${v(d.rentId)} at ${v(d.location)}\nOwner: ${v(d.ownerName)}\nIssue: ${v(d.reason)}\n\n${v(d.comment, "No additional details")}`,
    (d) => `Help request from ${v(d.userPhone)}.\n\nProperty: ${v(d.rentId)} | ${v(d.location)}\nOwner: ${v(d.ownerName)}\nReason: ${v(d.reason)}\nComment: ${v(d.comment, "—")}`,
    (d) => `🆘 User needs assistance!\n\nPhone: ${v(d.userPhone)}\nRent ID: ${v(d.rentId)}\nArea: ${v(d.location)}\nOwner: ${v(d.ownerName)}\n\nReason: ${v(d.reason)}\n${v(d.comment, "")}`,
    (d) => `Support alert!\n\n${v(d.userPhone)} needs help.\nProperty: ${v(d.rentId)} at ${v(d.location)}\nOwner: ${v(d.ownerName)}\nIssue: ${v(d.reason)}\nNote: ${v(d.comment, "None provided")}`,
    (d) => `🔴 New help request\n\nFrom: ${v(d.userPhone)}\nAbout: ${v(d.rentId)} — ${v(d.location)}\nOwner: ${v(d.ownerName)}\n\n${v(d.reason)}\n${v(d.comment, "")}`,
    (d) => `User ${v(d.userPhone)} requested help.\n\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nOwner: ${v(d.ownerName)}\nType: ${v(d.reason)}\nDetails: ${v(d.comment, "—")}`,
    (d) => `🆘 Attention needed!\n\nUser: ${v(d.userPhone)}\nProperty: ${v(d.rentId)} at ${v(d.location)}\nOwner: ${v(d.ownerName)}\nHelp type: ${v(d.reason)}\n\n"${v(d.comment, "No comment")}"`,
    (d) => `Help ticket!\n\n📞 ${v(d.userPhone)}\n🆔 ${v(d.rentId)}\n📍 ${v(d.location)}\n👤 Owner: ${v(d.ownerName)}\n\nReason: ${v(d.reason)}\nComment: ${v(d.comment, "N/A")}`,
    (d) => `New support request from user.\n\nPhone: ${v(d.userPhone)}\nRent ID: ${v(d.rentId)}\nLocation: ${v(d.location)}\nOwner: ${v(d.ownerName)}\nIssue: ${v(d.reason)}\n${v(d.comment, "")}`,
    (d) => `🔴 Help alert — ${v(d.reason)}\n\nUser: ${v(d.userPhone)}\nProperty: ${v(d.rentId)} (${v(d.location)})\nOwner: ${v(d.ownerName)}\n\n${v(d.comment, "No further details")}`,
  ],

  // ── Property Management ───────────────────────────────────
  "add-property-step": [
    (d) => `🏠 Property Addition Progress\n\n✅ Step ${v(d.stepNum)}: ${v(d.stepName)} completed!\n\n${v(d.stepMessage, "")}\n\nRent ID: ${v(d.rentId, "Processing")}`,
    (d) => `Step ${v(d.stepNum)} done!\n\n${v(d.stepName)} ✅\n${v(d.stepMessage, "")}\n\nRent ID: ${v(d.rentId, "Processing")}`,
    (d) => `Progress update: Step ${v(d.stepNum)} (${v(d.stepName)}) complete.\n\n${v(d.stepMessage, "")}\nRent ID: ${v(d.rentId, "Processing")}`,
    (d) => `✅ ${v(d.stepName)} finished (Step ${v(d.stepNum)}).\n\n${v(d.stepMessage, "")}\nProperty: ${v(d.rentId, "Processing")}`,
    (d) => `🏗️ Building your listing...\n\nStep ${v(d.stepNum)}: ${v(d.stepName)} ✅\n${v(d.stepMessage, "")}\n\nRent ID: ${v(d.rentId, "Processing")}`,
    (d) => `Step ${v(d.stepNum)} of property addition done!\n\n${v(d.stepName)} completed.\n${v(d.stepMessage, "")}\n\n🆔 ${v(d.rentId, "Processing")}`,
    (d) => `📋 ${v(d.stepName)} — done!\n\nStep ${v(d.stepNum)} complete for property ${v(d.rentId, "in progress")}.\n${v(d.stepMessage, "")}`,
    (d) => `Your property is taking shape!\n\n✅ Step ${v(d.stepNum)}: ${v(d.stepName)}\n${v(d.stepMessage, "")}\nRent ID: ${v(d.rentId, "Processing")}`,
    (d) => `Almost there! Step ${v(d.stepNum)} (${v(d.stepName)}) is done.\n\n${v(d.stepMessage, "")}\n${v(d.rentId, "Processing")}`,
    (d) => `Property step completed!\n\n#${v(d.stepNum)} — ${v(d.stepName)} ✅\n${v(d.stepMessage, "")}\n\nRent ID: ${v(d.rentId, "Processing")}`,
    (d) => `✅ Step ${v(d.stepNum)} complete.\n\n${v(d.stepName)}\n${v(d.stepMessage, "")}\nProperty ID: ${v(d.rentId, "Processing")}`,
    (d) => `🏠 ${v(d.stepName)} done (Step ${v(d.stepNum)})!\n\n${v(d.stepMessage, "")}\nRent ID: ${v(d.rentId, "In progress")}`,
  ],

  "add-property": [
    (d) => `🎉 YOUR PROPERTY ADDED SUCCESSFULLY!\n\nStatus: ✅ Pre-Approved\nRent ID: 🆔 ${v(d.rentId, "Processing")}\n\nOwner: ${v(d.ownerName)}\nPhone: ${v(d.phone)}\nEmail: ${v(d.email)}\n\nType: ${v(d.propertyType)} | Mode: ${v(d.propertyMode)}\nRent: ₹${v(d.rentalAmount)}/mo | Lease: ${v(d.rentType)}\nBedrooms: ${v(d.bedrooms)} | Area: ${v(d.totalArea)} ${v(d.areaUnit, "")}\nFloor: ${v(d.floorNo)}/${v(d.numberOfFloors)} | Parking: ${v(d.carParking)}\nFurnished: ${v(d.furnished)}\n\nAddress: ${v(d.address)}\nCity: ${v(d.city)} | State: ${v(d.state)}\nPincode: ${v(d.pinCode)}\nAvailable: ${v(d.availableDate)}`,
    (d) => `Property listed!\n\n🆔 ${v(d.rentId, "Processing")} — Pre-Approved ✅\n\n${v(d.ownerName)} | ${v(d.phone)}\n${v(d.propertyType)} at ${v(d.city)}\n₹${v(d.rentalAmount)}/mo | ${v(d.bedrooms)} BHK\nArea: ${v(d.totalArea)} ${v(d.areaUnit, "")}\n\nAvailable: ${v(d.availableDate)}`,
    (d) => `Congratulations! Your property is now live.\n\nRent ID: ${v(d.rentId, "Processing")}\n${v(d.propertyType)} | ${v(d.propertyMode)}\n₹${v(d.rentalAmount)}/mo\n${v(d.bedrooms)} BHK | ${v(d.totalArea)} ${v(d.areaUnit, "")}\n${v(d.city)}, ${v(d.state)}\n\nOwner: ${v(d.ownerName)} — ${v(d.phone)}`,
    (d) => `✅ Property added!\n\n${v(d.rentId, "Processing")} — Pre-Approved\n\n${v(d.ownerName)} (${v(d.phone)})\n${v(d.propertyType)}, ${v(d.propertyMode)}\n₹${v(d.rentalAmount)}/mo\n${v(d.bedrooms)} BHK, ${v(d.totalArea)} ${v(d.areaUnit, "")}\nFloor: ${v(d.floorNo)}\n\n${v(d.city)}, ${v(d.state)} — ${v(d.pinCode)}\nAvailable from: ${v(d.availableDate)}`,
    (d) => `🏠 New listing!\n\nRent ID: ${v(d.rentId, "Processing")}\nOwner: ${v(d.ownerName)}\nPhone: ${v(d.phone)}\n\n${v(d.propertyType)} — ₹${v(d.rentalAmount)}/mo\n${v(d.bedrooms)} BHK | ${v(d.totalArea)} ${v(d.areaUnit, "")}\n${v(d.furnished)} | Parking: ${v(d.carParking)}\n\n${v(d.city)}, ${v(d.state)}`,
    (d) => `🎉 Listed! Rent ID: ${v(d.rentId, "Processing")}\n\n${v(d.ownerName)} — ${v(d.phone)}\n${v(d.propertyType)} (${v(d.propertyMode)})\nRent: ₹${v(d.rentalAmount)}/mo\nBHK: ${v(d.bedrooms)} | Area: ${v(d.totalArea)} ${v(d.areaUnit, "")}\nLocation: ${v(d.city)}, ${v(d.state)}\nAvailable: ${v(d.availableDate)}`,
    (d) => `Your property is live on Rent Pondy!\n\n🆔 ${v(d.rentId, "Processing")}\n${v(d.propertyType)} at ${v(d.city)}\n₹${v(d.rentalAmount)}/month\n${v(d.bedrooms)} bedrooms, ${v(d.totalArea)} ${v(d.areaUnit, "")}\n\nOwner: ${v(d.ownerName)}\n📞 ${v(d.phone)}`,
    (d) => `Property registered successfully!\n\nRent ID: ${v(d.rentId, "Processing")}\n\n${v(d.propertyType)} | ₹${v(d.rentalAmount)}/mo\n${v(d.bedrooms)} BHK | ${v(d.totalArea)} ${v(d.areaUnit, "")}\n${v(d.city)}, ${v(d.pinCode)}\n\n${v(d.ownerName)} — ${v(d.phone)}`,
    (d) => `✅ Your ${v(d.propertyType)} is now listed!\n\nRent ID: ${v(d.rentId, "Processing")}\nRent: ₹${v(d.rentalAmount)}/mo | ${v(d.rentType)}\n${v(d.bedrooms)} BHK, Floor ${v(d.floorNo)}\n${v(d.city)}, ${v(d.state)}\n\nOwner: ${v(d.ownerName)} (${v(d.phone)})`,
    (d) => `🎉 Your property is pre-approved!\n\n${v(d.rentId, "Processing")}\n${v(d.propertyType)} in ${v(d.city)}\n₹${v(d.rentalAmount)}/mo | ${v(d.bedrooms)} BHK\nArea: ${v(d.totalArea)} ${v(d.areaUnit, "")}\nAvailable: ${v(d.availableDate)}\n\n${v(d.ownerName)} — ${v(d.phone)}`,
    (d) => `Listed!\n\nID: ${v(d.rentId, "Processing")}\nType: ${v(d.propertyType)} (${v(d.propertyMode)})\nRent: ₹${v(d.rentalAmount)}/mo\nBedrooms: ${v(d.bedrooms)} | Area: ${v(d.totalArea)} ${v(d.areaUnit, "")}\nCity: ${v(d.city)} | Pin: ${v(d.pinCode)}\n\n${v(d.ownerName)} | ${v(d.phone)}`,
    (d) => `Property addition complete!\n\n🆔 ${v(d.rentId, "Processing")} — Pre-Approved\n${v(d.propertyType)} at ${v(d.address)}, ${v(d.city)}\n₹${v(d.rentalAmount)}/month | ${v(d.bedrooms)} BHK\n\nOwner: ${v(d.ownerName)}\nPhone: ${v(d.phone)}`,
  ],

  "edit-property": [
    (d) => `✅ Property updated!\n\nRent ID: ${v(d.rentId)}\nStatus: ${v(d.status, "Pre-Approved")}\n\n${v(d.ownerName)} | ${v(d.phone)}\n${v(d.propertyType)} (${v(d.propertyMode)})\n₹${v(d.rentalAmount)}/mo\n${v(d.bedrooms)} BHK | ${v(d.totalArea)} ${v(d.areaUnit, "")}\n${v(d.city)}, ${v(d.state)}`,
    (d) => `Property ${v(d.rentId)} has been updated.\n\n${v(d.propertyType)} at ${v(d.city)}\n₹${v(d.rentalAmount)}/mo | ${v(d.bedrooms)} BHK\nOwner: ${v(d.ownerName)} (${v(d.phone)})`,
    (d) => `🏠 Update confirmed!\n\n🆔 ${v(d.rentId)}\n${v(d.propertyType)} | ₹${v(d.rentalAmount)}/mo\n${v(d.bedrooms)} BHK, ${v(d.totalArea)} ${v(d.areaUnit, "")}\n${v(d.city)}, ${v(d.state)}\n\n${v(d.ownerName)} — ${v(d.phone)}`,
    (d) => `Your listing was updated successfully.\n\nRent ID: ${v(d.rentId)}\nType: ${v(d.propertyType)}\nRent: ₹${v(d.rentalAmount)}/mo\nBedrooms: ${v(d.bedrooms)}\nCity: ${v(d.city)}`,
    (d) => `Edit saved!\n\n${v(d.rentId)} — ${v(d.propertyType)} at ${v(d.city)}\n₹${v(d.rentalAmount)}/mo | ${v(d.bedrooms)} BHK\n\n${v(d.ownerName)} (${v(d.phone)})`,
    (d) => `Property details updated!\n\nRent ID: ${v(d.rentId)}\n${v(d.propertyType)} | ${v(d.propertyMode)}\n₹${v(d.rentalAmount)}/month\n${v(d.city)}, ${v(d.pinCode)}`,
    (d) => `✅ Changes saved for ${v(d.rentId)}.\n\n${v(d.propertyType)} in ${v(d.city)}\n₹${v(d.rentalAmount)}/mo | ${v(d.bedrooms)} BHK\nOwner: ${v(d.ownerName)}`,
    (d) => `Updated listing!\n\n${v(d.rentId)} — ${v(d.status, "Pre-Approved")}\n${v(d.propertyType)} at ${v(d.city)}\n₹${v(d.rentalAmount)}/mo\n${v(d.ownerName)} — ${v(d.phone)}`,
    (d) => `Your property ${v(d.rentId)} is updated.\n\n${v(d.propertyType)} | ₹${v(d.rentalAmount)}/mo\n${v(d.bedrooms)} BHK | ${v(d.totalArea)} ${v(d.areaUnit, "")}\n${v(d.city)}, ${v(d.state)}`,
    (d) => `Rent ID ${v(d.rentId)} updated!\n\nType: ${v(d.propertyType)}\nRent: ₹${v(d.rentalAmount)}/mo\nBedrooms: ${v(d.bedrooms)}\nArea: ${v(d.totalArea)} ${v(d.areaUnit, "")}\nLocation: ${v(d.city)}`,
    (d) => `🏠 ${v(d.rentId)} — Edit complete!\n\n${v(d.ownerName)} (${v(d.phone)})\n${v(d.propertyType)} at ${v(d.city)}, ${v(d.state)}\n₹${v(d.rentalAmount)}/mo`,
    (d) => `Property updated successfully.\n\n${v(d.rentId)}\n${v(d.propertyType)} | ₹${v(d.rentalAmount)}/mo\n${v(d.city)} | ${v(d.bedrooms)} BHK\nOwner: ${v(d.ownerName)}`,
  ],

  "property-removal": [
    (d) => `🔔 Property removed.\n\nRent ID: ${v(d.rentId)}\nType: ${v(d.propertyType)}\nLocation: ${v(d.location)}\nStatus: ${v(d.status)}\n\nTo restore, go to "Removed" in your dashboard.`,
    (d) => `Your property has been removed.\n\n${v(d.rentId)} — ${v(d.propertyType)} at ${v(d.location)}\n\nWant it back? Use "Undo" in the Removed tab.`,
    (d) => `Property ${v(d.rentId)} removed.\n\nType: ${v(d.propertyType)}\nLocation: ${v(d.location)}\nStatus was: ${v(d.status)}\n\nRestore anytime from your dashboard.`,
    (d) => `Removed!\n\n🆔 ${v(d.rentId)}\n🏠 ${v(d.propertyType)}\n📍 ${v(d.location)}\n\nYou can undo this from the "Removed" section.`,
    (d) => `Your listing ${v(d.rentId)} was removed from Rent Pondy.\n\n${v(d.propertyType)} at ${v(d.location)}\n\nHit "Undo" to bring it back.`,
    (d) => `Property taken down.\n\nRent ID: ${v(d.rentId)} | ${v(d.propertyType)}\nArea: ${v(d.location)}\n\nRestore from the Removed tab.`,
    (d) => `🔔 Listing removed.\n\n${v(d.rentId)} — ${v(d.propertyType)}\n${v(d.location)}\n\nTo restore, visit your dashboard.`,
    (d) => `${v(d.rentId)} has been removed.\n\nType: ${v(d.propertyType)}\nLocation: ${v(d.location)}\n\nYou can always undo this later.`,
    (d) => `Property removed from listings.\n\nRent ID: ${v(d.rentId)}\n${v(d.propertyType)} at ${v(d.location)}`,
    (d) => `Your ${v(d.propertyType)} at ${v(d.location)} (${v(d.rentId)}) was removed.\n\nRestore it from the Removed section.`,
    (d) => `Listing ${v(d.rentId)} is now removed.\n\n${v(d.propertyType)} | ${v(d.location)}\nStatus: ${v(d.status)}\n\nUndo available.`,
    (d) => `Removed: ${v(d.rentId)}\n\n${v(d.propertyType)} at ${v(d.location)}\n\nRestore anytime.`,
  ],

  "property-undo-removal": [
    (d) => `🎉 Property restored!\n\nRent ID: ${v(d.rentId)}\nType: ${v(d.propertyType)}\nLocation: ${v(d.location)}\nStatus: ${v(d.status)}\n\nYour listing is live again!`,
    (d) => `Your property is back!\n\n${v(d.rentId)} — ${v(d.propertyType)} at ${v(d.location)}\n\nIt's now visible to tenants.`,
    (d) => `Property ${v(d.rentId)} restored successfully.\n\n${v(d.propertyType)} at ${v(d.location)}\nStatus: ${v(d.status)}`,
    (d) => `✅ Restored!\n\n🆔 ${v(d.rentId)}\n🏠 ${v(d.propertyType)}\n📍 ${v(d.location)}\n\nYour listing is live again.`,
    (d) => `Welcome back! Your listing ${v(d.rentId)} is restored.\n\n${v(d.propertyType)} at ${v(d.location)}`,
    (d) => `🎉 Undo successful!\n\nRent ID: ${v(d.rentId)} | ${v(d.propertyType)}\nArea: ${v(d.location)}\n\nLive and visible!`,
    (d) => `Property ${v(d.rentId)} is active again!\n\n${v(d.propertyType)} at ${v(d.location)}\nStatus: ${v(d.status)}`,
    (d) => `Your ${v(d.propertyType)} at ${v(d.location)} is back online.\n\nRent ID: ${v(d.rentId)}`,
    (d) => `Restored!\n\n${v(d.rentId)} — ${v(d.propertyType)}\n${v(d.location)}\n\nTenants can see it again.`,
    (d) => `✅ Property live again!\n\nRent ID: ${v(d.rentId)}\nType: ${v(d.propertyType)}\nLocation: ${v(d.location)}`,
    (d) => `Listing ${v(d.rentId)} restored!\n\n${v(d.propertyType)} | ${v(d.location)} | ${v(d.status)}`,
    (d) => `🎉 ${v(d.rentId)} is back!\n\n${v(d.propertyType)} at ${v(d.location)}\nNow live on Rent Pondy.`,
  ],

  // ── Buyer/Tenant Assistance ───────────────────────────────
  "buyer-assistance": [
    (d) => `🎉 Rental Assistance created!\n\n📋 Requirements:\n🏠 ${v(d.propertyType)} | ${v(d.propertyMode)}\n💰 ₹${v(d.minPrice)} - ₹${v(d.maxPrice)}\n📅 ${v(d.rentType)}\n🛏️ Bedrooms: ${v(d.bedrooms)}\n📍 Floor: ${v(d.floorNo)}\n🗺️ Area: ${v(d.location)}\n📮 Pin: ${v(d.pinCode)}\n\nWe'll help you find the perfect property!`,
    (d) => `Your rental search is on!\n\n${v(d.propertyType)} (${v(d.propertyMode)})\nBudget: ₹${v(d.minPrice)} - ₹${v(d.maxPrice)}/mo\n${v(d.bedrooms)} BHK | Floor: ${v(d.floorNo)}\nArea: ${v(d.location)} (${v(d.pinCode)})\n\nWe're on it!`,
    (d) => `Assistance registered!\n\n${v(d.propertyType)} | ${v(d.propertyMode)}\n₹${v(d.minPrice)} - ₹${v(d.maxPrice)}\n${v(d.bedrooms)} BHK | ${v(d.location)}\nRent type: ${v(d.rentType)}`,
    (d) => `✅ We're searching for you!\n\n${v(d.propertyType)} in ${v(d.location)}\nBudget: ₹${v(d.minPrice)} - ₹${v(d.maxPrice)}/mo\n${v(d.bedrooms)} BHK | Floor: ${v(d.floorNo)}`,
    (d) => `Your requirements are noted!\n\nType: ${v(d.propertyType)} | ${v(d.propertyMode)}\nRent: ₹${v(d.minPrice)} - ₹${v(d.maxPrice)}\nBedrooms: ${v(d.bedrooms)}\nLocation: ${v(d.location)} (${v(d.pinCode)})`,
    (d) => `🏠 Search started!\n\n${v(d.propertyType)}, ${v(d.propertyMode)}\n₹${v(d.minPrice)} - ₹${v(d.maxPrice)}/mo\n${v(d.bedrooms)} BHK in ${v(d.location)}\nFloor: ${v(d.floorNo)} | Rent: ${v(d.rentType)}`,
    (d) => `We're looking for your ideal property!\n\n${v(d.propertyType)} | ${v(d.location)}\nBudget: ₹${v(d.minPrice)} - ₹${v(d.maxPrice)}\n${v(d.bedrooms)} BHK, Floor ${v(d.floorNo)}`,
    (d) => `Assistance request received!\n\n${v(d.propertyType)} (${v(d.propertyMode)}) in ${v(d.location)}\n₹${v(d.minPrice)} - ₹${v(d.maxPrice)}/mo\n${v(d.bedrooms)} bedrooms\nPin: ${v(d.pinCode)}`,
    (d) => `🎉 You're all set!\n\nLooking for: ${v(d.propertyType)} in ${v(d.location)}\n₹${v(d.minPrice)} - ₹${v(d.maxPrice)}\n${v(d.bedrooms)} BHK | ${v(d.rentType)}\nFloor: ${v(d.floorNo)}`,
    (d) => `Rental assistance activated!\n\n${v(d.propertyType)} | ${v(d.propertyMode)}\n₹${v(d.minPrice)}-${v(d.maxPrice)}/mo\nBHK: ${v(d.bedrooms)} | Area: ${v(d.location)}\nPin: ${v(d.pinCode)}`,
    (d) => `Your property search has begun!\n\nType: ${v(d.propertyType)}\nMode: ${v(d.propertyMode)}\nBudget: ₹${v(d.minPrice)} - ₹${v(d.maxPrice)}\nBedrooms: ${v(d.bedrooms)}\nArea: ${v(d.location)}`,
    (d) => `We've noted your preferences!\n\n${v(d.propertyType)} at ${v(d.location)}\n₹${v(d.minPrice)}-₹${v(d.maxPrice)}/mo | ${v(d.bedrooms)} BHK\nFloor: ${v(d.floorNo)} | Pin: ${v(d.pinCode)}`,
  ],

  "tenant-assistance": [
    (d) => `🏠 Tenant Assistance created!\n\n📋 Requirements:\n🏢 ${v(d.propertyType)} | ${v(d.propertyMode)}\n💰 ₹${v(d.minPrice)} - ₹${v(d.maxPrice)}\n📅 ${v(d.rentType)}\n🛏️ Bedrooms: ${v(d.bedrooms)}\n📍 Floor: ${v(d.floorNo)}\n🌍 ${v(d.location)}\n📮 ${v(d.pinCode)}\n\nWe'll find you the perfect place!`,
    (d) => `Tenant search started!\n\n${v(d.propertyType)} (${v(d.propertyMode)})\nBudget: ₹${v(d.minPrice)} - ₹${v(d.maxPrice)}\n${v(d.bedrooms)} BHK | Floor: ${v(d.floorNo)}\nArea: ${v(d.location)}`,
    (d) => `Your tenant request is active!\n\n${v(d.propertyType)} in ${v(d.location)}\n₹${v(d.minPrice)} - ₹${v(d.maxPrice)}/mo\n${v(d.bedrooms)} BHK`,
    (d) => `✅ Looking for your ideal home!\n\n${v(d.propertyType)} | ${v(d.propertyMode)}\nBudget: ₹${v(d.minPrice)} - ₹${v(d.maxPrice)}\n${v(d.bedrooms)} BHK at ${v(d.location)}\nFloor: ${v(d.floorNo)} | Pin: ${v(d.pinCode)}`,
    (d) => `Assistance noted!\n\nType: ${v(d.propertyType)}\nMode: ${v(d.propertyMode)}\nRent: ₹${v(d.minPrice)} - ₹${v(d.maxPrice)}\nBedrooms: ${v(d.bedrooms)}\nArea: ${v(d.location)}`,
    (d) => `We're on the hunt for you!\n\n${v(d.propertyType)} in ${v(d.location)}\n₹${v(d.minPrice)}-₹${v(d.maxPrice)}/mo | ${v(d.bedrooms)} BHK\nFloor preference: ${v(d.floorNo)}`,
    (d) => `🏠 Request registered!\n\n${v(d.propertyType)} (${v(d.propertyMode)})\n₹${v(d.minPrice)} - ₹${v(d.maxPrice)}\n${v(d.bedrooms)} BHK | ${v(d.location)}\nPin: ${v(d.pinCode)}`,
    (d) => `Your requirements:\n\n${v(d.propertyType)} | ${v(d.location)}\n₹${v(d.minPrice)}-₹${v(d.maxPrice)}/mo\n${v(d.bedrooms)} BHK | Floor: ${v(d.floorNo)}\n\nWe'll match you!`,
    (d) => `Tenant assistance activated!\n\n${v(d.propertyType)} at ${v(d.location)}\nBudget: ₹${v(d.minPrice)} - ₹${v(d.maxPrice)}\n${v(d.bedrooms)} bedrooms`,
    (d) => `Search started for your home!\n\n${v(d.propertyType)} in ${v(d.location)} (${v(d.pinCode)})\n₹${v(d.minPrice)}-${v(d.maxPrice)}/mo\n${v(d.bedrooms)} BHK | Floor: ${v(d.floorNo)}`,
    (d) => `✅ All set!\n\nLooking for: ${v(d.propertyType)}\nArea: ${v(d.location)}\nBudget: ₹${v(d.minPrice)} - ₹${v(d.maxPrice)}\nBedrooms: ${v(d.bedrooms)}`,
    (d) => `🏠 We're finding your perfect home!\n\n${v(d.propertyType)} | ${v(d.propertyMode)}\n${v(d.location)} | ₹${v(d.minPrice)}-₹${v(d.maxPrice)}\n${v(d.bedrooms)} BHK | Floor: ${v(d.floorNo)}`,
  ],

  // ── Buyer Assistance Detail Actions ───────────────────────
  "upgrade-plan": [
    (d) => `⚠️ Upgrade your plan to view contacts!\n\n🆔 Ra ID: ${v(d.raId)}\n📍 ${v(d.location)}\n👨‍💼 Owner: ${v(d.ownerName)}\n\nUpgrade now for unlimited access!`,
    (d) => `Plan upgrade needed!\n\nYou tried to view contacts for Ra ID ${v(d.raId)} at ${v(d.location)}.\nOwner: ${v(d.ownerName)}\n\nUpgrade to connect!`,
    (d) => `To see ${v(d.ownerName)}'s contact, please upgrade your plan.\n\nRa ID: ${v(d.raId)} | ${v(d.location)}`,
    (d) => `💳 Upgrade for full access!\n\n${v(d.raId)} at ${v(d.location)}\nOwner: ${v(d.ownerName)}\n\nGet unlimited contact views.`,
    (d) => `Your plan doesn't include contact access.\n\nRa ID: ${v(d.raId)}\nArea: ${v(d.location)}\nOwner: ${v(d.ownerName)}\n\nUpgrade today!`,
    (d) => `Want to connect with ${v(d.ownerName)}? Upgrade!\n\n${v(d.raId)} at ${v(d.location)}`,
    (d) => `⚠️ Contact locked!\n\nRa ID: ${v(d.raId)} | ${v(d.location)}\nOwner: ${v(d.ownerName)}\n\nUpgrade your plan to unlock.`,
    (d) => `Upgrade required for contact view.\n\n${v(d.raId)} — ${v(d.location)}\nOwner: ${v(d.ownerName)}`,
    (d) => `To reach ${v(d.ownerName)} at ${v(d.location)}, you need to upgrade.\n\nRa ID: ${v(d.raId)}`,
    (d) => `💳 Unlock contacts!\n\nRa ID: ${v(d.raId)}\nLocation: ${v(d.location)}\nOwner: ${v(d.ownerName)}\n\nUpgrade now!`,
    (d) => `Plan limit reached.\n\nUpgrade to view: ${v(d.ownerName)} — ${v(d.raId)}\nArea: ${v(d.location)}`,
    (d) => `⚠️ Upgrade needed!\n\n${v(d.raId)} at ${v(d.location)}\nOwner: ${v(d.ownerName)}\n\nGet unlimited access today.`,
  ],

  "contact-view-user": [
    (d) => `✅ Tenant contact viewed!\n\n🆔 Ra ID: ${v(d.raId)}\n📍 ${v(d.location)}\n👨‍💼 Owner: ${v(d.ownerName)}\n📞 ${v(d.tenantPhone)}\n\nConnect now!`,
    (d) => `You viewed the tenant's contact.\n\nRa ID: ${v(d.raId)}\n${v(d.ownerName)} — ${v(d.tenantPhone)}\nArea: ${v(d.location)}`,
    (d) => `Contact unlocked!\n\n${v(d.raId)} | ${v(d.location)}\n${v(d.ownerName)}: ${v(d.tenantPhone)}`,
    (d) => `Here's the tenant info:\n\nRa ID: ${v(d.raId)}\nOwner: ${v(d.ownerName)}\nPhone: ${v(d.tenantPhone)}\nArea: ${v(d.location)}`,
    (d) => `📞 Contact ready!\n\n${v(d.ownerName)} — ${v(d.tenantPhone)}\n${v(d.raId)} at ${v(d.location)}`,
    (d) => `You now have ${v(d.ownerName)}'s number: ${v(d.tenantPhone)}\n\nRa ID: ${v(d.raId)} | ${v(d.location)}`,
    (d) => `Contact viewed!\n\n${v(d.raId)} — ${v(d.ownerName)} (${v(d.tenantPhone)})\nLocation: ${v(d.location)}`,
    (d) => `✅ ${v(d.ownerName)}'s contact: ${v(d.tenantPhone)}\n\nRa ID: ${v(d.raId)}\nArea: ${v(d.location)}`,
    (d) => `Tenant details:\n\n${v(d.ownerName)} | ${v(d.tenantPhone)}\n${v(d.raId)} at ${v(d.location)}`,
    (d) => `Viewed! Call ${v(d.ownerName)} at ${v(d.tenantPhone)}.\n\n${v(d.raId)} — ${v(d.location)}`,
    (d) => `📞 ${v(d.tenantPhone)} — ${v(d.ownerName)}\n\nRa ID: ${v(d.raId)} | ${v(d.location)}\n\nReach out anytime!`,
    (d) => `Contact access granted!\n\n${v(d.ownerName)}: ${v(d.tenantPhone)}\n${v(d.raId)} at ${v(d.location)}`,
  ],

  "contact-view-owner": [
    (d) => `👤 ${v(d.userName)} viewed your contact!\n\n🆔 Ra ID: ${v(d.raId)}\n📍 ${v(d.location)}\n\nBe ready for a call!`,
    (d) => `Someone viewed your contact info.\n\nRa ID: ${v(d.raId)}\nViewer: ${v(d.userName)}\nArea: ${v(d.location)}`,
    (d) => `${v(d.userName)} accessed your number for ${v(d.raId)} at ${v(d.location)}.`,
    (d) => `Contact viewed by ${v(d.userName)}!\n\nRa ID: ${v(d.raId)}\nLocation: ${v(d.location)}\n\nExpect an inquiry.`,
    (d) => `📞 ${v(d.userName)} looked up your contact.\n\n${v(d.raId)} | ${v(d.location)}`,
    (d) => `Your contact was viewed.\n\nBy: ${v(d.userName)}\nRa ID: ${v(d.raId)}\nArea: ${v(d.location)}`,
    (d) => `${v(d.userName)} wants to connect with you.\n\nRa ID: ${v(d.raId)} at ${v(d.location)}`,
    (d) => `Contact view alert!\n\n${v(d.userName)} — Ra ID: ${v(d.raId)}\nLocation: ${v(d.location)}`,
    (d) => `Someone's interested! ${v(d.userName)} viewed your number.\n\n${v(d.raId)} | ${v(d.location)}`,
    (d) => `Heads up! ${v(d.userName)} checked your contact for ${v(d.raId)}.`,
    (d) => `${v(d.userName)} viewed your details.\n\nRa ID: ${v(d.raId)}\nArea: ${v(d.location)}\n\nThey may call soon.`,
    (d) => `Contact access: ${v(d.userName)}\n\n${v(d.raId)} at ${v(d.location)}\n\nBe available!`,
  ],

  "buyer-interest-user": [
    (d) => `✅ Your interest has been sent!\n\n🆔 Ra ID: ${v(d.raId)}\n📍 ${v(d.location)}\n👨‍💼 Owner: ${v(d.ownerName)}\n📞 ${v(d.ownerPhone)}\n\nThe owner will be notified.`,
    (d) => `Interest sent to ${v(d.ownerName)}!\n\nRa ID: ${v(d.raId)} at ${v(d.location)}\n📞 ${v(d.ownerPhone)}`,
    (d) => `Done! The owner knows you're interested.\n\n${v(d.raId)} | ${v(d.location)}\n${v(d.ownerName)} — ${v(d.ownerPhone)}`,
    (d) => `Your interest was delivered.\n\nRa ID: ${v(d.raId)}\nOwner: ${v(d.ownerName)} (${v(d.ownerPhone)})\nArea: ${v(d.location)}`,
    (d) => `📤 Sent!\n\n${v(d.ownerName)} will know about your interest.\n${v(d.raId)} at ${v(d.location)}\n📞 ${v(d.ownerPhone)}`,
    (d) => `Interest submitted!\n\n${v(d.raId)} — ${v(d.location)}\nOwner: ${v(d.ownerName)} | ${v(d.ownerPhone)}`,
    (d) => `✅ Notified ${v(d.ownerName)} about your interest.\n\n${v(d.raId)} | ${v(d.location)}\nCall: ${v(d.ownerPhone)}`,
    (d) => `Interest registered!\n\nRa ID: ${v(d.raId)}\nLocation: ${v(d.location)}\nOwner: ${v(d.ownerName)}\nPhone: ${v(d.ownerPhone)}`,
    (d) => `Your interest in ${v(d.raId)} at ${v(d.location)} was shared with ${v(d.ownerName)}.`,
    (d) => `All done! Interest sent.\n\n${v(d.ownerName)} (${v(d.ownerPhone)})\n${v(d.raId)} at ${v(d.location)}`,
    (d) => `We told ${v(d.ownerName)} you're interested.\n\n${v(d.raId)} | ${v(d.location)} | ${v(d.ownerPhone)}`,
    (d) => `Interest delivered!\n\nRa ID: ${v(d.raId)}\n${v(d.location)}\n${v(d.ownerName)} — ${v(d.ownerPhone)}`,
  ],

  "buyer-interest-owner": [
    (d) => `⭐ ${v(d.userName)} is interested in your property!\n\n🆔 Ra ID: ${v(d.raId)}\n📍 ${v(d.location)}\n📞 ${v(d.userPhone)}\n\nPlease connect with them.`,
    (d) => `New interest!\n\n${v(d.userName)} (${v(d.userPhone)}) wants your property at ${v(d.location)}.\nRa ID: ${v(d.raId)}`,
    (d) => `A user is interested!\n\nRa ID: ${v(d.raId)}\nFrom: ${v(d.userName)}\nPhone: ${v(d.userPhone)}\nArea: ${v(d.location)}`,
    (d) => `${v(d.userName)} showed interest in ${v(d.raId)} at ${v(d.location)}.\n📞 ${v(d.userPhone)}`,
    (d) => `⭐ Interest received!\n\n${v(d.userName)} — ${v(d.userPhone)}\nRa ID: ${v(d.raId)} | ${v(d.location)}`,
    (d) => `Someone wants your property!\n\nUser: ${v(d.userName)}\nPhone: ${v(d.userPhone)}\nRa ID: ${v(d.raId)}\nArea: ${v(d.location)}`,
    (d) => `New lead!\n\n${v(d.userName)} is interested in ${v(d.raId)} at ${v(d.location)}.\nCall: ${v(d.userPhone)}`,
    (d) => `Interest alert!\n\n${v(d.userName)} (${v(d.userPhone)})\nProperty: ${v(d.raId)} | ${v(d.location)}`,
    (d) => `A user wants to rent!\n\nRa ID: ${v(d.raId)}\nUser: ${v(d.userName)} — ${v(d.userPhone)}\n${v(d.location)}`,
    (d) => `${v(d.userName)} expressed interest.\n\n${v(d.raId)} at ${v(d.location)}\n📞 ${v(d.userPhone)}\n\nConnect soon!`,
    (d) => `⭐ ${v(d.raId)} — New interest from ${v(d.userName)} (${v(d.userPhone)}).\nArea: ${v(d.location)}`,
    (d) => `Potential tenant alert!\n\n${v(d.userName)} — ${v(d.userPhone)}\n${v(d.raId)} | ${v(d.location)}`,
  ],

  "tenant-visit-user": [
    (d) => `✅ You're visiting the tenant!\n\n🆔 Ra ID: ${v(d.raId)}\n📍 ${v(d.location)}\n👨‍💼 Owner: ${v(d.ownerName)}\n📞 ${v(d.ownerPhone)}`,
    (d) => `Tenant visit logged!\n\nRa ID: ${v(d.raId)} at ${v(d.location)}\nOwner: ${v(d.ownerName)} (${v(d.ownerPhone)})`,
    (d) => `You visited ${v(d.raId)} at ${v(d.location)}.\n\nOwner: ${v(d.ownerName)} — ${v(d.ownerPhone)}`,
    (d) => `Visit recorded!\n\n${v(d.raId)} | ${v(d.location)}\n${v(d.ownerName)} (${v(d.ownerPhone)})`,
    (d) => `✅ Visiting ${v(d.ownerName)}'s property.\n\nRa ID: ${v(d.raId)} | ${v(d.location)}\n📞 ${v(d.ownerPhone)}`,
    (d) => `Logged your visit to ${v(d.raId)} at ${v(d.location)}.\nOwner: ${v(d.ownerName)} — ${v(d.ownerPhone)}`,
    (d) => `You're viewing the tenant listing!\n\n${v(d.raId)} — ${v(d.location)}\n${v(d.ownerName)} | ${v(d.ownerPhone)}`,
    (d) => `Visit noted!\n\nRa ID: ${v(d.raId)}\nArea: ${v(d.location)}\nOwner: ${v(d.ownerName)}\nPhone: ${v(d.ownerPhone)}`,
    (d) => `Tenant visit!\n\n${v(d.raId)} at ${v(d.location)}\n${v(d.ownerName)} — ${v(d.ownerPhone)}`,
    (d) => `You checked out ${v(d.ownerName)}'s listing.\n\n${v(d.raId)} | ${v(d.location)} | ${v(d.ownerPhone)}`,
    (d) => `✅ Visit logged for ${v(d.raId)}.\n\n${v(d.location)}\nOwner: ${v(d.ownerName)} (${v(d.ownerPhone)})`,
    (d) => `You visited a tenant listing!\n\nRa ID: ${v(d.raId)}\n${v(d.location)}\n${v(d.ownerName)} | ${v(d.ownerPhone)}`,
  ],

  "tenant-visit-owner": [
    (d) => `👤 ${v(d.userName)} visited your tenant listing!\n\n🆔 Ra ID: ${v(d.raId)}\n📍 ${v(d.location)}\n📞 ${v(d.userPhone)}`,
    (d) => `A user visited your listing.\n\nRa ID: ${v(d.raId)}\nVisitor: ${v(d.userName)} (${v(d.userPhone)})\nArea: ${v(d.location)}`,
    (d) => `${v(d.userName)} checked out ${v(d.raId)} at ${v(d.location)}.\n📞 ${v(d.userPhone)}`,
    (d) => `Visit alert!\n\n${v(d.userName)} viewed ${v(d.raId)} | ${v(d.location)}\nPhone: ${v(d.userPhone)}`,
    (d) => `Your listing got a visit!\n\nRa ID: ${v(d.raId)}\nBy: ${v(d.userName)}\nPhone: ${v(d.userPhone)}\nArea: ${v(d.location)}`,
    (d) => `${v(d.userName)} (${v(d.userPhone)}) visited your tenant listing ${v(d.raId)}.`,
    (d) => `New visitor!\n\n${v(d.userName)} — ${v(d.userPhone)}\n${v(d.raId)} at ${v(d.location)}`,
    (d) => `Someone viewed your listing!\n\nRa ID: ${v(d.raId)}\n${v(d.userName)} | ${v(d.userPhone)}\n${v(d.location)}`,
    (d) => `👁️ Visit from ${v(d.userName)}.\n\n${v(d.raId)} | ${v(d.location)}\n📞 ${v(d.userPhone)}`,
    (d) => `Your tenant listing ${v(d.raId)} was visited by ${v(d.userName)}.\nArea: ${v(d.location)}\nPhone: ${v(d.userPhone)}`,
    (d) => `Visitor alert!\n\n${v(d.userName)} (${v(d.userPhone)})\n${v(d.raId)} at ${v(d.location)}`,
    (d) => `${v(d.userName)} is interested in your listing at ${v(d.location)}.\n\n${v(d.raId)} | ${v(d.userPhone)}`,
  ],
};

// ─── Build Final Message ────────────────────────────────────────────────────

function buildMessage(category, data) {
  const templates = BODY_TEMPLATES[category];
  if (!templates || templates.length === 0) {
    console.error(`[Queue] No templates for category: ${category}`);
    return null;
  }

  const name = data.ownerName || data.userName || data.name || "there";
  const greeting = pickRandom(GREETINGS)(name);
  const body = pickRandom(templates)(data);
  const closing = pickRandom(CLOSINGS);

  return `${greeting}\n\n${body}\n\n${closing}`;
}

// ─── Queue Processor ────────────────────────────────────────────────────────

function startQueueProcessing() {
  if (isQueueProcessing) return;
  processNextInQueue();
}

function processNextInQueue() {
  if (messageQueue.length === 0) {
    isQueueProcessing = false;
    console.log(`[Queue] Empty — stopped. Sent last hour: ${sentLog.length}`);
    return;
  }

  isQueueProcessing = true;
  const delay = getRandomDelay();
  const next = messageQueue[0];

  console.log(`[Queue] Next [${next.category}] to ${next.to} in ${Math.round(delay / 1000)}s (${messageQueue.length} pending)`);

  queueTimer = setTimeout(async () => {
    if (messageQueue.length === 0) { isQueueProcessing = false; return; }

    const entry = messageQueue.shift();

    // Rate limit check
    if (!canSendTo(entry.to)) {
      entry.retries = (entry.retries || 0) + 1;
      if (entry.retries < QUEUE_CONFIG.MAX_RETRIES) {
        messageQueue.push(entry);
        console.log(`[Queue] Rate limited — re-queued [${entry.category}] to ${entry.to} (retry ${entry.retries})`);
      } else {
        console.log(`[Queue] Dropped [${entry.category}] to ${entry.to} after ${QUEUE_CONFIG.MAX_RETRIES} retries`);
      }
      processNextInQueue();
      return;
    }

    // Build message from template
    const message = buildMessage(entry.category, entry.data || {});
    if (!message) {
      console.error(`[Queue] Skipped [${entry.category}] — no template found`);
      processNextInQueue();
      return;
    }

    // Send
    try {
      await sendWhatsAppMessage(entry.to, message);
      sentLog.push({ to: entry.to, category: entry.category, sentAt: Date.now() });
      console.log(`[Queue] ✅ Sent [${entry.category}] to ${entry.to} (${messageQueue.length} left)`);
    } catch (err) {
      console.error(`[Queue] ❌ Failed [${entry.category}] to ${entry.to}:`, err.message);
      entry.retries = (entry.retries || 0) + 1;
      if (entry.retries < QUEUE_CONFIG.MAX_RETRIES) {
        messageQueue.push(entry);
        console.log(`[Queue] Re-queued (retry ${entry.retries})`);
      }
    }

    processNextInQueue();
  }, delay);
}

// Safety net cron — restart if stuck
cron.schedule("* * * * *", () => {
  if (messageQueue.length > 0 && !isQueueProcessing) {
    console.log(`[Queue Cron] ${messageQueue.length} pending — restarting`);
    startQueueProcessing();
  }
}, { timezone: "Asia/Kolkata" });

console.log("[Queue] Template-based message queue initialized (30-200s random delay, FIFO, no priority)");

// ─── Queue Routes ───────────────────────────────────────────────────────────

// Frontend calls: POST /queue-message { to, category, data: { ... } }
router.post("/queue-message", (req, res) => {
  try {
    const { to, category, data = {} } = req.body;

    if (!to || !category) {
      return res.status(400).json({ error: "Missing 'to' or 'category'" });
    }

    if (!BODY_TEMPLATES[category]) {
      return res.status(400).json({ error: `Unknown category: ${category}` });
    }

    // Dedup check
    if (isDuplicate(to, category)) {
      console.log(`[Queue] Duplicate skipped [${category}] to ${to}`);
      return res.json({ queued: false, skipped: true, reason: "duplicate" });
    }

    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      to,
      category,
      data,
      addedAt: Date.now(),
      retries: 0,
    };

    messageQueue.push(entry); // FIFO — always push to end
    console.log(`[Queue] Added [${category}] to ${to} (position: ${messageQueue.length})`);

    startQueueProcessing();

    res.json({
      queued: true,
      id: entry.id,
      position: messageQueue.length,
      pendingCount: messageQueue.length,
    });
  } catch (err) {
    console.error("[Queue] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Queue status
router.get("/queue-status", (req, res) => {
  trimSentLog();
  const cutoff = Date.now() - 60 * 60 * 1000;
  const recent = sentLog.filter(e => e.sentAt > cutoff);

  res.json({
    pending: messageQueue.length,
    isProcessing: isQueueProcessing,
    sentLastHour: recent.length,
    hourlyLimitRemaining: QUEUE_CONFIG.MAX_PER_HOUR - recent.length,
    config: QUEUE_CONFIG,
    queue: messageQueue.map(e => ({
      id: e.id, to: e.to, category: e.category,
      waitingSec: Math.round((Date.now() - e.addedAt) / 1000),
      retries: e.retries,
    })),
    recentSends: recent.map(e => ({
      to: e.to, category: e.category,
      agoSec: Math.round((Date.now() - e.sentAt) / 1000),
    })),
  });
});

// Emergency clear
router.delete("/queue-clear", (req, res) => {
  const cleared = messageQueue.length;
  messageQueue.length = 0;
  if (queueTimer) clearTimeout(queueTimer);
  isQueueProcessing = false;
  res.json({ success: true, cleared });
});

// Remove by phone
router.delete("/queue-remove/:phone", (req, res) => {
  const phone = req.params.phone;
  const before = messageQueue.length;
  for (let i = messageQueue.length - 1; i >= 0; i--) {
    if (messageQueue[i].to === phone) messageQueue.splice(i, 1);
  }
  res.json({ success: true, removed: before - messageQueue.length, remaining: messageQueue.length });
});

// List available categories (for debugging)
router.get("/queue-categories", (req, res) => {
  res.json({
    categories: Object.keys(BODY_TEMPLATES),
    templatesPerCategory: Object.fromEntries(
      Object.entries(BODY_TEMPLATES).map(([k, v]) => [k, v.length])
    ),
  });
});

export default router;
