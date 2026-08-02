const express = require("express");

const router = express.Router();

const {
  createJob,
  getJobs,
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");




// create job

router.post("/", adminAuthMiddleware, createJob);



// get jobs

router.get("/", authMiddleware, getJobs);



module.exports = router;