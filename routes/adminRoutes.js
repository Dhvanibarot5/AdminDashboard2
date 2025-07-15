const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { ensureAuth } = require("../middleware/auth");
const upload = adminController.upload.single("profileImage");
const Admin = require("../models/Admin");

// Auth
router.get("/login", adminController.getLogin);
router.post("/login", adminController.postLogin);
router.get("/logout", adminController.logout);

// Admin CRUD
router.get("/admin/create", adminController.createAdminForm);
router.post("/admin/create", upload, adminController.createAdmin);
router.get("/admin/edit/:id", ensureAuth, adminController.editAdminForm);
router.post("/admin/edit/:id", ensureAuth, upload, adminController.updateAdmin);
router.get("/admin/delete/:id", ensureAuth, adminController.deleteAdmin);

// Dashboard
router.get("/", ensureAuth, adminController.getDashboardPage);
// router.get("/", ensureAuth, adminController.getDashboard);

// Active/Inactive Admin
router.post("/admin/toggle-status/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).send("Admin not found");

    admin.isActive = !admin.isActive;
    await admin.save();

  } catch (error) {
    console.error("Toggle Status Error:", error);
    res.status(500).send("Server Error");
  }
});

router.post("/admin/delete/:id", async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    req.flash("successMessage", "Admin deleted successfully.");
    res.redirect("/");
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
