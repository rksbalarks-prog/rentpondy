const mongoose = require("mongoose");

/**
 * Admin-managed custom options for the "Place To Stay" form dropdowns.
 * Each document is one extra option for one category. These are merged with the
 * built-in defaults on the frontend, so the lists are never empty even with no docs.
 *
 * Categories: stayType | mealPlan | roomType | totalRooms | cancellationPolicy
 */
const stayDropdownSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    value: {
        type: String,
        required: true,
        trim: true
    },
    createdBy: {
        type: String,
        trim: true,
        default: "Admin"
    }
}, { timestamps: true });

// Prevent duplicate option within the same category
stayDropdownSchema.index({ category: 1, value: 1 }, { unique: true });

module.exports = mongoose.model("StayDropdown", stayDropdownSchema);
