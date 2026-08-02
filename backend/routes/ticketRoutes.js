const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const {
  createTicket,
  getStudentTickets,
  getAllTickets,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");

router.post("/", authMiddleware, createTicket);

router.get("/", authMiddleware, getStudentTickets);

router.get("/all", adminAuthMiddleware, getAllTickets);

router.put("/:id", adminAuthMiddleware, updateTicket);

const ticketAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return authMiddleware(req, res, next);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return authMiddleware(req, res, next);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "admin") {
      return adminAuthMiddleware(req, res, next);
    }
  } catch (error) {
    console.log(error);
  }

  return authMiddleware(req, res, next);
};

router.delete("/:id", ticketAuthMiddleware, deleteTicket);

module.exports = router;
