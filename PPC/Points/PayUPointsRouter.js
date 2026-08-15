// ============================================================
// PayUPointsRouter.js
// Routes PayU points-purchase traffic to the controller.
// Mounted at /PPC.
// ============================================================

const express = require('express');
const router = express.Router();
const ctrl = require('./PayUPointsController');

router.post('/payu/points-payment', ctrl.createPointsPayment);
router.post('/payu/points-payment-later', ctrl.savePointsPayLater);

// PayU sends POST on success/failure redirects; also accept GET
// so returning users reloading the redirect URL do not 404.
router.post('/payu/points-success', ctrl.handlePointsPaymentSuccess);
router.get('/payu/points-success',  ctrl.handlePointsPaymentSuccess);
router.post('/payu/points-failure', ctrl.handlePointsPaymentFailure);
router.get('/payu/points-failure',  ctrl.handlePointsPaymentFailure);

// Admin/support debug listings
router.get('/payu/points-payments/pay-now',   ctrl.getPointsPaymentsByStatus('pay now'));
router.get('/payu/points-payments/pay-later', ctrl.getPointsPaymentsByStatus('pay later'));
router.get('/payu/points-payments/paid',      ctrl.getPointsPaymentsByStatus('paid'));
router.get('/payu/points-payments/pay-failed',ctrl.getPointsPaymentsByStatus('pay failed'));

// Delete a single record (admin). Paid records are protected in the controller.
router.delete('/payu/points-payments/:id', ctrl.deletePointsPayment);

module.exports = router;
