const express = require('express');
const router = express.Router();
const LoginPopupSetting = require('./LoginPopupSettingModel');

const SETTING_KEY = 'loginPopup';

// Read the setting, creating the default (enabled) document on first access.
async function getOrCreateSetting() {
  let doc = await LoginPopupSetting.findOne({ key: SETTING_KEY });
  if (!doc) {
    doc = await LoginPopupSetting.create({ key: SETTING_KEY, enabled: true });
  }
  return doc;
}

// 🔹 GET: current on/off state of the post-login "other products" popup.
//    Used by the user app to decide whether to show the popup, and by the
//    admin control page to render the toggle.
router.get('/login-popup-setting', async (req, res) => {
  try {
    const doc = await getOrCreateSetting();
    res.status(200).json({ success: true, enabled: doc.enabled });
  } catch (error) {
    console.error('Get login-popup-setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch login popup setting',
      error: error.message,
    });
  }
});

// 🔸 PUT: turn the popup on/off. Body: { enabled: boolean }.
router.put('/login-popup-setting', async (req, res) => {
  try {
    const { enabled } = req.body;
    const doc = await LoginPopupSetting.findOneAndUpdate(
      { key: SETTING_KEY },
      { $set: { enabled: !!enabled } },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, enabled: doc.enabled });
  } catch (error) {
    console.error('Update login-popup-setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update login popup setting',
      error: error.message,
    });
  }
});

module.exports = router;
