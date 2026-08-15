const express = require('express');
const router = express.Router();
const moment = require('moment');

const payuController = require('./payu.controller');
const PaymentPayU = require('./PayUModel');
const PricingPlans = require('../plans/PricingPlanModel');
const AddModel = require('../AddModel');



// Generic handler to get payments by status (no plan info)
// Soft-deleted rows (`removed: true`) are hidden — they live on the
// new "Removed Payu" page instead.
const getAllPaymentsByStatus = (status) => async (req, res) => {
  try {
    const payments = await PaymentPayU.find({ payustatususer: status, removed: { $ne: true } }).sort({ createdAt: -1 });

    if (!payments.length) {
      return res.status(404).json({
        success: false,
        message: `No payments with status '${status}' found.`,
      });
    }

    res.status(200).json({
      success: true,
      total: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error fetching payments with status '${status}'.`,
      error: error.message,
    });
  }
};


const getPaymentsWithPlanByStatus = (status) => async (req, res) => {
  try {
    const payments = await PaymentPayU.find({ payustatususer: status, removed: { $ne: true } }).sort({ createdAt: -1 });
    if (!payments.length) {
      return res.status(404).json({ success: false, message: `No payments found for status '${status}'.` });
    }

    const allPlans = await PricingPlans.find();

    const plansWithUsage = await Promise.all(
      allPlans.map(async (plan) => {
        const rawPhone = Array.isArray(plan.phoneNumber) ? plan.phoneNumber[0] : plan.phoneNumber || '';
        const normalizedPhone = rawPhone.replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '').trim();

        const usedCars = await AddModel.countDocuments({
          phoneNumber: new RegExp(normalizedPhone + '$'),
          isDeleted: false,
        });

        const remainingCars = (plan.numOfCars || 0) - usedCars;
        const createdAt = new Date(plan.createdAt);
        const expiryDate = new Date(createdAt);
        expiryDate.setDate(createdAt.getDate() + (plan.durationDays || 0));

        return {
          phone: normalizedPhone,
          planName: plan.name?.toLowerCase() || '',
          details: {
            planName: plan.name,
            packageType: plan.packageType,
            durationDays: plan.durationDays || 0,
            numOfCars: plan.numOfCars || 0,
            usedCars,
            remainingCars: remainingCars < 0 ? 0 : remainingCars,
            price: plan.price || 0,
            featuredMaxCar: plan.featuredMaxCar || 0,
            featuredAds: plan.featuredAds || 0,
            createdAt: plan.createdAt,
            expiryDate: expiryDate.toISOString().split('T')[0],
          },
        };
      })
    );

    const merged = payments.map((payment) => {
      const normalizedPhone = (payment.phone || '').replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '').trim();
      const matchedPlan = plansWithUsage.find(
        (p) =>
          p.phone === normalizedPhone &&
          p.planName === (payment.planName || '').toLowerCase()
      );

      return {
        ...payment.toObject(),
        planDetails: matchedPlan ? matchedPlan.details : null,
      };
    });

    res.status(200).json({ success: true, total: merged.length, data: merged });
  } catch (error) {
    console.error(`Error fetching '${status}' payments with plan usage:`, error);
    res.status(500).json({
      success: false,
      message: `Server error while fetching '${status}' payments with plan usage.`,
      error: error.message,
    });
  }
};



// Define routes without phoneNumber parameter
router.get('/payments/pay-now', getAllPaymentsByStatus('pay now'));
router.get('/payments/pay-later', getAllPaymentsByStatus('pay later'));
router.get('/payments/paid', getAllPaymentsByStatus('paid'));
router.get('/payments/pay-failed', getAllPaymentsByStatus('pay failed'));


router.post('/payu/payment', payuController.createPayment);
router.post('/payu/payment-later', payuController.savePayLater);
router.post('/payu/success', payuController.handlePaymentSuccess);
router.post('/payu/failure', payuController.handlePaymentFailure);

router.get('/payu/success', payuController.handlePaymentSuccess);
router.get('/payu/failure', payuController.handlePaymentFailure);

router.get('/payu/payments/success', payuController.getSuccessfulPayments);
router.get('/payu/payments/failure', payuController.getFailedPayments);


router.get('/user-plan-usage/:phone', payuController.getUserPlanUsage);
router.get('/payu/car-usage', payuController.getUsedAndRemainingCars);


// Define routes without phoneNumber parameter
// router.get('/payments/pay-now', getAllPaymentsByStatus('pay now'));
// router.get('/payments/pay-later', getAllPaymentsByStatus('pay later'));
// router.get('/payments/paid', getAllPaymentsByStatus('paid'));
// router.get('/payments/pay-failed', getAllPaymentsByStatus('pay failed'));


router.get('/payments-with-plan/pay-now', getPaymentsWithPlanByStatus('pay now'));
router.get('/payments-with-plan/pay-later', getPaymentsWithPlanByStatus('pay later'));
router.get('/payments-with-plan/paid', getPaymentsWithPlanByStatus('paid'));
router.get('/payments-with-plan/pay-failed', getPaymentsWithPlanByStatus('pay failed'));

// Soft-delete a single PayU payment row by _id (used by the
// Payment Paid Failed / Pay Now / Pay Later admin tables). The row is
// not erased — it is moved to the "Removed Payu" page where it can be
// restored.
router.delete('/payu-payment/:id', async (req, res) => {
  try {
    const updated = await PaymentPayU.findByIdAndUpdate(
      req.params.id,
      { $set: { removed: true, removedAt: new Date() } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    return res.status(200).json({ success: true, message: 'Payment moved to Removed Payu', _id: req.params.id });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while removing payment.', error: error.message });
  }
});

// Restore a soft-deleted PayU payment row (called from the Removed Payu page).
router.post('/payu-payment/:id/restore', async (req, res) => {
  try {
    const updated = await PaymentPayU.findByIdAndUpdate(
      req.params.id,
      { $set: { removed: false, removedAt: null } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    return res.status(200).json({ success: true, message: 'Payment restored', _id: req.params.id });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while restoring payment.', error: error.message });
  }
});

// List every soft-deleted PayU payment with attached plan info, newest first.
router.get('/payu-removed', async (req, res) => {
  try {
    const payments = await PaymentPayU.find({ removed: true }).sort({ removedAt: -1, createdAt: -1 });
    if (!payments.length) {
      return res.status(200).json({ success: true, total: 0, data: [] });
    }

    const allPlans = await PricingPlans.find();
    const planMap = {};
    allPlans.forEach((plan) => {
      const key = (plan.planName || '').toLowerCase();
      if (key) planMap[key] = plan;
    });

    const merged = payments.map((payment) => {
      const plan = planMap[(payment.planName || '').toLowerCase()];
      return {
        ...payment.toObject(),
        planDetails: plan ? {
          planName: plan.planName,
          packageType: plan.packageType,
          price: plan.price,
          durationDays: plan.durationDays,
        } : null,
      };
    });

    return res.status(200).json({ success: true, total: merged.length, data: merged });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while fetching removed payments.', error: error.message });
  }
});





// Combined API for all payment statuses
router.get("/payments/summary", async (req, res) => {
  try {
    const { day } = req.query;

    let startDate, endDate;

    if (day === "today") {
      startDate = moment().startOf("day").toDate();
      endDate = moment().endOf("day").toDate();
    } else if (day === "yesterday") {
      startDate = moment().subtract(1, "day").startOf("day").toDate();
      endDate = moment().subtract(1, "day").endOf("day").toDate();
    }

    const query = day
      ? { createdAt: { $gte: startDate, $lte: endDate } }
      : {};

    const statuses = ["pay now", "pay later", "paid", "pay failed"];

    const summary = {};

    for (const status of statuses) {
      const payments = await PaymentPayU.find({
        payustatususer: status,
        ...query,
      }).sort({ createdAt: -1 });

      summary[status] = {
        count: payments.length,
        data: payments,
      };
    }

    res.status(200).json({
      success: true,
      day: day || "all",
      total: statuses.reduce((sum, s) => sum + summary[s].count, 0),
      summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching payment summary.",
      error: error.message,
    });
  }
});





// router.get("/payments/summary-data", async (req, res) => {
//   try {
//     let startDate, endDate;

//     // --- Handle date range query ---
//     if (req.query.dates) {
//       const parts = req.query.dates.split(",");
//       if (parts.length !== 2) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid format. Use ?dates=YYYY-MM-DD,YYYY-MM-DD"
//         });
//       }
//       startDate = moment(parts[0], "YYYY-MM-DD").startOf("day").toDate();
//       endDate = moment(parts[1], "YYYY-MM-DD").endOf("day").toDate();
//     }
//     // --- Handle single day query ---
//     else if (req.query.day) {
//       if (req.query.day === "today") {
//         startDate = moment().startOf("day").toDate();
//         endDate = moment().endOf("day").toDate();
//       } else if (req.query.day === "yesterday") {
//         startDate = moment().subtract(1, "day").startOf("day").toDate();
//         endDate = moment().subtract(1, "day").endOf("day").toDate();
//       } else {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid day. Use 'today', 'yesterday', or dates param."
//         });
//       }
//     }
//     // --- Default: all data ---
//     else {
//       startDate = null;
//       endDate = null;
//     }

//     const dateFilter = startDate && endDate
//       ? { createdAt: { $gte: startDate, $lte: endDate } }
//       : {};

//     const statuses = ["pay now", "pay later", "paid", "pay failed"];
//     const summary = {};

//     for (const status of statuses) {
//       const payments = await PaymentPayU.find({
//         payustatususer: status,
//         ...dateFilter
//       }).sort({ createdAt: -1 });

//       summary[status] = {
//         count: payments.length,
//         data: payments
//       };
//     }

//     res.status(200).json({
//       success: true,
//       dateRange: startDate && endDate ? { startDate, endDate } : "all",
//       total: statuses.reduce((sum, s) => sum + summary[s].count, 0),
//       summary
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching payment summary.",
//       error: error.message
//     });
//   }
// });




module.exports = router; 