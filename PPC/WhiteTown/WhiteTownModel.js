const mongoose = require("mongoose");

/**
 * "Place To Stay" — tourist accommodation listing (Guest House / Resort / Homestay etc.)
 * Modeled on Agoda / Booking-style stay listings rather than long-term rental property.
 */
const whiteTownSchema = new mongoose.Schema({
    propertyId: {
        type: String,
        unique: true,
        sparse: true,
        index: true
    },

    createdBy: {
        type: String,
        trim: true
    },

    // ───────────────── Basic stay info ─────────────────
    stayName: {
        type: String,
        required: true,
        trim: true
    },

    // External website / booking link for the stay
    websiteLink: {
        type: String,
        trim: true
    },

    // Admin-managed via the "Dropdown change" screen, so no fixed enum
    stayType: {
        type: String,
        required: true,
        trim: true
    },

    starRating: {
        type: Number,
        min: 1,
        max: 5
    },

    description: {
        type: String,
        trim: true
    },

    // ───────────────── Location ─────────────────
    streetName: {
        type: String,
        required: true,
        trim: true
    },

    location: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    city: {
        type: String,
        trim: true,
        default: "Pondicherry"
    },

    landmark: {
        type: String,
        trim: true
    },

    pincode: {
        type: String,
        required: true,
        trim: true,
        match: /^[0-9]{6}$/
    },

    url: {
        type: String,
        trim: true
    },

    // ───────────────── Pricing / tariff (per night) ─────────────────
    // Kept for backward compatibility (user-facing "from" price); populated from priceMin
    pricePerNight: {
        type: Number,
        min: 0
    },

    // Price range per night (min–max)
    priceMin: {
        type: Number,
        min: 0
    },

    priceMax: {
        type: Number,
        min: 0
    },

    weekendPrice: {
        type: Number,
        min: 0
    },

    extraGuestCharge: {
        type: Number,
        min: 0
    },

    // Whether the quoted tariff includes taxes
    taxType: {
        type: String,
        enum: ["Tax Included", "Tax Excluded"],
        default: "Tax Excluded"
    },

    taxesPercent: {
        type: Number,
        min: 0,
        max: 100
    },

    mealPlan: {
        type: String,
        trim: true,
        default: "Room Only"
    },

    // ───────────────── Capacity ─────────────────
    totalRooms: {
        type: Number,
        min: 0
    },

    maxGuests: {
        type: Number,
        min: 1
    },

    bedrooms: {
        type: Number,
        min: 0
    },

    bathrooms: {
        type: Number,
        min: 0
    },

    roomTypes: [{
        type: String,
        trim: true
    }],

    // ───────────────── Timings ─────────────────
    checkInTime: {
        type: String,
        default: "01:00 PM"
    },

    checkOutTime: {
        type: String,
        default: "11:00 AM"
    },

    // ───────────────── Amenities & policies ─────────────────
    amenities: [{
        type: String,
        trim: true
    }],

    // Highlighted features kept as separate Yes/No selectors (not part of amenities)
    swimmingPool: {
        type: String,
        trim: true
    },

    carPark: {
        type: String,
        trim: true
    },

    beachView: {
        type: String,
        trim: true
    },

    coupleFriendly: {
        type: Boolean,
        default: false
    },

    cancellationPolicy: {
        type: String,
        trim: true,
        default: "Free Cancellation"
    },

    houseRules: {
        type: String,
        trim: true
    },

    nearbyAttractions: {
        type: String,
        trim: true
    },

    // ───────────────── Contact ─────────────────
    phoneNumber: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },

    alternateNumber: {
        type: String,
        trim: true
    },

    whatsappNumber: {
        type: String,
        trim: true
    },

    maskedPhoneNumber: {
        type: String
    },

    // ───────────────── Media ─────────────────
    images: [{
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String  // For Cloudinary or similar services
        },
        caption: {
            type: String
        }
    }],

    videos: [{
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String  // For Cloudinary or similar services
        },
        caption: {
            type: String
        }
    }],

    isHidden: {
        type: Boolean,
        default: true,
        index: true
    },

    remarks: [{
        text: { type: String, trim: true },
        adminName: { type: String, default: 'Admin' },
        date: { type: Date, default: Date.now }
    }]

}, { timestamps: true });

module.exports = mongoose.model("WhiteTown", whiteTownSchema);
