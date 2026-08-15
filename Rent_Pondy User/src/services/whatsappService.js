import axios from 'axios';

/**
 * OneMsg WhatsApp Integration Service
 * Sends WhatsApp notifications to users with OTP codes
 */

const ONE_MSG_API_URL = process.env.REACT_APP_ONE_MSG_API_URL || 'https://api.onemsg.com/v1'; // Update with actual API URL
const ONE_MSG_API_KEY = process.env.REACT_APP_ONE_MSG_API_KEY; // Set this in .env
const ONE_MSG_BUSINESS_PHONE = process.env.REACT_APP_ONE_MSG_BUSINESS_PHONE || '+1234567890'; // Your WhatsApp Business number

/**
 * Send OTP notification via WhatsApp using OneMsg API
 * @param {string} phoneNumber - Phone number in E.164 format (+919876543210)
 * @param {string} otp - OTP code to send
 * @param {string} customerName - Customer's name (optional)
 * @returns {Promise<object>} API response
 */
export const sendOtpWhatsApp = async (phoneNumber, otp, customerName = 'User') => {
  try {
    if (!ONE_MSG_API_KEY) {
      console.error('ONE_MSG_API_KEY is not configured in environment variables');
      throw new Error('WhatsApp API not configured');
    }

    const message = `Hello ${customerName}, your OTP is: ${otp}. Do not share this with anyone. Valid for 10 minutes.`;

    const payload = {
      to: phoneNumber,               // E.164 format: +919876543210
      from: ONE_MSG_BUSINESS_PHONE,  // Your WhatsApp Business number
      type: 'text',
      message: message,
    };

    const config = {
      method: 'post',
      url: `${ONE_MSG_API_URL}/messages`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ONE_MSG_API_KEY}`,
        'Accept': 'application/json',
      },
      data: payload,
    };

    const response = await axios(config);

    console.log('WhatsApp OTP sent successfully:', response.data);
    return {
      success: true,
      messageId: response.data?.id,
      status: response.data?.status,
      data: response.data,
    };
  } catch (error) {
    console.error('WhatsApp OTP send error:', error.response?.data || error.message);
    throw {
      success: false,
      error: error.response?.data?.error || error.message,
      details: error.response?.data,
    };
  }
};

/**
 * Send custom WhatsApp message via OneMsg API
 * @param {string} phoneNumber - Phone number in E.164 format
 * @param {string} message - Message text to send
 * @returns {Promise<object>} API response
 */
export const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    if (!ONE_MSG_API_KEY) {
      console.error('ONE_MSG_API_KEY is not configured');
      throw new Error('WhatsApp API not configured');
    }

    const payload = {
      to: phoneNumber,
      from: ONE_MSG_BUSINESS_PHONE,
      type: 'text',
      message: message,
    };

    const config = {
      method: 'post',
      url: `${ONE_MSG_API_URL}/messages`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ONE_MSG_API_KEY}`,
        'Accept': 'application/json',
      },
      data: payload,
    };

    const response = await axios(config);

    console.log('WhatsApp message sent successfully:', response.data);
    return {
      success: true,
      messageId: response.data?.id,
      status: response.data?.status,
      data: response.data,
    };
  } catch (error) {
    console.error('WhatsApp message send error:', error.response?.data || error.message);
    throw {
      success: false,
      error: error.response?.data?.error || error.message,
      details: error.response?.data,
    };
  }
};

/**
 * Send WhatsApp message with template (if using templates)
 * @param {string} phoneNumber - Phone number in E.164 format
 * @param {string} templateName - Template name registered with OneMsg
 * @param {array} parameters - Template parameters/variables
 * @returns {Promise<object>} API response
 */
export const sendWhatsAppTemplate = async (phoneNumber, templateName, parameters = []) => {
  try {
    if (!ONE_MSG_API_KEY) {
      console.error('ONE_MSG_API_KEY is not configured');
      throw new Error('WhatsApp API not configured');
    }

    const payload = {
      to: phoneNumber,
      from: ONE_MSG_BUSINESS_PHONE,
      type: 'template',
      template: {
        name: templateName,
        parameters: parameters,
      },
    };

    const config = {
      method: 'post',
      url: `${ONE_MSG_API_URL}/messages`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ONE_MSG_API_KEY}`,
        'Accept': 'application/json',
      },
      data: payload,
    };

    const response = await axios(config);

    console.log('WhatsApp template message sent successfully:', response.data);
    return {
      success: true,
      messageId: response.data?.id,
      status: response.data?.status,
      data: response.data,
    };
  } catch (error) {
    console.error('WhatsApp template send error:', error.response?.data || error.message);
    throw {
      success: false,
      error: error.response?.data?.error || error.message,
      details: error.response?.data,
    };
  }
};

/**
 * Check WhatsApp message delivery status
 * @param {string} messageId - Message ID returned from send API
 * @returns {Promise<object>} Message status
 */
export const getWhatsAppMessageStatus = async (messageId) => {
  try {
    if (!ONE_MSG_API_KEY) {
      throw new Error('WhatsApp API not configured');
    }

    const config = {
      method: 'get',
      url: `${ONE_MSG_API_URL}/messages/${messageId}`,
      headers: {
        'Authorization': `Bearer ${ONE_MSG_API_KEY}`,
        'Accept': 'application/json',
      },
    };

    const response = await axios(config);

    console.log('WhatsApp message status:', response.data);
    return {
      success: true,
      status: response.data?.status,
      data: response.data,
    };
  } catch (error) {
    console.error('WhatsApp status check error:', error.response?.data || error.message);
    throw {
      success: false,
      error: error.response?.data?.error || error.message,
      details: error.response?.data,
    };
  }
};

export default {
  sendOtpWhatsApp,
  sendWhatsAppMessage,
  sendWhatsAppTemplate,
  getWhatsAppMessageStatus,
};
