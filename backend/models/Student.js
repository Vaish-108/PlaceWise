const mongoose = require("mongoose");

const BACKLOG_STATUS_VALUES = ["no-backlog", "active-backlog", "dead-backlog"];

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    personalEmail: {
      type: String,
      default: "",
    },

    collegeEmail: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    college: {
      type: String,
      default: "",
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      default: null,
    },

    rollNumber: {
      type: String,
      default: "",
    },

    branch: {
      type: String,
      default: "",
    },

    course: {
      type: String,
      default: "",
    },

    year: {
      type: Number,
      default: null,
    },

    semester: {
      type: Number,
      default: null,
    },

    cgpa: {
      type: Number,
      default: null,
    },

    graduationYear: {
      type: Number,
      default: null,
    },

    backlogStatus: {
      type: String,
      enum: BACKLOG_STATUS_VALUES,
      default: null,
    },

    skills: {
      type: [String],
      default: [],
    },

    linkedin: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    leetcode: {
      type: String,
      default: "",
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);