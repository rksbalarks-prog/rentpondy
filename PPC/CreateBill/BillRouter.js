const express = require('express');
const router = express.Router();
const Bill = require('../CreateBill/BillModel');
const AddModel = require('../AddModel');
const PaymentPayU = require('../PayU/PayUModel');

// A bill counts as "Free" when EITHER its payment type or its plan name is Free
// (case-insensitive). The admin "Plan Name" dropdown now offers a "Free" option,
// so choosing the Free plan classifies the property as free even when a payment
// type is set. This is admin-only and never exposed on the user-side app.
const FREE_RE = /^\s*free\s*$/i;
const isFreeBill = (bill = {}) =>
  FREE_RE.test(String(bill.paymentType || '')) || FREE_RE.test(String(bill.planName || ''));

// ✅ Create Bill & Activate Property & Mark as Paid
router.post('/create-bill', async (req, res) => {
  try {
    const billData = req.body;

    // Identify request source
    const requestSource = req.headers['x-request-source'];
    billData.billCreatedBy = requestSource === 'system' ? 'Admin' : (billData.billCreatedBy || 'User');

    // ✅ Validate bill date (should be today or future)
    const inputDate = new Date(billData.billDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate < today) {
      return res.status(400).json({
        success: false,
        message: "Past dates are not accepted for the bill date. Please select today or a future date."
      });
    }

    // 1. Save the bill
    const newBill = new Bill(billData);
    await newBill.save();

    // 2. Activate the property using rentId
    const updatedProperty = await AddModel.findOneAndUpdate(
      { rentId: billData.rentId },
      { $set: { status: 'active' } },
      { new: true }
    );

    // 3. ✅ CREATE/UPDATE PaymentPayU record with status based on payment type / plan
    // A Free payment type OR a Free plan name marks the property as free.
    const paymentStatus = isFreeBill(billData) ? 'free' : 'paid';
    const paymentRecord = await PaymentPayU.findOneAndUpdate(
      { rentId: billData.rentId },
      {
        $set: {
          rentId: billData.rentId,
          payustatususer: paymentStatus,
          planName: billData.planName || 'N/A',
          payUdate: billData.billDate,
          amount: billData.netAmount?.toString() || 'N/A',
        }
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      success: true,
      message: "Bill created successfully, property activated, and payment status updated",
      data: {
        ...newBill._doc,
        status: updatedProperty?.status || 'N/A',
        paymentStatus: paymentStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// ✅ Get bill by rentId
router.get('/get-bill/:rentId', async (req, res) => {
  try {
    const { rentId } = req.params;
    const bill = await Bill.findOne({ rentId });

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }

    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// ✅ Update bill by rentId
router.put('/update-bill/:rentId', async (req, res) => {
  try {
    const { rentId } = req.params;
    const updateData = req.body;

    const updatedBill = await Bill.findOneAndUpdate(
      { rentId },
      updateData,
      { new: true }
    );

    if (!updatedBill) {
      return res.status(404).json({ success: false, message: 'Bill not found for update' });
    }

    // ✅ Also update PaymentPayU record to keep in sync
    if (updatedBill) {
      const paymentStatus = isFreeBill(updatedBill) ? 'free' : 'paid';
      await PaymentPayU.findOneAndUpdate(
        { rentId: parseInt(rentId) },
        {
          $set: {
            payustatususer: paymentStatus,
            planName: updatedBill.planName || 'N/A',
            payUdate: updatedBill.billDate,
            amount: updatedBill.netAmount?.toString() || 'N/A',
          }
        },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ success: true, message: 'Bill updated successfully', data: updatedBill });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// ✅ Get default values for creating bill
router.get('/get-default-bill-data', async (req, res) => {
  try {
    const lastBill = await Bill.findOne().sort({ createdAt: -1 });
    let nextBillNo = 'RP - 001';

    if (lastBill?.billNo) {
      const lastNumber = parseInt(lastBill.billNo.split('-')[1]?.trim() || '0', 10);
      const newNumber = (lastNumber + 1).toString().padStart(3, '0');
      nextBillNo = `RP - ${newNumber}`;
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    res.status(200).json({
      success: true,
      data: {
        adminOffice: 'AUROBINDO',
        billNo: nextBillNo,
        billDate: formattedDate,
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// ✅ Get all bills
router.get('/bills', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// ✅ Get bill by MongoDB _id
router.get('/bill/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }
    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// ✅ Filter: Free bills ONLY
router.get('/bills/free', async (req, res) => {
  try {
    const bills = await Bill.find({
      $or: [
        { paymentType: FREE_RE },
        { planName: FREE_RE },
      ]
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// ✅ Filter: Paid bills ONLY (NOT free) — neither payment type nor plan name is Free
router.get('/bills/non-free', async (req, res) => {
  try {
    const bills = await Bill.find({
      $and: [
        { paymentType: { $not: FREE_RE } },
        { planName: { $not: FREE_RE } },
      ]
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// ✅ Bulk Create Bills — ONE bill per property for a set of rentIds.  [ADDITIVE]
// Mirrors /create-bill (save bill, activate property, upsert payment) but applies
// the SAME bill details to every supplied property, generating a unique
// sequential billNo for each. Skips any property that already has a bill.
router.post('/create-bill-bulk', async (req, res) => {
  try {
    const { items, billData = {} } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No properties supplied for bulk bill.' });
    }
    if (items.length > 5000) {
      return res.status(400).json({ success: false, message: 'Too many properties in one bulk bill (max 5000).' });
    }

    // Validate bill date (today or future) — same rule as the single route.
    const inputDate = new Date(billData.billDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(inputDate.getTime()) || inputDate < today) {
      return res.status(400).json({ success: false, message: 'Past dates are not accepted for the bill date. Please select today or a future date.' });
    }

    const num = (v) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
    const shared = {
      adminOffice: billData.adminOffice,
      adminName: billData.adminName,
      billDate: billData.billDate,
      paymentType: billData.paymentType,
      planName: billData.planName,
      billAmount: num(billData.billAmount),
      validity: num(billData.validity),
      noOfAds: num(billData.noOfAds),
      featuredAmount: num(billData.featuredAmount),
      featuredValidity: num(billData.featuredValidity),
      featuredMaxAds: num(billData.featuredMaxAds),
      discount: num(billData.discount),
      netAmount: num(billData.netAmount),
      billCreatedBy: billData.billCreatedBy || 'Admin',
    };
    if (!shared.adminOffice || !shared.adminName || !shared.billDate || !shared.paymentType || !shared.planName) {
      return res.status(400).json({ success: false, message: 'Missing required bill fields (office, admin, date, payment type, plan).' });
    }

    // De-dupe rentIds and keep both string (Bill.rentId) and number (AddModel/Payment) forms.
    const map = new Map();
    for (const it of items) {
      const ridRaw = it && it.rentId;
      if (ridRaw === undefined || ridRaw === null || String(ridRaw).trim() === '') continue;
      const ridStr = String(ridRaw).trim();
      if (!map.has(ridStr)) map.set(ridStr, { ridNum: Number(ridStr), phone: it.phoneNumber ? String(it.phoneNumber) : '' });
    }
    const ridStrs = [...map.keys()];
    if (ridStrs.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid rentIds supplied.' });
    }

    // One bill per property: skip rentIds that already have a bill. Raw collection
    // so the city-scope plugin can't narrow the check.
    const existing = await Bill.collection.find({ rentId: { $in: ridStrs } }).toArray();
    const existingSet = new Set(existing.map(b => String(b.rentId)));

    // Sequential billNo continuing from the most recent bill (same scheme as single).
    const lastBill = await Bill.findOne().sort({ createdAt: -1 });
    let seq = lastBill?.billNo ? (parseInt(lastBill.billNo.split('-')[1]?.trim() || '0', 10) || 0) : 0;

    const billDocs = [];
    const activateNums = [];
    const paymentOps = [];
    const skipped = [];
    const paymentStatus = isFreeBill(shared) ? 'free' : 'paid';

    for (const ridStr of ridStrs) {
      if (existingSet.has(ridStr)) { skipped.push(ridStr); continue; }
      const { ridNum, phone } = map.get(ridStr);
      seq += 1;
      billDocs.push({
        ...shared,
        rentId: ridStr,
        ownerPhone: phone || '-',
        billNo: `RP - ${String(seq).padStart(3, '0')}`,
      });
      if (Number.isFinite(ridNum)) {
        activateNums.push(ridNum);
        paymentOps.push({
          updateOne: {
            filter: { rentId: ridNum },
            update: { $set: { rentId: ridNum, payustatususer: paymentStatus, planName: shared.planName || 'N/A', payUdate: shared.billDate, amount: String(shared.netAmount) } },
            upsert: true,
          },
        });
      }
    }

    let createdCount = 0;
    if (billDocs.length) {
      const inserted = await Bill.insertMany(billDocs, { ordered: false });
      createdCount = inserted.length;
      // Activate the billed properties (PreApproved/Pending -> Approved/active).
      if (activateNums.length) {
        await AddModel.updateMany({ rentId: { $in: activateNums } }, { $set: { status: 'active' } });
      }
      // Mark payment status for each.
      if (paymentOps.length) {
        await PaymentPayU.bulkWrite(paymentOps);
      }
    }

    return res.status(201).json({
      success: true,
      message: `Created ${createdCount} bill(s) and activated those properties; skipped ${skipped.length} that already had a bill.`,
      createdCount,
      skippedCount: skipped.length,
      totalRequested: ridStrs.length,
      skippedRentIds: skipped,
      fromBillNo: billDocs.length ? billDocs[0].billNo : null,
      toBillNo: billDocs.length ? billDocs[billDocs.length - 1].billNo : null,
    });
  } catch (error) {
    console.error('Bulk Create Bill Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during bulk bill creation.', error: error.message });
  }
});

module.exports = router;
