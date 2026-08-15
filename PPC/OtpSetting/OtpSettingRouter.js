const express = require('express');
const router = express.Router();
const OtpSetting = require('./OtpSettingModel');

const SETTING_KEY = 'otpSetting';
const OTP_PROVIDERS = OtpSetting.OTP_PROVIDERS; // ['smsidea', 'firebase']

// Read the setting, creating the default ('smsidea' for both) on first access.
async function getOrCreateSetting() {
  let doc = await OtpSetting.findOne({ key: SETTING_KEY });
  if (!doc) {
    doc = await OtpSetting.create({ key: SETTING_KEY });
  }
  return doc;
}

// 🔹 GET: current OTP provider for the user app and the admin panel.
//    Used by the user app (WebLogin) and admin login (Admin.jsx) to decide
//    which flow to run, and by the admin control page to render the dropdowns.
router.get('/otp-setting', async (req, res) => {
  try {
    const doc = await getOrCreateSetting();
    res.status(200).json({
      success: true,
      userProvider: doc.userProvider,
      adminProvider: doc.adminProvider,
    });
  } catch (error) {
    console.error('Get otp-setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch OTP setting',
      error: error.message,
    });
  }
});

// 🔸 PUT: change the provider for either/both targets.
//    Body: { userProvider?: 'smsidea'|'firebase', adminProvider?: 'smsidea'|'firebase' }.
//    Only the provided fields are updated; each is validated against the enum.
router.put('/otp-setting', async (req, res) => {
  try {
    const { userProvider, adminProvider } = req.body;
    const update = {};

    if (userProvider !== undefined) {
      if (!OTP_PROVIDERS.includes(userProvider)) {
        return res.status(400).json({
          success: false,
          message: `userProvider must be one of: ${OTP_PROVIDERS.join(', ')}`,
        });
      }
      update.userProvider = userProvider;
    }

    if (adminProvider !== undefined) {
      if (!OTP_PROVIDERS.includes(adminProvider)) {
        return res.status(400).json({
          success: false,
          message: `adminProvider must be one of: ${OTP_PROVIDERS.join(', ')}`,
        });
      }
      update.adminProvider = adminProvider;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Provide at least one of userProvider or adminProvider',
      });
    }

    const doc = await OtpSetting.findOneAndUpdate(
      { key: SETTING_KEY },
      { $set: update },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      userProvider: doc.userProvider,
      adminProvider: doc.adminProvider,
    });
  } catch (error) {
    console.error('Update otp-setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update OTP setting',
      error: error.message,
    });
  }
});

module.exports = router;
