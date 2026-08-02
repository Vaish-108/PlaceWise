const express = require("express");
const {
  createAnnouncement,
  getAnnouncements,
} = require("../controllers/announcementController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.post("/", adminAuthMiddleware, createAnnouncement);
router.get("/", getAnnouncements);

module.exports = router;
