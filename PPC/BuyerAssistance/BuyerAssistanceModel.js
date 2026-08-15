// const mongoose = require("mongoose");

// const BuyerAssistanceSchema = new mongoose.Schema({
//   Ra_Id: { type: Number, required: true,  
//  },
//   raName: { type: String },
//   rentId: { type: String },
//   phoneNumber: { type: String },
//   altPhoneNumber: { type: String },
//   city: { type: String },
//   area: { type: String },
//   loanInput: { type: String },
//   minPrice: { type: String },
//   maxPrice: { type: String },
//   rentType: { type: String },
//   floorNo: { type: String },
//   totalArea: { type: String },
//   bedrooms: { type: String },
//   propertyMode: { type: String },
//   propertyType: { type: String },
//   requirementType:{type : String},
//   state: { type: String },
//   interestedUserPhone: { type: [String] },
//   ra_status: {
//     type: String,
//     enum: ["rent-assistance-interest", "rent-interest-tried", "raActive", "raPending","raExpired"],
//     default: "raPending",
//   },
//   ra_postBy: { type: String, enum: ["User", "Admin"], default: "User" },
//   familyMembers: { type: String },
//   foodHabit: { type: String },
//   jobType: { type: String },
//   petAllowed: { type:String}, 
//   paymentType: { type: String },
//   description: String,
//   isDeleted: { type: Boolean, default: false },
//   deletedAt: { type: Date, default: null },
// }, { timestamps: true });

// module.exports = mongoose.model("BuyerAssistance", BuyerAssistanceSchema);














const mongoose = require("mongoose");

const BuyerAssistanceSchema = new mongoose.Schema({
  Ra_Id: { type: Number, required: true,  
 },
  raName: { type: String },
  tenantName: { type: String },
  rentId: { type: String },
  phoneNumber: { type: String },
  altPhoneNumber: { type: String },
  city: { type: String },
  area: { type: String },
  pinCode: { type: String },
  loanInput: { type: String },
  minPrice: { type: String },
  maxPrice: { type: String },
  rentType: { type: String },
  floorNo: { type: String },
  totalArea: { type: String },
  facing: { type: String },
  areaUnit: { type: String },
  bedrooms: { type: String },
  propertyMode: { type: String },
  propertyType: { type: String },
  requirementType:{type : String},
  Whatsappstatus: {
    type: String,
    enum: ["Send", "Not Send", "Pending"],
    default: "Not Send"
  },
  state: { type: String },
  interestedUserPhone: { type: [String] },
  ra_status: {
    type: String,
    enum: ["rent-assistance-interest", "rent-interest-tried", "raActive", "raPending","raExpired"],
    default: "raPending",
  },
  ra_postBy: { type: String, enum: ["User", "Admin"], default: "User" },
  familyMembers: { type: String },
  foodHabit: { type: String },
  jobType: { type: String },
  petAllowed: { type:String}, 
  paymentType: { type: String },
  description: String,
  // Logged-in admin who created the assistance from the admin panel.
  // Empty string when posted directly by the user (ra_postBy = "User").
  addedBy: { type: String, default: '' },
  // ✅ City base: 'PY' = Pondicherry, 'CH' = Chennai.
  // Default 'PY' (platform launched in Pondicherry); legacy documents
  // without this field are treated as 'PY' by the base filter.
  base: {
    type: String,
    enum: ['PY', 'CH'],
    default: 'PY'
  },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

// City-base scope: every list/count/aggregate query is auto-filtered to the
// request's active base (ALL/PY/CH). See utils/cityScopePlugin.js.
BuyerAssistanceSchema.plugin(require('../utils/cityScopePlugin'));

module.exports = mongoose.model("BuyerAssistance", BuyerAssistanceSchema);







