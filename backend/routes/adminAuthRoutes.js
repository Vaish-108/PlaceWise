const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  uploadAdminProfilePhoto,
} = require("../controllers/adminAuthController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const { imageUpload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", adminAuthMiddleware, getAdminProfile);
router.put("/profile", adminAuthMiddleware, updateAdminProfile);
router.post("/profile/photo", adminAuthMiddleware, imageUpload.single("photo"), uploadAdminProfilePhoto);

module.exports = router;
