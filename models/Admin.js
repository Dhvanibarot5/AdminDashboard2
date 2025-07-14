const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  profileImage: { type: String, default: '' },
  resetToken: String,
  resetTokenExpire: Date
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
