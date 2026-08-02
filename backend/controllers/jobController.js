const Job = require("../models/Job");
const Company = require("../models/Company");
const Admin = require("../models/Admin");

const normalizeCollege = (value) => {
  return String(value || "").trim().toLowerCase();
};

// CREATE JOB
const createJob = async (req, res) => {
  try {
    const adminId = req.admin?._id || req.admin?.id;

    if (!adminId) {
      return res.status(401).json({
        message: "Admin authentication required",
      });
    }

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const adminCollege = normalizeCollege(admin.college);

    if (!adminCollege) {
      return res.status(400).json({
        message: "Admin is not associated with a college",
      });
    }

    const { company: companyId, title, description, package: jobPackage, applicationLink, requiredSkills, minCGPA } = req.body;
    const normalizedTitle = typeof title === "string" ? title.trim() : "";
    const normalizedDescription = typeof description === "string" ? description.trim() : "";
    const normalizedPackage = typeof jobPackage === "string" ? jobPackage.trim() : "";
    const normalizedApplicationLink = typeof applicationLink === "string" ? applicationLink.trim() : "";
    const normalizedSkills = Array.isArray(requiredSkills)
      ? requiredSkills.filter(Boolean)
      : String(requiredSkills || "")
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);

    if (!normalizedTitle || !normalizedDescription || !normalizedPackage || !normalizedApplicationLink) {
      return res.status(400).json({
        message: "Job title, description, package, and application link are required",
      });
    }

    if (!companyId) {
      return res.status(400).json({
        message: "Company is required",
      });
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const companyCollege = normalizeCollege(company.college);

    if (!companyCollege) {
      return res.status(400).json({
        message: "Company is not associated with a college",
      });
    }

    if (companyCollege !== adminCollege) {
      return res.status(403).json({
        message: "Company does not belong to your college",
      });
    }

    const job = await Job.create({
      company: companyId,
      title: normalizedTitle,
      description: normalizedDescription,
      package: normalizedPackage,
      applicationLink: normalizedApplicationLink,
      requiredSkills: normalizedSkills,
      minCGPA,
      college: adminCollege,
    });

    res.status(201).json({
      message: "Job Created Successfully",
      job,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// GET ALL JOBS
const getJobs = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const studentCollege = normalizeCollege(req.user.college);

    if (!studentCollege) {
      return res.status(400).json({
        message: "Student is not associated with a college",
      });
    }

    const jobs = await Job.find({ college: studentCollege }).populate("company");

    res.status(200).json(jobs);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createJob,
  getJobs,
};