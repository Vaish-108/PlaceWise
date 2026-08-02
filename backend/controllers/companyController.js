const Company = require("../models/Company");
const Admin = require("../models/Admin");

const getAuthenticatedCollegeId = (req) => {
  const collegeId = req.admin?.collegeId || req.user?.collegeId;

  return collegeId ? String(collegeId) : "";
};

const getAuthenticatedCollege = (req) => {
  const collegeName = String(req.admin?.college || req.user?.college || "").trim().toLowerCase();

  return collegeName;
};

const createCompany = async (req, res) => {
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

    const authenticatedCollegeId = getAuthenticatedCollegeId(req);
    const college = String(admin.college || "").trim().toLowerCase();

    if (!college) {
      return res.status(400).json({
        message: "Admin is not associated with a college",
      });
    }

    const normalizedName = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const normalizedRole = typeof req.body.role === "string" ? req.body.role.trim() : "";
    const normalizedPackage = typeof req.body.package === "string" ? req.body.package.trim() : "";
    const normalizedSkills = Array.isArray(req.body.requiredSkills)
      ? req.body.requiredSkills.filter(Boolean)
      : String(req.body.requiredSkills || "")
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);

    if (!normalizedName || !normalizedRole || !normalizedPackage) {
      return res.status(400).json({
        message: "Company name, role, and package are required",
      });
    }

    const company = await Company.create({
      name: normalizedName,
      role: normalizedRole,
      package: normalizedPackage,
      requiredSkills: normalizedSkills,
      minCGPA: req.body.minCGPA,
      college,
      collegeId: authenticatedCollegeId || undefined,
    });

    res.status(201).json({
      message: "Company Added Successfully",
      company,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getCompanies = async (req, res) => {
  try {
    if (!req.admin && !req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const authenticatedCollegeId = getAuthenticatedCollegeId(req);
    const authenticatedCollege = getAuthenticatedCollege(req);

    if (req.admin && !authenticatedCollegeId && !authenticatedCollege) {
      return res.status(400).json({
        message: "Admin is not associated with a college",
      });
    }

    if (req.user && !authenticatedCollegeId && !authenticatedCollege) {
      return res.status(400).json({
        message: "Student is not associated with a college",
      });
    }

    const query = {};

    if (authenticatedCollegeId) {
      query.collegeId = authenticatedCollegeId;
    } else if (authenticatedCollege) {
      query.college = authenticatedCollege;
    }

    const companies = await Company.find(query);

    return res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createCompany,
  getCompanies,
};
