const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Admin = require("../models/Admin");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const email = "admin@example.com"; // Replace with correct email from DB
  const newPassword = "newsecurepassword123";

  const admin = await Admin.findOne({ email });
  if (!admin) {
    console.log("❌ Admin not found.");
    return process.exit();
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  admin.password = hashedPassword;
  await admin.save();

  console.log("✅ Password reset successfully!");
  console.log("📧 Email:", email);
  console.log("🔐 New Password:", newPassword);
  process.exit();
});
