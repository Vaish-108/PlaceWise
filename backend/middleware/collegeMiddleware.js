const College = require("../models/College");

const collegeMiddleware = async (req, res, next) => {
  try {
    const collegeId = req.user?.collegeId || req.admin?.collegeId;

    if (!collegeId) {
      return res.status(400).json({
        message: "Authenticated user has no college assigned",
      });
    }

    const college = await College.findById(collegeId);

    if (!college) {
      return res.status(404).json({
        message: "College not found",
      });
    }

    if (!college.isActive) {
      return res.status(403).json({
        message: "College is inactive",
      });
    }

    req.college = college;
    req.collegeId = college._id;
    next();
  } catch (error) {
    console.error("College middleware error:", error);
    return res.status(400).json({
      message: "Invalid college reference",
    });
  }
};

module.exports = collegeMiddleware;
