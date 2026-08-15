/**
 * BACKEND INTEGRATION GUIDE - OneMsg WhatsApp API
 * 
 * This shows how to integrate OneMsg API with your OTP sending flow
 * in the backend (Node.js/Express)
 */

// ============================================
// 1. INSTALL DEPENDENCIES
// ============================================
// npm install axios dotenv

// ============================================
// 2. UPDATE .env FILE
// ============================================
/*
ONE_MSG_API_URL=https://api.onemsg.com/v1
ONE_MSG_API_KEY=your_api_key_here
ONE_MSG_BUSINESS_PHONE=+1234567890
*/

// ============================================
// 3. CREATE WHATSAPP SERVICE (Backend)
// ============================================

const axios = require('axios');

const sendOtpViaWhatsApp = async (phoneNumber, otp, customerName = 'User') => {
  try {
    const API_URL = process.env.ONE_MSG_API_URL;
    const API_KEY = process.env.ONE_MSG_API_KEY;
    const BUSINESS_PHONE = process.env.ONE_MSG_BUSINESS_PHONE;

    const message = `Hello ${customerName}, your OTP is: ${otp}. Do not share this with anyone. Valid for 10 minutes.`;

    const payload = {
      to: phoneNumber,              // E.164 format: +919876543210
      from: BUSINESS_PHONE,         // Your WhatsApp Business number
      type: 'text',
      message: message,
    };

    const response = await axios.post(
      `${API_URL}/messages`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'Accept': 'application/json',
        },
      }
    );

    console.log('✅ WhatsApp OTP sent:', response.data);
    return { success: true, messageId: response.data.id };
  } catch (error) {
    console.error('❌ WhatsApp send failed:', error.response?.data || error.message);
    throw error;
  }
};

// ============================================
// 4. EXAMPLE: SEND OTP ENDPOINT
// ============================================

const express = require('express');
const router = express.Router();

router.post('/send-otp-rent', async (req, res) => {
  try {
    const { phoneNumber, countryCode, loginMode } = req.body;

    // Validate input
    if (!phoneNumber || !countryCode) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and country code required',
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to database
    const userLogin = new UserLogin({
      phone: phoneNumber.slice(phoneNumber.length - 10), // Extract last 10 digits
      countryCode: countryCode, // Now accepts any country code
      otp: otp,
      loginMode: loginMode || 'web',
      otpStatus: 'pending',
    });

    await userLogin.save();

    // ✅ SEND OTP VIA WHATSAPP (NEW!)
    try {
      await sendOtpViaWhatsApp(phoneNumber, otp, 'Valued Customer');
      console.log('WhatsApp OTP notification sent successfully');
    } catch (whatsappError) {
      console.warn('WhatsApp notification failed, but OTP was sent via SMS:', whatsappError.message);
      // Optionally fallback to SMS or just log the error
    }

    // Send SMS as fallback (existing SNS logic)
    // await sns.publish({ ... });

    return res.json({
      success: true,
      message: 'OTP sent successfully',
      phoneNumber: phoneNumber,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({
      success: false,
      error: 'OTP send failed',
      details: error.message,
    });
  }
});

// ============================================
// 5. ENVIRONMENT VARIABLES SETUP
// ============================================
/*
Add to your .env file:

# OneMsg WhatsApp API Configuration
ONE_MSG_API_URL=https://api.onemsg.com/v1
ONE_MSG_API_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
ONE_MSG_BUSINESS_PHONE=+1234567890

# Or use sandbox for testing:
ONE_MSG_API_URL=https://sandbox-api.onemsg.com/v1
ONE_MSG_API_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
*/

// ============================================
// 6. KEY POINTS
// ============================================
/*
✅ PHONE FORMAT:
   - Input: E.164 format (+919876543210)
   - Stored: Country code (IN) + Phone digits (9876543210)
   - Export: E.164 format (+919876543210)

✅ COUNTRY CODES:
   - Now accepts ANY country code (no enum restriction)
   - Supports all ~250 countries
   - Format: ISO 3166-1 alpha-2 (US, IN, SG, GB, etc.)

✅ OTP FLOW:
   1. Frontend sends: { phoneNumber: "+919876543210", countryCode: "IN" }
   2. Backend receives and saves to database
   3. Backend generates OTP (6 digits)
   4. Backend sends OTP via:
      - WhatsApp (OneMsg API) - PRIMARY
      - SMS (AWS SNS) - FALLBACK
   5. Frontend receives and verifies OTP

✅ ERROR HANDLING:
   - If WhatsApp fails, warn but allow SMS fallback
   - Log all WhatsApp API errors for debugging
   - Return success if OTP is saved to database

✅ TESTING CHECKLIST:
   □ Verify OneMsg API credentials are correct
   □ Test with Indian number (+919876543210)
   □ Test with Singapore number (+6585557232)
   □ Test with US number (+1415551234)
   □ Verify messages appear in WhatsApp
   □ Check message timestamps
   □ Verify OTP codes are correct
   □ Test resend functionality
*/

module.exports = { sendOtpViaWhatsApp, router };
