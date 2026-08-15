const express = require("express");
const router = express.Router();
const { RoleAccess, ALL_PERMISSIONS } = require("./RoleAccessModel");

// --- GET all permissions list (metadata) -------------------------------------
router.get("/permissions", (req, res) => {
  try {
    res.status(200).json({
      success: true,
      permissions: ALL_PERMISSIONS,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- GET all roles ------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const roles = await RoleAccess.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, roles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- GET single role by ID ----------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const role = await RoleAccess.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }
    res.status(200).json({ success: true, role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- GET role by name (used when admin logs in to fetch their permissions) ----
router.get("/by-name/:roleName", async (req, res) => {
  try {
    const role = await RoleAccess.findOne({
      roleName: req.params.roleName,
      isActive: true,
    });
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }
    res.status(200).json({ success: true, role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- CREATE new role ----------------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const { roleName, description, permissions, createdBy } = req.body;

    if (!roleName) {
      return res.status(400).json({ success: false, message: "Role name is required" });
    }

    // Validate permissions against allowed keys
    const allowedKeys = ALL_PERMISSIONS.map((p) => p.key);
    const validPermissions = (permissions || []).filter((p) =>
      allowedKeys.includes(p)
    );

    const existing = await RoleAccess.findOne({ roleName: roleName.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Role name already exists" });
    }

    const role = new RoleAccess({
      roleName: roleName.trim(),
      description: description || "",
      permissions: validPermissions,
      createdBy: createdBy || "admin",
    });

    await role.save();
    res.status(201).json({ success: true, message: "Role created successfully", role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- UPDATE role --------------------------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const { roleName, description, permissions, isActive } = req.body;

    const role = await RoleAccess.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    // Check duplicate name (excluding self)
    if (roleName && roleName.trim() !== role.roleName) {
      const existing = await RoleAccess.findOne({ roleName: roleName.trim() });
      if (existing) {
        return res.status(409).json({ success: false, message: "Role name already exists" });
      }
    }

    // Validate permissions
    const allowedKeys = ALL_PERMISSIONS.map((p) => p.key);
    const validPermissions = (permissions || []).filter((p) =>
      allowedKeys.includes(p)
    );

    role.roleName = roleName ? roleName.trim() : role.roleName;
    role.description = description !== undefined ? description : role.description;
    role.permissions = validPermissions;
    if (isActive !== undefined) role.isActive = isActive;

    await role.save();
    res.status(200).json({ success: true, message: "Role updated successfully", role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- TOGGLE role active status ------------------------------------------------
router.patch("/:id/toggle", async (req, res) => {
  try {
    const role = await RoleAccess.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }
    role.isActive = !role.isActive;
    await role.save();
    res.status(200).json({
      success: true,
      message: `Role ${role.isActive ? "activated" : "deactivated"} successfully`,
      role,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- DELETE role --------------------------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const role = await RoleAccess.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }
    res.status(200).json({ success: true, message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- DUPLICATE a role ---------------------------------------------------------
router.post("/:id/duplicate", async (req, res) => {
  try {
    const source = await RoleAccess.findById(req.params.id);
    if (!source) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    const newRole = new RoleAccess({
      roleName: `${source.roleName} (Copy)`,
      description: source.description,
      permissions: [...source.permissions],
      createdBy: req.body.createdBy || "admin",
    });

    await newRole.save();
    res.status(201).json({ success: true, message: "Role duplicated successfully", role: newRole });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
