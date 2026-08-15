


const mongoose = require("mongoose");

const UserViewsSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
  planName: { type: String}, // Add plan association

    dailyViewsCount: { type: Number, default: 0 },
    lastViewDate: { type: Date, default: null },
    contactLimitPerDay:{ type: Number, default: 30 },
        viewLimitPerDay: { type: Number, default: 30 }, // Admin can update this
planLimitPerDay:{type: Number},
contactedProperties: [
  {
    rentId: Number,
    contactedAt: { type: Date, default: Date.now },
  },
],

    viewedProperties: [
      {
        rentId: { type: Number },
        viewerPhoneNumber: { type: String },
        propertyOwnerPhoneNumber: { type: String },
        viewedAt: { type: Date, default: Date.now },
        photos: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserViews", UserViewsSchema);






// const mongoose = require("mongoose");

// const UserViewsSchema = new mongoose.Schema(
//   {
//     phoneNumber: { type: String, required: true, unique: true },
//   planName: { type: String, default: "FREE" }, // Add plan association

//     dailyViewsCount: { type: Number, default: 0 },
//     lastViewDate: { type: Date, default: null },
//         viewLimitPerDay: { type: Number, default: 30 }, // Admin can update this
// planLimitPerDay:{type: Number},
//     viewedProperties: [
//       {
//         rentId: { type: Number },
//         viewerPhoneNumber: { type: String },
//         propertyOwnerPhoneNumber: { type: String },
//         viewedAt: { type: Date, default: Date.now },
//         photos: { type: String },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("UserViews", UserViewsSchema);
