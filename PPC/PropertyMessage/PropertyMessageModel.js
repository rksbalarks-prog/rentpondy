const mongoose = require('mongoose');

const PropertyMessageSchema = new mongoose.Schema({
rentId: {
  type: Number,
  required: true,
  index: true,
  unique: true,
},


  // Option 1: Admin can choose from predefined list
  enumMessage: {
    type: String,
    enum: ['Sold Out', 'Waiting', 'Available', 'Coming Soon', 'Under Process', 'Blocked', 'Other'],
    default: null,
  },

  // Option 2: Admin can write a custom message
  customMessage: {
    type: String,
    default: null,
    trim: true,
  },

  setBy: {
    type: String,
    default: 'Admin',
  },

  setAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// ✅ Custom validation: Either enumMessage or customMessage must be provided
PropertyMessageSchema.pre('validate', function (next) {
  if (!this.enumMessage && !this.customMessage) {
    return next(new Error('Either enumMessage or customMessage must be provided'));
  }
  next();
});

module.exports = mongoose.model('PropertyMessage', PropertyMessageSchema);
