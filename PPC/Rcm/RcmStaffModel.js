const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Staff account for the standalone "Call Management" feature
// (mounted at /process/dashboard/rp.wfh on the admin app).
// Kept separate from AdminLogin so the call-management login flow is
// not entangled with the main admin OTP login.
const RcmStaffSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true, trim: true, lowercase: true },
  password:     { type: String, required: true, minlength: 4 },
  plainPassword:{ type: String }, // mirror of AdminModel — kept for ops visibility
  role:         { type: String, enum: ['STAFF', 'ADMIN'], default: 'STAFF' },
  active:       { type: Boolean, default: true },
  tokens:       [{
    token:     { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
  lastLogin:    { type: Date },
}, { timestamps: true });

RcmStaffSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('RcmStaff', RcmStaffSchema);
