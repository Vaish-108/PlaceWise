const express = require("express");
const protect = require("../middleware/authMiddleware");
const { imageUpload } = require("../middleware/uploadMiddleware");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/profile/photo", protect, imageUpload.single("photo"), uploadProfilePhoto);

module.exports = router;

