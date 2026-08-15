import axios from 'axios';

/**
 * Posts directly to PayU's hosted page for a "Stay Owners Plan" purchase.
 * Mirrors initiatePointsPayment.js but for the stay-listing subscription.
 */
export async function initiateStayPayment({
  phoneNumber,
  planId,
  planName,
  amount,
  maxListings,
  durationDays,
  featured,
  firstname = 'Owner',
  email,
}) {
  if (!phoneNumber || !planId || !amount) {
    throw new Error('Missing required payment fields (phone, plan, or amount).');
  }

  const ts = Date.now();
  const payload = {
    txnid: 'stay_' + ts,
    amount,
    productinfo: 'Stay Owners Plan',
    firstname,
    email: email || `owner${ts}@rentpondy.com`,
    phone: phoneNumber,
    planName,
    planId,
    maxListings,
    durationDays,
    featured,
    payustatususer: 'pay now',
  };

  // Reserve the plan on the backend before initiating PayU.
  await axios.post(`${process.env.REACT_APP_API_URL}/select-stay-plan`, {
    phoneNumber,
    planId,
    planName,
    amount,
  });

  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/payu/stay-payment`,
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
