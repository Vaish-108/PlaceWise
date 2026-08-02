const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { resumeUpload } = require("../middleware/uploadMiddleware");

const {
  getLatestResume,
  uploadResume,
  getExtractedSkills,
} = require("../controllers/resumeController");

router.get("/latest", authMiddleware, getLatestResume);
router.get("/extracted-skills", authMiddleware, getExtractedSkills);
router.post("/upload", authMiddleware, resumeUpload.single("resume"), uploadResume);

module.exports = router;