const express = require("express");

const router = express.Router();

const {
  checkCompanyMatch,
  checkJobMatch,
} = require("../controllers/matchingController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/job/:jobId", authMiddleware, checkJobMatch);

router.get("/:companyId", authMiddleware, checkCompanyMatch);

module.exports = router;
