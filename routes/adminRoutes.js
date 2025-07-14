const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { ensureAuth } = require("../middleware/auth");
const upload = adminController.upload.single("profileImage");

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

module.exports = router;
