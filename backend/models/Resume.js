const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  filePath: {
    type: String,
    required: true,
  },

  fileName: {
    type: String,
    required: true,
  },

  resumeText: {
    type: String,
    default: "",
  },

  extractedSkills: {
    type: [String],
    default: [],
  },

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resume", resumeSchema);
