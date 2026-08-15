// ============================================================
// PayUStayRouter.js
// Routes PayU stay-plan purchase traffic to the controller.
// Mounted at /PPC.
// ============================================================

const express = require('express');
const router = express.Router();
const ctrl = require('./PayUStayController');

router.post('/payu/stay-payment', ctrl.createStayPayment);
router.post('/payu/stay-payment-later', ctrl.saveStayPayLater);

// PayU sends POST on success/failure redirects; also accept GET.
router.post('/payu/stay-success', ctrl.handleStayPaymentSuccess);
router.get('/payu/stay-success', ctrl.handleStayPaymentSuccess);
router.post('/payu/stay-failure', ctrl.handleStayPaymentFailure);
router.get('/payu/stay-failure', ctrl.handleStayPaymentFailure);

// Admin/support debug listings
router.get('/payu/stay-payments/pay-now', ctrl.getStayPaymentsByStatus('pay now'));
router.get('/payu/stay-payments/pay-later', ctrl.getStayPaymentsByStatus('pay later'));
router.get('/payu/stay-payments/paid', ctrl.getStayPaymentsByStatus('paid'));
router.get('/payu/stay-payments/pay-failed', ctrl.getStayPaymentsByStatus('pay failed'));

router.delete('/payu/stay-payments/:id', ctrl.deleteStayPayment);

module.exports = router;
