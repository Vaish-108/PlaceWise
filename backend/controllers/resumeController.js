const fs = require("fs").promises;
const path = require("path");

const Resume = require("../models/Resume");
const { extractTextFromPdf } = require("../services/pdfExtractionService");
const { extractSkillsFromText } = require("../services/skillExtractionService");

const isPdfFile = (file) => {
  const mimeType = file.mimetype?.toLowerCase();
  const extension = path.extname(file.originalname || "").toLowerCase();

  return mimeType === "application/pdf" || extension === ".pdf";
};

const removeUploadedFile = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Failed to remove invalid upload:", error.message);
  }
};

exports.uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No resume file provided",
    });
  }

  const { file } = req;

  if (!isPdfFile(file)) {
    await removeUploadedFile(file.path);

    return res.status(400).json({
      message: "Only PDF files are allowed",
    });
  }

  try {
    const resumeText = await extractTextFromPdf(file.path);
    const extractedSkills = extractSkillsFromText(resumeText);

    const resume = await Resume.create({
      studentId: req.user._id,
      filePath: file.path,
      fileName: file.originalname,
      resumeText,
      extractedSkills,
    });

    res.status(201).json({
      message: "Resume uploaded and analyzed successfully",
      resume,
      extractedSkills,
    });
  } catch (error) {
    await removeUploadedFile(file.path);

    console.error("Resume upload failed:", error);

    res.status(500).json({
      message: "Failed to process resume",
      error: error.message,
    });
  }
};
