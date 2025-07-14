const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// GET Login
exports.getLogin = (req, res) => {
  res.render("login", { error: null });
};

// POST Login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.render("login", { error: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.render("login", { error: "Invalid email or password" });
  }

  req.session.admin = admin;
  res.redirect("/");
};

// GET Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

// GET Dashboard
exports.getDashboardPage = async (req, res) => {
  const admins = await Admin.find();
  res.render("dashboard", { admin: req.session.admin, admins });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
exports.upload = upload;

// CREATE Admin - Form
exports.createAdminForm = (req, res) => {
  res.render("create-admin");
};

// CREATE Admin - POST
exports.createAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await Admin.findOne({ email });
  if (existing) return res.send("Email already exists");

  const hash = await bcrypt.hash(password, 10);

  const profileImage = req.file ? req.file.path : "";
  await Admin.create({
    name,
    email,
    password: hash,
    profileImage,
  });
  res.redirect("/");
};

// EDIT Admin - Form
exports.editAdminForm = async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  res.render("edit-admin", { admin });
};

// UPDATE Admin
exports.updateAdmin = async (req, res) => {
  const { name, email } = req.body;
  const admin = await Admin.findById(req.params.id);
  admin.name = name;
  admin.email = email;

  if (req.file) {
    if (admin.profileImage) fs.unlinkSync(admin.profileImage);
    admin.profileImage = req.file.path;
  }

  await admin.save();
  res.redirect("/");
};

// DELETE Admin
exports.deleteAdmin = async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  if (admin.profileImage) fs.unlinkSync(admin.profileImage);
  await Admin.findByIdAndDelete(req.params.id);
  res.redirect("/");
};

exports.getDashboardPage = async (req, res) => {
  const search = (req.query.search || "").trim();

  const page = parseInt(req.query.page) || 1;
  const limit = 5;

  const query = search
    ? {
        $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
      }
    : {}; // Empty search returns all records

  try {
    const totalAdmins = await Admin.countDocuments(query);
    const admins = await Admin.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.render("dashboard", {
      admin: req.session.admin,
      admins,
      search,
      currentPage: page,
      totalPages: Math.ceil(totalAdmins / limit),
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).send("Server Error");
  }
};
