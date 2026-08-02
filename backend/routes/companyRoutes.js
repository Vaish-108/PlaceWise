const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const {
  createCompany,
  getCompanies,
} = require("../controllers/companyController");

const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const authenticateCompanyAccess = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid token format",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "admin") {
      return adminAuthMiddleware(req, res, next);
    }

    return authMiddleware(req, res, next);
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};

// Only authenticated admins can create companies
router.post("/", adminAuthMiddleware, createCompany);

// Authenticated admins and students can view companies for their college
router.get("/", authenticateCompanyAccess, getCompanies);

module.exports = router;