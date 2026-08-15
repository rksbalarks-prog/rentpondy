



// const mongoose = require("mongoose");

// const TextSchema = new mongoose.Schema({
//   type: { type: String, required: true },
//   content: { type: String, required: true },
//   updatedAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("TextModel", TextSchema);





// models/TextModel.js
const mongoose = require("mongoose");

const TextSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, unique: true, trim: true },
    content: { type: String, required: true }
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// optional explicit index (helps uniqueness)
TextSchema.index({ type: 1 }, { unique: true });

module.exports = mongoose.model("TextModel", TextSchema);
