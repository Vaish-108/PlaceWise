const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const College = require("../models/College");

const getBackendUrl = () =>
  process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

const normalizeEmail = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
};

const removeFileIfExists = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Failed to remove old admin profile photo:", error.message);
  }
};

// ===============================
// REGISTER ADMIN
// ===============================

const registerAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      collegeCode,
      designation,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !collegeCode) {
      return res.status(400).json({
        message: "Name, email, password, and collegeCode are required",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    const existingStudent = await Student.findOne({ email: normalizedEmail });

    if (existingAdmin || existingStudent) {
      return res.status(409).json({
        message: "Email is already registered. Please login using this account or use a different email.",
      });
    }

    const collegeDoc = await College.findOne({ code: collegeCode.toLowerCase().trim() });

    if (!collegeDoc) {
      return res.status(400).json({
        message: "Invalid college code",
      });
    }

    if (!collegeDoc.isActive) {
      return res.status(403).json({
        message: "College is inactive",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const newAdmin = await Admin.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || "",
      college: collegeDoc.name || "",
      collegeId: collegeDoc._id,
      designation: designation || "Placement Administrator",
      role: "admin",
    });

    // Remove password from response
    const adminResponse = newAdmin.toObject();
    delete adminResponse.password;

    return res.status(201).json({
      message: "Admin Registered Successfully",
      admin: adminResponse,
    });
  } catch (error) {
    console.error("ADMIN REGISTER ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// ===============================
// LOGIN ADMIN
// ===============================

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    // Find admin
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return res.status(400).json({
        message: "Admin not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: admin._id,
        role: "admin",
        collegeId: admin.collegeId,
        college: admin.college,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    return res.status(200).json({
      message: "Admin Login Successful",
      token,
      admin: adminResponse,
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// ===============================
// GET ADMIN PROFILE
// ===============================

const getAdminProfile = async (req, res) => {
  try {
    // adminAuthMiddleware should attach
    // the authenticated admin to req.admin

    const admin = await Admin.findById(
      req.admin._id
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    return res.status(200).json(admin);
  } catch (error) {
    console.error("GET ADMIN PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// ===============================
// UPDATE ADMIN PROFILE
// ===============================

const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const { name, phone, designation } = req.body;
    const updates = {};

    if (typeof name === "string") {
      const trimmedName = name.trim();
      if (trimmedName) {
        updates.name = trimmedName;
      }
    }

    if (typeof phone === "string") {
      updates.phone = phone.trim();
    }

    if (typeof designation === "string") {
      const trimmedDesignation = designation.trim();
      if (trimmedDesignation) {
        updates.designation = trimmedDesignation;
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid profile fields provided",
      });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.admin._id,
      updates,
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("UPDATE ADMIN PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ===============================
// UPLOAD ADMIN PROFILE PHOTO
// ===============================

const uploadAdminProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No profile photo file provided.",
      });
    }

    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const photoUrl = `${getBackendUrl()}/uploads/${encodeURIComponent(req.file.filename)}`;
    const oldPhotoPath = admin.profilePhoto
      ? path.join(__dirname, "..", "uploads", path.basename(admin.profilePhoto))
      : null;

    admin.profilePhoto = photoUrl;
    await admin.save();

    if (oldPhotoPath && oldPhotoPath !== req.file.path) {
      await removeFileIfExists(oldPhotoPath);
    }

    const refreshedAdmin = await Admin.findById(req.admin._id).select("-password");

    return res.status(200).json({
      message: "Profile photo uploaded successfully.",
      profilePhoto: photoUrl,
      admin: refreshedAdmin,
    });
  } catch (error) {
    console.error("ADMIN PROFILE PHOTO UPLOAD ERROR:", error);

    return res.status(500).json({
      message: "Failed to upload profile photo.",
      error: error.message,
    });
  }
};

// ===============================
// EXPORT
// ===============================

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  uploadAdminProfilePhoto,
};