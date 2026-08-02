const Student = require("../models/Student");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Resume = require("../models/Resume");

const {
  checkEligibility,
  checkJobMatch,
} = require("../services/matchingService");

const normalizeCollege = (value) => String(value || "").trim().toLowerCase();

const getLatestResumeSkills = async (studentId) => {
  const latestResume = await Resume.findOne({ studentId })
    .sort({ uploadedAt: -1 })
    .select("extractedSkills");

  return latestResume?.extractedSkills || [];
};

const checkCompanyMatch = async (req, res) => {
  try {
    const studentId = req.user?._id || req.user?.id;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const studentCollege = normalizeCollege(student.college);

    if (!studentCollege) {
      return res.status(400).json({
        message: "Student is not associated with a college",
      });
    }

    const company = await Company.findById(req.params.companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const companyCollege = normalizeCollege(company.college);

    if (!companyCollege || companyCollege !== studentCollege) {
      return res.status(403).json({
        message: "Company does not belong to your college",
      });
    }

    const resumeSkills = await getLatestResumeSkills(student._id);

    const result = checkEligibility(student, company, resumeSkills);

    res.status(200).json({
      targetType: "company",
      targetId: company._id,
      targetName: company.name,
      ...result,
    });
  } catch (error) {
    console.error("Company match failed:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const checkJobMatchHandler = async (req, res) => {
  try {
    const studentId = req.user?._id || req.user?.id;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const studentCollege = normalizeCollege(student.college);

    if (!studentCollege) {
      return res.status(400).json({
        message: "Student is not associated with a college",
      });
    }

    const job = await Job.findById(req.params.jobId).populate("company");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const jobCollege = normalizeCollege(job.college);

    if (!jobCollege || jobCollege !== studentCollege) {
      return res.status(403).json({
        message: "Job does not belong to your college",
      });
    }

    const resumeSkills = await getLatestResumeSkills(student._id);

    const result = checkJobMatch(student, job, resumeSkills);

    res.status(200).json({
      targetType: "job",
      targetId: job._id,
      targetName: job.title,
      companyName: job.company?.name || "",
      ...result,
    });
  } catch (error) {
    console.error("Job match failed:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  checkCompanyMatch,
  checkJobMatch: checkJobMatchHandler,
};
