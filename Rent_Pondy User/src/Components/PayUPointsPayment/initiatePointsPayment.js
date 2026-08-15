import axios from 'axios';

/**
 * Skips the PayU points form and posts directly to PayU's hosted payment page.
 * Mirrors the "Pay Now" path inside PayUPointsForm.jsx so the intermediate
 * form can be bypassed on Buy Points flows.
 *
 * @param {Object} params
 * @param {string} params.phoneNumber
 * @param {string} params.planId
 * @param {string} params.planName
 * @param {number|string} params.amount
 * @param {number|string} params.points
 * @param {string} [params.firstname]
 * @param {string} [params.email]
 * @returns {Promise<void>}
 */
export async function initiatePointsPayment({
  phoneNumber,
  planId,
  planName,
  amount,
  points,
  firstname = 'User',
  email,
}) {
  if (!phoneNumber || !planId || !amount) {
    throw new Error('Missing required payment fields (phone, plan, or amount).');
  }

  const ts = Date.now();
  const payload = {
    txnid: 'points_' + ts,
    amount,
    productinfo: 'Points Plan',
    firstname,
    email: email || `user${ts}@rentpondy.com`,
    phone: phoneNumber,
    planName,
    planId,
    points,
    payustatususer: 'pay now',
    planType: 'points',
  };

  // Reserve the plan on the backend before initiating PayU.
  await axios.post(`${process.env.REACT_APP_API_URL}/select-points-plan`, {
    phoneNumber,
    planId,
    points,
    amount,
  });

  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/payu/points-payment`,
    payload
  );
  const payuData = response.data;

  // Auto-submit a hidden form to PayU's hosted checkout.
  const formElement = document.createElement('form');
  formElement.method = 'POST';
  formElement.action = 'https://secure.payu.in/_payment';

  Object.entries(payuData).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    formElement.appendChild(input);
  });

  document.body.appendChild(formElement);
  formElement.submit();
}
