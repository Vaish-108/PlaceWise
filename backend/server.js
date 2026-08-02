const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const seedColleges = require("./scripts/seedColleges");

const authRoutes = require("./routes/authRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const companyRoutes = require("./routes/companyRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const jobRoutes = require("./routes/jobRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiSuggestionRoutes = require("./routes/aiSuggestionRoutes");
const aiChatRoutes = require("./routes/aiChatRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

dotenv.config();

connectDB().then(() => {
  seedColleges();
});

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Serve uploaded files publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminAuthRoutes);

app.use("/api/companies", companyRoutes);

app.use("/api/matching", matchingRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/announcements", announcementRoutes);

// Resume routes
// GET  /api/resume/latest
// POST /api/resume/upload
app.use("/api/resume", resumeRoutes);

// AI suggestion routes
app.use("/api/ai", aiSuggestionRoutes);

// AI chat routes
app.use("/api/ai", aiChatRoutes);

// Ticket routes
app.use("/api/tickets", ticketRoutes);

// ===============================
// ROOT ROUTE
// ===============================

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
