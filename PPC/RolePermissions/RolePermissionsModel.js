const mongoose = require('mongoose');

const rolePermissionsSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    viewedFiles: {
        type: [String],
        default: [],
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    }
});

const RolePermissions = mongoose.model('RolePermissions', rolePermissionsSchema);

module.exports = RolePermissions;
