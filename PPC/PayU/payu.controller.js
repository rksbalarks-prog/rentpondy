const crypto = require('crypto');
const PaymentPayU = require('./PayUModel');
const PricingPlans = require('../plans/PricingPlanModel');
const AddModel = require('../AddModel');

const MERCHANT_KEY = '4t4TYq';
const SALT = 'fo4y9bmHxvV9Stt5LbIEWRbhdybPfPz0';

/* ==============================================================
   STEP 1: CREATE PAYMENT (PAY NOW)
============================================================== */
exports.createPayment = async (req, res) => {
  try {
    const {
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      payustatususer,
      planName,
      rentId,
    } = req.body;

    if (payustatususer !== 'pay now') {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const hashString =
      `${MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${SALT}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    await PaymentPayU.create({
      txnid,
      status: 'process',
      amount,
      productinfo,
      firstname,
      email,
      phone,
      payustatususer,
      planName,
      rentId,                // ?? VERY IMPORTANT
      payUdate: new Date(),
    });

    res.json({
      key: MERCHANT_KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl: 'https://rentpondy.com/PPC/PPC/payu/success',
      furl: 'https://rentpondy.com/PPC/PPC/payu/failure',
      service_provider: 'payu_paisa',
      hash,
    });

  } catch (err) {
    console.error('CREATE PAYMENT ERROR:', err);
    res.status(500).json({ error: 'Payment creation failed' });
  }
};


/* ==============================================================
   STEP 2: PAY LATER
============================================================== */
exports.savePayLater = async (req, res) => {
  try {
    const {
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      payustatususer,
      planName,
      rentId,
    } = req.body;

    if (payustatususer !== 'pay later') {
      return res.status(400).json({ error: 'Invalid pay later request' });
    }

    await PaymentPayU.create({
      txnid,
      status: 'pending',
      amount,
      productinfo,
      firstname,
      email,
      phone,
      payustatususer,
      planName,
      rentId,
      payUdate: new Date(),
    });

    res.json({ message: 'Pay later saved successfully' });

  } catch (err) {
    console.error('PAY LATER ERROR:', err);
    res.status(500).json({ error: 'Pay later failed' });
  }
};


/* ==============================================================
   STEP 3: PAYMENT SUCCESS (FIXED + AUTO ACTIVATE PROPERTY)
============================================================== */
exports.handlePaymentSuccess = async (req, res) => {
  try {
    const {
      txnid,
      status,
      amount,
      firstname,
      email,
      phone,
      mihpayid,
      planName,
    } = req.body;

    // ? PayU must confirm success
    if (status !== 'success') {
      return res.redirect('https://rentpondy.com/payment-failure');
    }

    // 1?? Find payment from DB
    const payment = await PaymentPayU.findOne({ txnid });

    if (!payment) {
      console.error('Payment not found for txnid:', txnid);
      return res.redirect('https://rentpondy.com/payment-failure');
    }

    // ?? Prevent duplicate callback processing
    if (payment.status === 'success') {
      return res.redirect('https://rentpondy.com/payment-success');
    }

    const payUdate = new Date();

    // 2?? Update payment record
    await PaymentPayU.updateOne(
      { _id: payment._id },
      {
        status: 'success',
        payustatususer: 'paid',
        mihpayid,
        payUdate,
        planName: planName || payment.planName,
      }
    );

    // 3?? AUTO ACTIVATE PROPERTY (IMPORTANT FIX)
    if (payment.rentId) {
      await AddModel.updateOne(
        { rentId: payment.rentId },
        {
          status: 'active',           // ? PROPERTY LIVE
          paymentStatus: 'paid',
          payustatususer: 'paid',
          isApproved: true,
          approvedBy: 'system',
          approvedAt: new Date(),
        }
      );
    } else {
      console.error('rentId missing in payment record:', payment);
    }

    // 4?? Redirect user to success page
    return res.redirect(
      `https://rentpondy.com/payment-success` +
      `?txnid=${txnid}` +
      `&firstname=${firstname}` +
      `&status=active` +
      `&amount=${amount}` +
      `&email=${email}` +
      `&phone=${phone}` +
      `&mihpayid=${mihpayid}` +
      `&planName=${planName || payment.planName}`
    );

  } catch (err) {
    console.error('PAYMENT SUCCESS ERROR:', err);
    return res.redirect('https://rentpondy.com/payment-failure');
  }
};


/* ==============================================================
   STEP 4: PAYMENT FAILURE
============================================================== */
exports.handlePaymentFailure = async (req, res) => {
  try {
    const {
      txnid,
      status,
      amount,
      firstname,
      email,
      phone,
      mihpayid,
      planName,
    } = req.body;

    const payUdate = new Date();

    await PaymentPayU.findOneAndUpdate(
      { txnid },
      {
        status: 'failure',
        payustatususer: 'pay failed',
        mihpayid,
        payUdate,
        planName,
      }
    );

    return res.redirect(
      `https://rentpondy.com/payment-failure` +
      `?txnid=${txnid}` +
      `&firstname=${firstname}` +
      `&status=${status}` +
      `&amount=${amount}` +
      `&email=${email}` +
      `&phone=${phone}` +
      `&mihpayid=${mihpayid}` +
      `&planName=${planName}`
    );

  } catch (err) {
    console.error('PAYMENT FAILURE ERROR:', err);
    res.status(500).json({ error: 'Payment failure failed' });
  }
};


/* ==============================================================
   STEP 5: SUCCESS PAYMENTS LIST
============================================================== */
exports.getSuccessfulPayments = async (req, res) => {
  const payments = await PaymentPayU.find({ status: 'success' }).sort({ createdAt: -1 });
  res.json(payments);
};


/* ==============================================================
   STEP 6: FAILED PAYMENTS LIST
============================================================== */
exports.getFailedPayments = async (req, res) => {
  const payments = await PaymentPayU.find({ status: 'failure' }).sort({ createdAt: -1 });
  res.json(payments);
};


/* ==============================================================
   STEP 7: USER PLAN USAGE
============================================================== */
exports.getUserPlanUsage = async (req, res) => {
  try {
    const { phone } = req.params;

    const payment = await PaymentPayU.findOne({
      phone,
      status: 'success',
      payustatususer: 'paid',
    }).sort({ createdAt: -1 });

    if (!payment) {
      return res.status(404).json({ message: 'No active paid plan' });
    }

    const plan = await PricingPlans.findOne({ name: payment.planName });
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const properties = await AddModel.find({
      phoneNumber: phone,
      status: { $in: ['approved', 'active', 'complete'] },
    });

    res.json({
      phone,
      planName: plan.name,
      totalCars: plan.numOfCars || 0,
      usedCars: properties.length,
      remainingCars: Math.max((plan.numOfCars || 0) - properties.length, 0),
      postedRentIds: properties.map(p => p.rentId),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


/* ==============================================================
   STEP 8: USED & REMAINING CARS
============================================================== */
exports.getUsedAndRemainingCars = async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ message: 'Phone required' });

    const payment = await PaymentPayU.findOne({
      phone,
      status: 'success',
      payustatususer: 'paid',
    }).sort({ createdAt: -1 });

    if (!payment) {
      return res.status(404).json({ message: 'No successful payment' });
    }

    const plan = await PricingPlans.findOne({ name: payment.planName });
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const usedCars = await AddModel.countDocuments({
      phoneNumber: phone,
      status: { $in: ['approved', 'active', 'complete'] },
    });

    res.json({
      phone,
      planName: plan.name,
      totalCarsAllowed: plan.numOfCars || 0,
      usedCars,
      remainingCars: Math.max((plan.numOfCars || 0) - usedCars, 0),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
