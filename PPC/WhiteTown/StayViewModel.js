const mongoose = require("mongoose");

/**
 * Tracks UNIQUE (per-device) engagement with a "Place To Stay" tourist listing.
 *
 *   type "detail"  → the visitor opened the Stay Detail page
 *   type "contact" → the visitor tapped the "View Contact" button on that page
 *
 * One document per (propertyId + deviceId + type) so a repeat visit from the
 * same device does not inflate the count. `count` keeps the total visit tally
 * for reference, while the number of documents per (propertyId, type) gives the
 * unique-device count shown in the admin "Tourist Property Log".
 */
const stayViewSchema = new mongoose.Schema(
    {
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WhiteTown",
            index: true
        },
        propertyId: {
            type: String,            // e.g. EL1043
            required: true,
            index: true
        },
        deviceId: {
            type: String,
            required: true
        },
        // Phone number of the logged-in visitor who performed the action (if any)
        viewerPhoneNumber: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            enum: ["detail", "contact"],
            required: true
        },
        count: {
            type: Number,            // total visits from this device (informational)
            default: 1
        },
        lastViewedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

// A device counts once per stay per interaction type
stayViewSchema.index({ propertyId: 1, deviceId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("StayView", stayViewSchema);
