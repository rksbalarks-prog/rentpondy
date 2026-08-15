// const express = require('express');
// const router = express.Router();
// const payuController = require('./payu.controller');
// const PaymentPayUBuyer = require('./PayuBuyerModel');
// const PricingPlans = require('../plans/PricingPlanModel');
// const AddModel = require('../AddModel');
// const BuyerPlan = require('../BuyerPlan/BuyerModel');  // adjust path as needed


// // Generic route generator for status without phone number filter
// const getAllPaymentsByStatus = (status) => async (req, res) => {
//   try {
//     const payments = await PaymentPayUBuyer.find({
//       payustatususer: status,
//     }).sort({ createdAt: -1 });

//     if (payments.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: `No payments with status '${status}' found.`,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       total: payments.length,
//       payments,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: `Error fetching payments with status '${status}'.`,
//       error: error.message,
//     });
//   }
// };

// const getPaymentsWithPlanByStatus = (status) => async (req, res) => {
//   try {
//     // Fetch payments by status
//     const payments = await PaymentPayUBuyer.find({ payustatususer: status, removed: { $ne: true } }).sort({ createdAt: -1 });
//     if (!payments.length) {
//       return res.status(404).json({ success: false, message: `No payments found for status '${status}'.` });
//     }

//     // Fetch all active buyer plans
//     const allPlans = await BuyerPlan.find({ status: 'active' });

//     // Utility: parse planValidity string to days (example: "30 days", "1 month")
//     const parseValidityToDays = (validityStr) => {
//       if (!validityStr) return 0;
//       const lower = validityStr.toLowerCase();
//       if (lower.includes('day')) return parseInt(validityStr) || 0;
//       if (lower.includes('month')) return (parseInt(validityStr) || 0) * 30;
//       // add more parsing logic as needed
//       return 0;
//     };

//     // Map plans by planName for quick lookup
//     const planMap = {};
//     allPlans.forEach(plan => {
//       planMap[plan.planName.toLowerCase()] = plan;
//     });

//     // Merge payments with corresponding plan details
//     const merged = payments.map(payment => {
//       const planNameKey = (payment.planName || '').toLowerCase();
//       const plan = planMap[planNameKey];

//       let expiryDate = null;
//       if (plan) {
//         const createdAt = plan.createDate || new Date();
//         const validityDays = parseValidityToDays(plan.planValidity);
//         const expDate = new Date(createdAt);
//         expDate.setDate(expDate.getDate() + validityDays);
//         expiryDate = expDate.toISOString().split('T')[0];
//       }

//       return {
//         ...payment.toObject(),
//         planDetails: plan ? {
//           planName: plan.planName,
//           planAmount: plan.planAmount,
//           planValidity: plan.planValidity,
//           numberOfAssistants: plan.numberOfAssistants,
//           serviceType: plan.serviceType,
//           createDate: plan.createDate,
//           expiryDate,
//           status: plan.status,
//           ba_id: plan.ba_id,
//         } : null,
//       };
//     });

//     return res.status(200).json({ success: true, total: merged.length, data: merged });
//   } catch (error) {
//     console.error(`Error fetching '${status}' payments with BuyerPlan usage:`, error);
//     return res.status(500).json({
//       success: false,
//       message: `Server error while fetching '${status}' payments with BuyerPlan usage.`,
//       error: error.message,
//     });
//   }
// };


// // Define routes without phoneNumber parameter
// router.get('/payments/pay-now-buyer', getAllPaymentsByStatus('pay now'));
// router.get('/payments/pay-later-buyer', getAllPaymentsByStatus('pay later'));
// router.get('/payments/paid-buyer', getAllPaymentsByStatus('paid'));
// router.get('/payments/pay-failed-buyer', getAllPaymentsByStatus('pay failed'));


// router.post('/payu/payment', payuController.createPaymentBuyer);
// router.post('/payu/payment-later-buyer', payuController.savePayLaterBuyer);
// router.post('/payu/success', payuController.handlePaymentSuccessBuyer);
// router.post('/payu/failure', payuController.handlePaymentFailureBuyer);

// router.get('/payu/payments/success', payuController.getSuccessfulPaymentsBuyer);
// router.get('/payu/payments/failure', payuController.getFailedPaymentsBuyer);


// // router.get('/user-plan-usage/:phone', payuController.getUserPlanUsage);
// // router.get('/payu/car-usage', payuController.getUsedAndRemainingCars);


// // Define routes without phoneNumber parameter
// router.get('/payments/pay-now', getAllPaymentsByStatus('pay now'));
// router.get('/payments/pay-later', getAllPaymentsByStatus('pay later'));
// router.get('/payments/paid', getAllPaymentsByStatus('paid'));
// router.get('/payments/pay-failed', getAllPaymentsByStatus('pay failed'));


// router.get('/payments-with-plan/pay-now', getPaymentsWithPlanByStatus('pay now'));
// router.get('/payments-with-plan/pay-later', getPaymentsWithPlanByStatus('pay later'));
// router.get('/payments-with-plan/paid', getPaymentsWithPlanByStatus('paid'));
// router.get('/payments-with-plan/pay-failed', getPaymentsWithPlanByStatus('pay failed'));


// module.exports = router;









const express = require('express');
const router = express.Router();
const payuBuyerController = require('./payu.buyer.controller');
const PaymentPayUBuyer = require('./PayuBuyerModel');
const BuyerPlan = require('../BuyerPlan/BuyerModel');  // adjust path if needed

