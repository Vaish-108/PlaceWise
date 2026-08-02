const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const College = require("../models/College");

const adminAuthMiddleware = async (req, res, next) => {
  try {
    // -------------------------------
    // Check Authorization Header
    // -------------------------------
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // -------------------------------
    // Verify JWT
    // -------------------------------
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const adminId = decoded.userId || decoded.id;

    if (!adminId) {
      return res.status(401).json({
        message: "Invalid Admin Token",
      });
    }

    // -------------------------------
    // Find Admin
    // -------------------------------
    const admin = await Admin.findById(adminId).select("-password");

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    // =====================================================
    // AUTO MIGRATION
    // =====================================================

    if (!admin.collegeId && admin.college) {
      const college = await College.findOne({
        name: admin.college.trim(),
      });

      if (college) {
        admin.collegeId = college._id;
        await admin.save();
      }
    }

    // -------------------------------
    // Validate College
    // -------------------------------
    if (!admin.collegeId) {
      return res.status(400).json({
        message: "Admin has no college assigned",
      });
    }

    const college = await College.findById(admin.collegeId);

    if (!college) {
      return res.status(404).json({
        message: "College not found",
      });
    }

    if (!college.isActive) {
      return res.status(403).json({
        message: "College is inactive",
      });
    }

    // -------------------------------
    // Attach Admin
    // -------------------------------
    req.admin = {
      ...admin.toObject(),

      _id: admin._id,
      userId: admin._id,

      role: admin.role,

      college: college.name,
      collegeId: college._id,
    };

    next();
  } catch (error) {
    console.error("ADMIN AUTH ERROR:", error);

    return res.status(401).json({
      message: "Invalid Admin Token",
    });
  }
};

module.exports = adminAuthMiddleware;
