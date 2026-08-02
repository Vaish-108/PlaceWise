const fs = require("fs").promises;
const path = require("path");

const Resume = require("../models/Resume");
const Student = require("../models/Student");
const { extractTextFromPdf } = require("../services/pdfExtractionService");
const { extractSkillsFromText } = require("../services/skillExtractionService");
const { buildMergedSkillList, sanitizeSkills } = require("../services/skillMergeService");

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
    console.error("Failed to remove uploaded file:", error.message);
  }
};

const getBackendUrl = () =>
  process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

const buildResumeResponse = (resume) => ({
  fileName: resume.fileName,
  uploadedAt: resume.uploadedAt,
  extractedSkills: resume.extractedSkills || [],
  fileUrl: `${getBackendUrl()}/uploads/${encodeURIComponent(path.basename(resume.filePath))}`,
  resumeTextAvailable: Boolean(resume.resumeText),
});

const getLatestResume = async (req, res) => {
  try {
    const latestResume = await Resume.findOne({ studentId: req.user._id })
      .sort({ uploadedAt: -1 })
      .lean();

    if (!latestResume) {
      return res.status(200).json({ resume: null });
    }

    return res.status(200).json({ resume: buildResumeResponse(latestResume) });
  } catch (error) {
    console.error("Failed to load latest resume:", error);
    return res.status(500).json({ message: "Failed to load resume" });
  }
};

const getExtractedSkills = async (req, res) => {
  try {
    const latestResume = await Resume.findOne({ studentId: req.user._id })
      .sort({ uploadedAt: -1 })
      .lean();

    if (!latestResume) {
      return res.status(200).json({
        skills: [],
        resumeExists: false,
        message: "No resume uploaded.",
      });
    }

    const response = buildResumeResponse(latestResume);

    if (!latestResume.resumeText) {
      return res.status(200).json({
        skills: [],
        resumeExists: true,
        fileName: response.fileName,
        fileUrl: response.fileUrl,
        resumeTextAvailable: false,
        message:
          "Resume uploaded, but no readable text could be extracted. The PDF may be image-based/scanned.",
      });
    }

    const extractedSkills = sanitizeSkills(
      extractSkillsFromText(latestResume.resumeText)
    );

    return res.status(200).json({
      skills: extractedSkills,
      resumeExists: true,
      fileName: response.fileName,
      fileUrl: response.fileUrl,
      resumeTextAvailable: true,
      message:
        extractedSkills.length
          ? "Skills extracted from the uploaded resume."
          : "Resume text was extracted, but no technical skills were detected.",
    });
  } catch (error) {
    console.error("Failed to extract resume skills:", error);
    return res.status(500).json({
      skills: [],
      resumeExists: false,
      message: "Failed to extract skills from resume.",
    });
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

  let processedSuccessfully = false;
  let savedResume = null;

  try {
    const resumeText = await extractTextFromPdf(file.path);
    console.log("Resume text length:", resumeText?.length);

    const extractedSkills = resumeText
      ? sanitizeSkills(extractSkillsFromText(resumeText))
      : [];

    console.log("Extracted skills:", extractedSkills);

    const student = await Student.findById(req.user._id);
    const existingSkills = sanitizeSkills(student?.skills || []);
    const mergedSkills = buildMergedSkillList(existingSkills, extractedSkills);

    if (student) {
      student.skills = mergedSkills;
      await student.save();
    }

    savedResume = await Resume.create({
      studentId: req.user._id,
      filePath: file.path,
      fileName: file.originalname,
      resumeText: resumeText || "",
      extractedSkills,
    });

    processedSuccessfully = true;

    return res.status(201).json({
      message: resumeText
        ? "Resume uploaded and analyzed successfully"
        : "Resume uploaded, but no readable text could be extracted. The PDF may be image-based/scanned.",
      resume: buildResumeResponse(savedResume),
      extractedSkills,
      updatedProfileSkills: mergedSkills,
      resumeTextAvailable: Boolean(resumeText),
    });
  } catch (error) {
    console.error("Resume upload failed:", error);

    // Preserve the uploaded file if processing fails so the resume remains
    // available for debugging and retry.
    return res.status(500).json({
      message: "Failed to process resume.",
      error: error.message,
    });
  }
};

module.exports = {
  getLatestResume,
  getExtractedSkills,
  uploadResume: exports.uploadResume,
};
