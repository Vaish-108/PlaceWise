const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const College = require("../models/College");

const BACKLOG_STATUS_VALUES = ["no-backlog", "active-backlog", "dead-backlog"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s-]{7,20}$/;
const URL_REGEX = /^https?:\/\//i;

const getBackendUrl = () =>
  process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

const removeFileIfExists = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Failed to remove old profile photo:", error.message);
  }
};

const isValidEmail = (value) => !value || EMAIL_REGEX.test(value.trim());
const isValidPhone = (value) => !value || PHONE_REGEX.test(value.trim());
const isValidCgpa = (value) => {
  if (value === undefined || value === null || value === "") {
    return true;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue >= 0 && numericValue <= 10;
};
const isValidAcademicYear = (value) => {
  if (value === undefined || value === null || value === "") {
    return true;
  }

  const numericValue = Number(value);
  return Number.isInteger(numericValue) && numericValue >= 1 && numericValue <= 4;
};
const isValidSemester = (value) => {
  if (value === undefined || value === null || value === "") {
    return true;
  }

  const numericValue = Number(value);
  return Number.isInteger(numericValue) && numericValue >= 1 && numericValue <= 8;
};
const isValidGraduationYear = (value) => {
  if (value === undefined || value === null || value === "") {
    return true;
  }

  const numericValue = Number(value);
  return Number.isInteger(numericValue) && numericValue >= 2000 && numericValue <= 2100;
};
const isValidDate = (value) => {
  if (!value) {
    return true;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.getFullYear() >= 1900;
};
const isValidBacklogStatus = (value) => !value || BACKLOG_STATUS_VALUES.includes(value);
const isValidUrl = (value) => !value || URL_REGEX.test(value.trim());
const normalizeEmail = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
};
const sanitizeSkills = (skills) => {
  if (!Array.isArray(skills)) {
    return [];
  }

  return skills
    .map((skill) => typeof skill === "string" ? skill.trim() : "")
    .filter(Boolean);
};
const assignIfPresent = (target, field, value) => {
  if (value !== undefined) {
    target[field] = value;
  }
};

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, collegeCode } = req.body;

    if (!name || !email || !password || !collegeCode) {
      return res.status(400).json({
        message: "Name, email, password, and collegeCode are required",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingStudent = await Student.findOne({ email: normalizedEmail });
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });

    // Temporary debug logs for registration duplicate-check troubleshooting
    console.log("REGISTER DEBUG - raw email:", email);
    console.log("REGISTER DEBUG - normalized email:", normalizedEmail);
    console.log("REGISTER DEBUG - existing student:", !!existingStudent);
    console.log("REGISTER DEBUG - existing admin:", !!existingAdmin);

    if (existingStudent || existingAdmin) {
      return res.status(409).json({
        message: "Email is already registered. Please login using this account or use a different email.",
      });
    }

    const collegeDoc = await College.findOne({ code: collegeCode.toLowerCase().trim() });

    if (!collegeDoc) {
      return res.status(400).json({
        message: "Invalid college code",
      });
    }

    if (!collegeDoc.isActive) {
      return res.status(403).json({
        message: "College is inactive",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Student.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      college: collegeDoc.name || "",
      collegeId: collegeDoc._id,
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const user = await Student.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        collegeId: user.collegeId,
        college: user.college,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


const getProfile = async (req, res) => {
  try {

    const user = await Student.findById(
      req.user.userId || req.user._id
    ).select("-password");

    res.status(200).json(user);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};


const updateProfile = async (req, res) => {
  try {
    const user = await Student.findById(req.user.userId || req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      name,
      personalEmail,
      collegeEmail,
      phone,
      dateOfBirth,
      college,
      rollNumber,
      branch,
      course,
      year,
      semester,
      cgpa,
      graduationYear,
      backlogStatus,
      skills,
      linkedin,
      github,
      leetcode,
    } = req.body;

    if (!isValidEmail(personalEmail)) {
      return res.status(400).json({
        message: "Personal email must be a valid email address.",
      });
    }

    if (!isValidEmail(collegeEmail)) {
      return res.status(400).json({
        message: "College email must be a valid email address.",
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        message: "Phone number must be a valid phone number.",
      });
    }

    if (!isValidDate(dateOfBirth)) {
      return res.status(400).json({
        message: "Date of birth must be a valid date.",
      });
    }

    if (!isValidCgpa(cgpa)) {
      return res.status(400).json({
        message: "CGPA must be a numeric value between 0 and 10.",
      });
    }

    if (!isValidAcademicYear(year)) {
      return res.status(400).json({
        message: "Year must be a valid academic year between 1 and 4.",
      });
    }

    if (!isValidSemester(semester)) {
      return res.status(400).json({
        message: "Semester must be a valid semester number between 1 and 8.",
      });
    }

    if (!isValidGraduationYear(graduationYear)) {
      return res.status(400).json({
        message: "Graduation year must be a valid year.",
      });
    }

    if (!isValidBacklogStatus(backlogStatus)) {
      return res.status(400).json({
        message: "Backlog status must be one of: no-backlog, active-backlog, dead-backlog.",
      });
    }

    if (!isValidUrl(linkedin)) {
      return res.status(400).json({
        message: "LinkedIn must be a valid URL.",
      });
    }

    if (!isValidUrl(github)) {
      return res.status(400).json({
        message: "GitHub must be a valid URL.",
      });
    }

    if (!isValidUrl(leetcode)) {
      return res.status(400).json({
        message: "LeetCode must be a valid URL.",
      });
    }

    const nextDateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    const nextYear = year === "" || year === undefined || year === null ? null : Number(year);
    const nextSemester = semester === "" || semester === undefined || semester === null ? null : Number(semester);
    const nextCgpa = cgpa === "" || cgpa === undefined || cgpa === null ? null : Number(cgpa);
    const nextGraduationYear = graduationYear === "" || graduationYear === undefined || graduationYear === null ? null : Number(graduationYear);
    const nextBacklogStatus = backlogStatus === "" || backlogStatus === undefined || backlogStatus === null ? null : backlogStatus;

    assignIfPresent(user, "name", name?.trim());
    assignIfPresent(user, "personalEmail", personalEmail?.trim());
    assignIfPresent(user, "collegeEmail", collegeEmail?.trim());
    assignIfPresent(user, "phone", phone?.trim());
    assignIfPresent(user, "dateOfBirth", nextDateOfBirth);
    assignIfPresent(user, "college", college?.trim());
    assignIfPresent(user, "rollNumber", rollNumber?.trim());
    assignIfPresent(user, "branch", branch?.trim());
    assignIfPresent(user, "course", course?.trim());
    assignIfPresent(user, "year", nextYear);
    assignIfPresent(user, "semester", nextSemester);
    assignIfPresent(user, "cgpa", nextCgpa);
    assignIfPresent(user, "graduationYear", nextGraduationYear);
    assignIfPresent(user, "backlogStatus", nextBacklogStatus);
    assignIfPresent(user, "skills", skills !== undefined ? sanitizeSkills(skills) : undefined);
    assignIfPresent(user, "linkedin", linkedin?.trim());
    assignIfPresent(user, "github", github?.trim());
    assignIfPresent(user, "leetcode", leetcode?.trim());

    const updatedUser = await user.save();
    const refreshedUser = await Student.findById(req.user.userId || req.user._id).select("-password");

    res.status(200).json({
      message: "Profile Updated Successfully",
      user: refreshedUser,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No profile photo file provided.",
      });
    }

    const user = await Student.findById(req.user.userId || req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const photoUrl = `${getBackendUrl()}/uploads/${encodeURIComponent(req.file.filename)}`;
    const oldPhotoPath = user.profilePhoto
      ? path.join(__dirname, "..", "uploads", path.basename(user.profilePhoto))
      : null;

    user.profilePhoto = photoUrl;
    await user.save();

    if (oldPhotoPath && oldPhotoPath !== req.file.path) {
      await removeFileIfExists(oldPhotoPath);
    }

    const refreshedUser = await Student.findById(req.user.userId || req.user._id).select("-password");

    res.status(200).json({
      message: "Profile photo uploaded successfully.",
      profilePhoto: photoUrl,
      user: refreshedUser,
    });
  } catch (error) {
    console.error("Profile photo upload failed:", error);
    res.status(500).json({
      message: "Failed to upload profile photo.",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadProfilePhoto,
};