// Generic route for payments by status
const getAllPaymentsByStatus = (status) => async (req, res) => {
  try {
    const payments = await PaymentPayUBuyer.find({ payustatususer: status, removed: { $ne: true } }).sort({ createdAt: -1 });
    if (!payments.length) {
      return res.status(404).json({ success: false, message: `No payments with status '${status}' found.` });
    }
    return res.status(200).json({ success: true, total: payments.length, payments });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Error fetching payments with status '${status}'.`, error: error.message });
  }
};

// More advanced route to get payments with attached plan info (example)
const getPaymentsWithPlanByStatus = (status) => async (req, res) => {
  try {
    const payments = await PaymentPayUBuyer.find({ payustatususer: status, removed: { $ne: true } }).sort({ createdAt: -1 });
    if (!payments.length) return res.status(404).json({ success: false, message: `No payments found for status '${status}'.` });

    const allPlans = await BuyerPlan.find({ status: 'active' });

    const planMap = {};
    allPlans.forEach(plan => {
      planMap[plan.planName.toLowerCase()] = plan;
    });

    const parseValidityToDays = (validityStr) => {
      if (!validityStr) return 0;
      const lower = validityStr.toLowerCase();
      if (lower.includes('day')) return parseInt(validityStr) || 0;
      if (lower.includes('month')) return (parseInt(validityStr) || 0) * 30;
      return 0;
    };

    const merged = payments.map(payment => {
      const plan = planMap[(payment.planName || '').toLowerCase()];
      let expiryDate = null;

      if (plan) {
        const createdAt = plan.createDate || new Date();
        const validityDays = parseValidityToDays(plan.planValidity);
        const expDate = new Date(createdAt);
        expDate.setDate(expDate.getDate() + validityDays);
        expiryDate = expDate.toISOString().split('T')[0];
      }

      return {
        ...payment.toObject(),
        planDetails: plan ? {
          planName: plan.planName,
          planAmount: plan.planAmount,
          planValidity: plan.planValidity,
          numberOfAssistants: plan.numberOfAssistants,
          serviceType: plan.serviceType,
          createDate: plan.createDate,
          expiryDate,
          status: plan.status,
          Ra_Id: plan.Ra_Id,
        } : null,
      };
    });

    return res.status(200).json({ success: true, total: merged.length, data: merged });
  } catch (error) {
    console.error(`Error fetching payments with plan for status '${status}':`, error);
    return res.status(500).json({ success: false, message: `Server error while fetching payments with plan.`, error: error.message });
  }
};

// Routes
router.get('/payments/pay-now-buyer', getAllPaymentsByStatus('pay now'));
router.get('/payments/pay-later-buyer', getAllPaymentsByStatus('pay later'));
router.get('/payments/paid-buyer', getAllPaymentsByStatus('paid'));
router.get('/payments/pay-failed-buyer', getAllPaymentsByStatus('pay failed'));

router.post('/payu/payment-buyer', payuBuyerController.createPaymentBuyer);
router.post('/payu/payment-later-buyer', payuBuyerController.savePayLaterBuyer);
router.post('/payu/success-buyer', payuBuyerController.handlePaymentSuccessBuyer);
router.post('/payu/failure-buyer', payuBuyerController.handlePaymentFailureBuyer);

router.get('/payu/success-buyer', payuBuyerController.handlePaymentSuccessBuyer);
router.get('/payu/failure-buyer', payuBuyerController.handlePaymentFailureBuyer);

router.get('/payu/payments/success-buyer', payuBuyerController.getSuccessfulPaymentsBuyer);
router.get('/payu/payments/failure-buyer', payuBuyerController.getFailedPaymentsBuyer);

router.get('/payments-with-plan/pay-now-buyer', getPaymentsWithPlanByStatus('pay now'));
router.get('/payments-with-plan/pay-later-buyer', getPaymentsWithPlanByStatus('pay later'));
router.get('/payments-with-plan/paid-buyer', getPaymentsWithPlanByStatus('paid'));
router.get('/payments-with-plan/pay-failed-buyer', getPaymentsWithPlanByStatus('pay failed'));

// Soft-delete a single PayU buyer payment row by _id (used by the
// Tenant Assistant Paid Failed / Pay Now / Pay Later admin tables).
// The row is not erased — it moves to the "Removed Payu" page under the
// Tenant Account submenu where it can be restored.
router.delete('/payu-buyer-payment/:id', async (req, res) => {
  try {
    const updated = await PaymentPayUBuyer.findByIdAndUpdate(
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

// Restore a soft-deleted PayU buyer payment row (called from the Removed Payu page).
router.post('/payu-buyer-payment/:id/restore', async (req, res) => {
  try {
    const updated = await PaymentPayUBuyer.findByIdAndUpdate(
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

// List every soft-deleted PayU buyer payment with attached plan info, newest first.
router.get('/payu-buyer-removed', async (req, res) => {
  try {
    const payments = await PaymentPayUBuyer.find({ removed: true }).sort({ removedAt: -1, createdAt: -1 });
    if (!payments.length) {
      return res.status(200).json({ success: true, total: 0, data: [] });
    }

    const allPlans = await BuyerPlan.find({ status: 'active' });
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
          planAmount: plan.planAmount,
          planValidity: plan.planValidity,
          numberOfAssistants: plan.numberOfAssistants,
          serviceType: plan.serviceType,
        } : null,
      };
    });

    return res.status(200).json({ success: true, total: merged.length, data: merged });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while fetching removed payments.', error: error.message });
  }
});

module.exports = router;
