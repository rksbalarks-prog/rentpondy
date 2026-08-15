const express = require('express');
const router = express.Router();
const RolePermissions = require('../RolePermissions/RolePermissionsModel');

// Get all role permissions
router.get('/get-role-permissions', async (req, res) => {
    try {
        const permissions = await RolePermissions.find();
        res.json(permissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update permissions for a specific role
router.post('/update-role-permissions', async (req, res) => {
    const { role, viewedFiles } = req.body;

    if (!role) {
        return res.status(400).json({ message: 'Role is required' });
    }

    try {
        // Find or create the role permissions document
        let rolePermissions = await RolePermissions.findOne({ 
            role: role.toLowerCase() 
        });

        if (!rolePermissions) {
            // Create new if doesn't exist
            rolePermissions = new RolePermissions({
                role: role.toLowerCase(),
                viewedFiles: viewedFiles || [],
            });
        } else {
            // Update existing
            rolePermissions.viewedFiles = viewedFiles || [];
            rolePermissions.updatedDate = new Date();
        }

        const updatedPermissions = await rolePermissions.save();
        res.json(updatedPermissions);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
