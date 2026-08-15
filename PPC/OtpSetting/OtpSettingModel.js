const mongoose = require('mongoose');

/**
 * Singleton setting that controls which OTP provider is active for login.
 * Two independent targets:
 *   - userProvider  : provider used by the Rent Pondy user app login.
 *   - adminProvider : provider used by the admin panel login.
 * Each can be 'smsidea' (server-side SMS gateway) or 'firebase' (client-side
 * Firebase Phone Auth). A fixed `key` keeps this to a single document so admins
 * change one record. Defaults to 'smsidea' to preserve current behaviour.
 */
const OTP_PROVIDERS = ['smsidea', 'firebase'];

const otpSettingSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'otpSetting', unique: true },
    userProvider: { type: String, enum: OTP_PROVIDERS, default: 'smsidea' },
    adminProvider: { type: String, enum: OTP_PROVIDERS, default: 'smsidea' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OtpSetting', otpSettingSchema);
module.exports.OTP_PROVIDERS = OTP_PROVIDERS;
