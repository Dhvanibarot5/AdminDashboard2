const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Admin = require("../models/Admin");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const email = "admin@example.com";
  const password = "admin123";
  const name = "Super Admin";

  const exists = await Admin.findOne({ email });
  if (exists) {
    console.log("⚠️ Admin already exists.");
    return process.exit();
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await Admin.create({
    name,
    email,
    password: hashedPassword,
    isActive: true,
  });

  console.log("✅ Admin created successfully!");
  console.log("📧 Email:", email);
  console.log("🔐 Password:", password);
  process.exit();
});
