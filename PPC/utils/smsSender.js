// utils/smsSender.js
// SMS Idea (smsidea.co.in) sender used by the admin-login OTP flow
// (/admin-send-otp-login-rent). Re-enabled to support the SMS Idea admin path
// of the admin-controlled OTP provider switch. Uses the admin-login DLT template.
const axios = require('axios');

const SMS_BASE_URL = process.env.SMS_BASE_URL || 'https://www.smsidea.co.in';

async function sendOtpSms(mobile, otp, adminName) {
  const SMS_USERNAME = process.env.SMS_USERNAME;
  const SMS_PASSWORD = process.env.SMS_PASSWORD;
  const SMS_SENDER_ID = process.env.SMS_SENDER_ID;

  // NOTE: This text must match the DLT template registered under
  // DLT_TEMPLATE_ID_ADMIN_LOGIN exactly, or SMS Idea rejects the request.
  // Kept identical to the previously-used admin template.
  const message = `hi ${adminName} your Pondicherry Matrimony Admin Login OTP ${otp} for RP`;
  const smsUrl = `${SMS_BASE_URL}/smsstatuswithid.aspx`;

  const to = String(mobile).replace(/\D/g, '');
  const params = {
    mobile: SMS_USERNAME,
    pass: SMS_PASSWORD,
    senderid: SMS_SENDER_ID,
    to: to.startsWith('91') ? to : `91${to}`,
    msg: message,
    route: 1,
    msgtype: 'text',
    format: 'json',
    tempid: process.env.DLT_TEMPLATE_ID_ADMIN_LOGIN,
  };

  try {
    const response = await axios.get(smsUrl, { params });
    const data = response.data;

    if (typeof data === 'string' && data.includes('Message Id')) {
      return { success: true, message: `OTP sent successfully. ${data}` };
    }
    if (data && data.status && String(data.status).toLowerCase() === 'success') {
      return { success: true, message: `OTP sent successfully. Message ID: ${data.messageid}` };
    }
    return { success: false, message: `Failed to send OTP: ${JSON.stringify(data)}` };
  } catch (error) {
    return { success: false, message: `Error sending OTP: ${error.message}` };
  }
}

module.exports = { sendOtpSms };


// ===== Historical implementations kept for reference (do not use) =====
// // utils/smsSender.js
// const axios = require('axios');

// const SMS_BASE_URL = process.env.SMS_BASE_URL || 'https://www.smsidea.co.in';
// const SMS_USERNAME = process.env.SMS_USERNAME;
// const SMS_PASSWORD = process.env.SMS_PASSWORD;
// const SMS_SENDER_ID = process.env.SMS_SENDER_ID;

// async function sendOtpSms(mobile, otp) {
//         const message = `Your OTP is : ${otp} Thanks for using PPC Pondy`;

//   const smsUrl = `${SMS_BASE_URL}/smsstatuswithid.aspx`;
//  const params = {
//   mobile: SMS_USERNAME,
//   pass: SMS_PASSWORD,
//   senderid: SMS_SENDER_ID,
//   to: mobile.startsWith('91') ? mobile : `91${mobile}`,
//   msg: message,
//   route: 1,
//   msgtype: 'text',
//   format: 'json',
//   tempid: process.env.DLT_TEMPLATE_ID  // ✅ Add this line
// };

// console.log('Using template ID:', process.env.DLT_TEMPLATE_ID);

//   try {
//     const response = await axios.get(smsUrl, { params });
//     const data = response.data;

//     if (
//       typeof data === 'string' &&
//       data.includes('Message Id')
//     ) {
//       return { success: true, message: `OTP sent successfully. ${data}` };
//     }

//     // In case the API responds with JSON
//     if (data.status && data.status.toLowerCase() === 'success') {
//       return { success: true, message: `OTP sent successfully. Message ID: ${data.messageid}` };
//     }

//     return { success: false, message: `Failed to send OTP: ${JSON.stringify(data)}` };

//   } catch (error) {
//     return { success: false, message: `Error sending OTP: ${error.message}` };
//   }
// }

// module.exports = { sendOtpSms };


// *************************************************************************




























// ===== SMS IDEA (commented out — switching to Firebase). To revert: uncomment this whole block. =====
// const axios = require('axios');
//
// const SMS_BASE_URL = process.env.SMS_BASE_URL || 'https://www.smsidea.co.in';
// const SMS_USERNAME = process.env.SMS_USERNAME;
// const SMS_PASSWORD = process.env.SMS_PASSWORD;
// const SMS_SENDER_ID = process.env.SMS_SENDER_ID;
//
// async function sendOtpSms(mobile, otp, adminName) {
//   const message = `hi ${adminName} your Pondicherry Matrimony Admin Login OTP ${otp} for RP`;
//   const smsUrl = `${SMS_BASE_URL}/smsstatuswithid.aspx`;
//
//   const params = {
//     mobile: SMS_USERNAME,
//     pass: SMS_PASSWORD,
//     senderid: SMS_SENDER_ID,
//     to: mobile.startsWith('91') ? mobile : `91${mobile}`,
//     msg: message,
//     route: 1,
//     msgtype: 'text',
//     format: 'json',
//     tempid: process.env.DLT_TEMPLATE_ID_ADMIN_LOGIN
//   };
//
//   try {
//     const response = await axios.get(smsUrl, { params });
//     const data = response.data;
//
//     if (typeof data === 'string' && data.includes('Message Id')) {
//       return { success: true, message: `OTP sent successfully. ${data}` };
//     }
//
//     if (data.status && data.status.toLowerCase() === 'success') {
//       return { success: true, message: `OTP sent successfully. Message ID: ${data.messageid}` };
//     }
//
//     return { success: false, message: `Failed to send OTP: ${JSON.stringify(data)}` };
//
//   } catch (error) {
//     return { success: false, message: `Error sending OTP: ${error.message}` };
//   }
// }
//
// module.exports = { sendOtpSms };
// ===== END SMS IDEA =====





































































































































