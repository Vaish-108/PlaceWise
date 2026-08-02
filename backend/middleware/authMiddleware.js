const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const College = require("../models/College");

const authMiddleware = async (req, res, next) => {
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

    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }

    // -------------------------------
    // Find Student
    // -------------------------------
    console.log("JWT USER ID:", userId);

const user = await Student.findById(userId)
.select("-password");

console.log("FOUND USER:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // =====================================================
    // AUTO MIGRATION
    // =====================================================

    if (!user.collegeId && user.college) {
      const college = await College.findOne({
        name: user.college.trim(),
      });

      if (college) {
        user.collegeId = college._id;
        await user.save();
      }
    }

    // -------------------------------
    // Validate College
    // -------------------------------
    if (!user.collegeId) {
      return res.status(400).json({
        message: "User has no college assigned",
      });
    }

    const college = await College.findById(user.collegeId);

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
    // Attach User
    // -------------------------------
    req.user = {
      ...user.toObject(),

      _id: user._id,
      userId: user._id,

      role: user.role,

      college: college.name,
      collegeId: college._id,
    };

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);

    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};

module.exports = authMiddleware;