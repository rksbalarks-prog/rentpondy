const mongoose = require('mongoose');

/**
 * Singleton setting that controls whether the "other products" popup is shown
 * to users after they log in (Rent Pondy user app). A fixed `key` keeps it to a
 * single document so admins toggle one on/off switch.
 */
const loginPopupSettingSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'loginPopup', unique: true },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LoginPopupSetting', loginPopupSettingSchema);
