import { useEffect, useMemo, useState } from "react";
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} from "../../services/authService";
import {
  getLatestResume,
  getExtractedResumeSkills,
  uploadResume,
} from "../../services/resumeService";
import Navbar from "../../components/Navbar/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const normalizeEmptyValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  if (typeof value === "number" && !Number.isFinite(value)) {
    return "";
  }

  return value;
};

const buildFormData = (profileData = null) => ({
  name: profileData?.name || "",
  personalEmail: profileData?.personalEmail || "",
  collegeEmail: profileData?.collegeEmail || "",
  phone: profileData?.phone || "",
  dateOfBirth: profileData?.dateOfBirth
    ? new Date(profileData.dateOfBirth).toISOString().split("T")[0]
    : "",
  college: profileData?.college || "",
  rollNumber: profileData?.rollNumber || "",
  branch: profileData?.branch || "",
  course: profileData?.course || "",
  year:
    normalizeEmptyValue(profileData?.year) === 0
      ? ""
      : normalizeEmptyValue(profileData?.year),
  semester:
    normalizeEmptyValue(profileData?.semester) === 0
      ? ""
      : normalizeEmptyValue(profileData?.semester),
  cgpa:
    normalizeEmptyValue(profileData?.cgpa) === 0
      ? ""
      : normalizeEmptyValue(profileData?.cgpa),
  graduationYear:
    normalizeEmptyValue(profileData?.graduationYear) === 0
      ? ""
      : normalizeEmptyValue(profileData?.graduationYear),
  backlogStatus: profileData?.backlogStatus || "",
  skills: Array.isArray(profileData?.skills)
    ? [...profileData.skills]
    : [],
  linkedin: profileData?.linkedin || "",
  github: profileData?.github || "",
  leetcode: profileData?.leetcode || "",
});

const formatBacklogStatus = (value) => {
  if (!value) return "Not Updated";

  const statusMap = {
    "no-backlog": "No Backlog",
    "active-backlog": "Active Backlog",
    "dead-backlog": "Dead Backlog",
  };

  return statusMap[value] || value;
};

const formatDate = (value) => {
  if (!value) return "Not available";

  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    return "Not available";
  }
};

const formatCgpa = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === 0
  ) {
    return "Not updated";
  }

  return Number(value).toFixed(2);
};

const formatYearLabel = (value) => {
  if (!value) return "Not updated";

  const yearMap = {
    1: "1st Year",
    2: "2nd Year",
    3: "3rd Year",
    4: "4th Year",
  };

  return yearMap[value] || `${value} Year`;
};

const formatSemesterLabel = (value) => {
  if (!value) return "Not updated";

  return `Semester ${value}`;
};

function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(buildFormData());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [newSkill, setNewSkill] = useState("");

  // Resume states
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeMessage, setResumeMessage] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [resumeStatus, setResumeStatus] = useState(null);

  // Resume extracted skills
  const [resumeSkills, setResumeSkills] = useState([]);
  const [extractingSkills, setExtractingSkills] = useState(false);
  const [resumeSkillsError, setResumeSkillsError] = useState("");

  // Profile photo
  const [photoFile, setPhotoFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");
  const [photoError, setPhotoError] = useState("");

  const initials = useMemo(() => {
    const name = profile?.name || "Student";

    return (
      name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join("") || "S"
    );
  }, [profile]);

  // ==========================================
  // LOAD PROFILE + RESUME
  // ==========================================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your profile.");
          return;
        }

        // --------------------------------------
        // LOAD PROFILE
        // --------------------------------------

        const profileData = await getProfile(token);

        setProfile(profileData);
        setFormData(buildFormData(profileData));

        // --------------------------------------
        // LOAD LATEST RESUME
        // --------------------------------------

        try {
          const latestResumeData = await getLatestResume(token);

          if (latestResumeData?.resume) {
            setResumeStatus(latestResumeData.resume);

            // ----------------------------------
            // LOAD EXTRACTED RESUME SKILLS
            // ----------------------------------

            try {
              setExtractingSkills(true);
              setResumeSkillsError("");

              const response =
                await getExtractedResumeSkills(token);

              const extractedSkills =
                Array.isArray(response?.skills)
                  ? response.skills
                  : [];

              setResumeSkills(extractedSkills);

              // --------------------------------
              // SHOW EXTRACTED SKILLS
              // DIRECTLY IN PROFILE SKILLS
              // --------------------------------

              if (extractedSkills.length > 0) {
                setProfile((current) => ({
                  ...current,
                  skills: extractedSkills,
                }));

                setFormData((current) => ({
                  ...current,
                  skills: extractedSkills,
                }));
              }
            } catch (err) {
              console.error(
                "Failed to load extracted resume skills:",
                err.response?.data || err.message
              );

              setResumeSkillsError(
                err.response?.data?.message ||
                  err.message ||
                  "Unable to load extracted resume skills."
              );
            } finally {
              setExtractingSkills(false);
            }
          } else {
            setResumeStatus(null);
            setResumeSkills([]);
          }
        } catch (resumeErr) {
          console.error(
            "Failed to load latest resume:",
            resumeErr.response?.data ||
              resumeErr.message
          );

          setResumeStatus(null);
          setResumeSkills([]);
        }
      } catch (err) {
        console.error(
          "Failed to load profile:",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load profile details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ==========================================
  // GENERAL FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ==========================================
  // SKILL MANAGEMENT
  // ==========================================

  const handleSkillAdd = () => {
    const skill = newSkill.trim();

    if (!skill) {
      return;
    }

    if (formData.skills.includes(skill)) {
      setNewSkill("");
      return;
    }

    setFormData((current) => ({
      ...current,
      skills: [...current.skills, skill],
    }));

    setNewSkill("");
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData((current) => ({
      ...current,
      skills: current.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancel = () => {
    setFormData(buildFormData(profile));
    setNewSkill("");
    setError("");
    setMessage("");
    setIsEditing(false);
  };

  // ==========================================
  // RESUME SKILLS
  // ==========================================

  const loadResumeSkills = async (token) => {
    if (!token) {
      return;
    }

    try {
      setExtractingSkills(true);
      setResumeSkillsError("");

      const response =
        await getExtractedResumeSkills(token);

      const extractedSkills =
        Array.isArray(response?.skills)
          ? response.skills
          : [];

      setResumeSkills(extractedSkills);

      if (extractedSkills.length > 0) {
        setProfile((current) => ({
          ...current,
          skills: extractedSkills,
        }));

        setFormData((current) => ({
          ...current,
          skills: extractedSkills,
        }));
      }
    } catch (err) {
      console.error(
        "Failed to load resume skills:",
        err.response?.data || err.message
      );

      setResumeSkillsError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load resume skills."
      );
    } finally {
      setExtractingSkills(false);
    }
  };

  // ==========================================
  // RESUME UPLOAD
  // ==========================================

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setResumeError("Please choose a PDF resume to upload.");
      return;
    }

    try {
      setUploadingResume(true);
      setResumeError("");
      setResumeMessage("");
      setResumeSkillsError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please log in again. Your session has expired."
        );
      }

      const response = await uploadResume(
        resumeFile,
        token
      );

      const updatedResume = response?.resume;

      const extractedSkills =
        response?.extractedSkills ||
        updatedResume?.extractedSkills ||
        [];

      setResumeStatus(updatedResume || null);

      setResumeSkills(
        Array.isArray(extractedSkills)
          ? extractedSkills
          : []
      );

      setResumeMessage(
        response?.message ||
          "Resume uploaded successfully."
      );

      // ========================================
      // PUT EXTRACTED SKILLS IN MAIN SKILLS
      // ========================================

      if (
        Array.isArray(extractedSkills) &&
        extractedSkills.length > 0
      ) {
        setProfile((current) => ({
          ...current,
          skills: extractedSkills,
        }));

        setFormData((current) => ({
          ...current,
          skills: extractedSkills,
        }));
      }

      // If upload response did not contain skills,
      // fetch them from backend.

      if (
        !Array.isArray(extractedSkills) ||
        extractedSkills.length === 0
      ) {
        await loadResumeSkills(token);
      }

      setResumeFile(null);

      const input = document.querySelector(
        "input[name='profileResume']"
      );

      if (input) {
        input.value = "";
      }
    } catch (err) {
      console.error(
        "Resume upload error:",
        err.response?.data || err.message
      );

      setResumeMessage("");

      setResumeError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Resume upload failed."
      );
    } finally {
      setUploadingResume(false);
    }
  };

  // ==========================================
  // PROFILE PHOTO
  // ==========================================

  const handlePhotoChange = (event) => {
    setPhotoFile(
      event.target.files?.[0] || null
    );

    setPhotoError("");
    setPhotoMessage("");
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) {
      setPhotoError(
        "Please choose a profile photo to upload."
      );
      return;
    }

    try {
      setUploadingPhoto(true);
      setPhotoError("");
      setPhotoMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please log in again. Your session has expired."
        );
      }

      const response =
        await uploadProfilePhoto(
          photoFile,
          token
        );

      const updatedProfile =
        response?.user || response;

      const profilePhoto =
        response?.profilePhoto ||
        updatedProfile?.profilePhoto;

      setProfile((current) => ({
        ...current,
        profilePhoto:
          profilePhoto ||
          current?.profilePhoto,
      }));

      setPhotoMessage(
        response?.message ||
          "Profile photo uploaded successfully."
      );

      setPhotoFile(null);

      const input = document.querySelector(
        "input[name='profilePhotoInput']"
      );

      if (input) {
        input.value = "";
      }
    } catch (err) {
      console.error(
        "Profile photo upload error:",
        err.response?.data || err.message
      );

      setPhotoMessage("");

      setPhotoError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload profile photo."
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please log in again. Your session has expired."
        );
      }

      const trimmedName =
        formData.name.trim();

      const personalEmail =
        formData.personalEmail.trim();

      const collegeEmail =
        formData.collegeEmail.trim();

      const phone =
        formData.phone.trim();

      const college =
        formData.college.trim();

      const rollNumber =
        formData.rollNumber.trim();

      const branch =
        formData.branch.trim();

      const course =
        formData.course.trim();

      const linkedin =
        formData.linkedin.trim();

      const github =
        formData.github.trim();

      const leetcode =
        formData.leetcode.trim();

      const safeYear =
        formData.year === ""
          ? null
          : Number(formData.year);

      const safeSemester =
        formData.semester === ""
          ? null
          : Number(formData.semester);

      const safeCgpa =
        formData.cgpa === ""
          ? null
          : Number(formData.cgpa);

      const safeGraduationYear =
        formData.graduationYear === ""
          ? null
          : Number(formData.graduationYear);

      if (!trimmedName) {
        throw new Error(
          "Please enter your full name."
        );
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const phonePattern =
        /^\+?[0-9\s-]{7,20}$/;

      const urlPattern =
        /^https?:\/\//i;

      if (
        personalEmail &&
        !emailPattern.test(personalEmail)
      ) {
        throw new Error(
          "Please enter a valid personal email address."
        );
      }

      if (
        collegeEmail &&
        !emailPattern.test(collegeEmail)
      ) {
        throw new Error(
          "Please enter a valid college email address."
        );
      }

      if (
        phone &&
        !phonePattern.test(phone)
      ) {
        throw new Error(
          "Please enter a valid phone number."
        );
      }

      if (
        linkedin &&
        !urlPattern.test(linkedin)
      ) {
        throw new Error(
          "Please enter a valid LinkedIn URL."
        );
      }

      if (
        github &&
        !urlPattern.test(github)
      ) {
        throw new Error(
          "Please enter a valid GitHub URL."
        );
      }

      if (
        leetcode &&
        !urlPattern.test(leetcode)
      ) {
        throw new Error(
          "Please enter a valid LeetCode URL."
        );
      }

      const payload = {
        name: trimmedName,
        personalEmail,
        collegeEmail,
        phone,
        dateOfBirth:
          formData.dateOfBirth ||
          undefined,
        college,
        rollNumber,
        branch,
        course,
        year: safeYear,
        semester: safeSemester,
        cgpa: safeCgpa,
        graduationYear:
          safeGraduationYear,
        backlogStatus:
          formData.backlogStatus ||
          undefined,

        // Current skills
        skills: formData.skills,

        linkedin,
        github,
        leetcode,
      };

      const response =
        await updateProfile(
          payload,
          token
        );

      const updatedUser =
        response?.user || response;

      if (updatedUser) {
        setProfile(updatedUser);
        setFormData(
          buildFormData(updatedUser)
        );
      }

      setIsEditing(false);

      setMessage(
        response?.message ||
          "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Profile update error:",
        err.response?.data || err.message
      );

      setMessage("");

      setError(
        err.response?.data?.message ||
          err.message ||
          "Update failed."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-content profile-page">

        {/* PAGE TITLE */}
        <section className="page-header">
          <div>
            <p className="eyebrow">
              Profile Hub
            </p>

            <h1>
              Student Profile
            </h1>

            <p className="page-subtitle">
              Manage your personal details,
              academic information, skills,
              resume, and professional profiles.
            </p>
          </div>
        </section>

        {loading && (
          <LoadingSpinner
            label="Loading profile..."
          />
        )}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}

        {!loading && profile && (
          <div className="profile-stack">

            {/* ==================================
                PROFILE PHOTO
            ================================== */}

            <section className="profile-photo-section">

              <div className="profile-photo-container">

                <div className="profile-photo">
                  {profile.profilePhoto ? (
                    <img
                      src={profile.profilePhoto}
                      alt={`${profile.name || "Student"} profile`}
                    />
                  ) : (
                    initials
                  )}
                </div>

                <h2 className="profile-photo-name">
                  {profile.name || "Student"}
                </h2>

                <div className="profile-photo-actions">

                  <input
                    type="file"
                    name="profilePhotoInput"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handlePhotoChange}
                  />

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleUploadPhoto}
                    disabled={
                      uploadingPhoto ||
                      !photoFile
                    }
                  >
                    {uploadingPhoto
                      ? "Uploading..."
                      : "Change Photo"}
                  </button>

                </div>

                {photoMessage && (
                  <div className="alert alert-success">
                    {photoMessage}
                  </div>
                )}

                {photoError && (
                  <div className="alert alert-error">
                    {photoError}
                  </div>
                )}

              </div>

            </section>

            {/* ==================================
                PERSONAL INFORMATION
            ================================== */}

            <section className="panel profile-card">

              <div className="profile-card__header">
                <h2>
                  Personal Information
                </h2>
              </div>

              {!isEditing ? (

                <div className="profile-stack-list">

                  <div className="profile-field profile-field--stacked">
                    <span className="profile-field__label">
                      Full Name
                    </span>
                    <strong>
                      {profile.name || "Not updated"}
                    </strong>
                  </div>

                  <div className="profile-field profile-field--stacked">
                    <span className="profile-field__label">
                      Date of Birth
                    </span>
                    <strong>
                      {formatDate(
                        profile.dateOfBirth
                      )}
                    </strong>
                  </div>

                  <div className="profile-field profile-field--stacked">
                    <span className="profile-field__label">
                      Personal Email
                    </span>
                    <strong>
                      {profile.personalEmail ||
                        "Not updated"}
                    </strong>
                  </div>

                  <div className="profile-field profile-field--stacked">
                    <span className="profile-field__label">
                      College Email
                    </span>
                    <strong>
                      {profile.collegeEmail ||
                        "Not updated"}
                    </strong>
                  </div>

                  <div className="profile-field profile-field--stacked">
                    <span className="profile-field__label">
                      Phone Number
                    </span>
                    <strong>
                      {profile.phone ||
                        "Not updated"}
                    </strong>
                  </div>

                </div>

              ) : (

                <div className="profile-form-stack">

                  <label className="profile-form-field">
                    <span>Full Name</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="profile-form-field">
                    <span>Date of Birth</span>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="profile-form-field">
                    <span>Personal Email</span>
                    <input
                      type="email"
                      name="personalEmail"
                      value={formData.personalEmail}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="profile-form-field">
                    <span>College Email</span>
                    <input
                      type="email"
                      name="collegeEmail"
                      value={formData.collegeEmail}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="profile-form-field">
                    <span>Phone Number</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </label>

                </div>

              )}

            </section>

            {/* ==================================
                ACADEMIC INFORMATION
            ================================== */}

            <section className="panel profile-card">

              <div className="profile-card__header">
                <h2>
                  Academic Information
                </h2>
              </div>

              {!isEditing ? (

                <div className="profile-stack-list">

                  <div className="profile-field profile-field--stacked">
                    <span className="profile-field__label">
                      College
                    </span>
                    <strong>
                      {profile.college ||
                        "Not updated"}
                    </strong>
                  </div>

                  <div className="profile-field profile-field--stacked">
                    <span className="profile-field__label">
                      Roll Number
                    </span>
                    <strong>
                      {profile.rollNumber ||
                        "Not updated"}
                    </strong>
                  </div>

                  <div className="profile-field profile-field--stacked">
                    <span className="profile-field__label">
                      Course
                    </span>
                    <strong>
                      {profile.course ||
                        "Not updated"}
                    </strong>
                  </div>

                  <div className="profile-field profile-field--stacked">
                    <span className="profile-field__label">
                      Branch
                    </span>
                    <strong>
                      {profile.branch ||
                        "Not updated"}
                    </strong>
                  </div>

                  <div className="profile-field profile-field--stacked">
                    <span className="profile-field__label">
                      Year
                    </span>
                    <strong>
                      {formatYearLabel(
                        profile.year
                      )}
                    </strong>
                  </div>

                  <div className="profile-field profile-field--stacked">
                    <span className="profile-field__label">
                      Semester
                    </span>
                    <strong>
                      {formatSemesterLabel(
                        profile.semester
                      )}
                    </strong>
                  </div>

                  <div className="profile-field profile-field--stacked">
                    <span className="profile-field__label">
                      CGPA
                    </span>
                    <strong>
                      {formatCgpa(
                        profile.cgpa
                      )}
                    </strong>
                  </div>

                  <div className="profile-field profile-field--stacked">
                    <span className="profile-field__label">
                      Graduation Year
                    </span>
                    <strong>
                      {profile.graduationYear ||
                        "Not updated"}
                    </strong>
                  </div>

                  <div className="profile-field profile-field--stacked">
                    <span className="profile-field__label">
                      Backlog Status
                    </span>
                    <strong>
                      {formatBacklogStatus(
                        profile.backlogStatus
                      )}
                    </strong>
                  </div>

                </div>

              ) : (

                <div className="profile-form-stack">

                  <label className="profile-form-field">
                    <span>College</span>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="profile-form-field">
                    <span>Roll Number</span>
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="profile-form-field">
                    <span>Course</span>
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="profile-form-field">
                    <span>Branch</span>
                    <input
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="profile-form-field">
                    <span>Year</span>

                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Year
                      </option>

                      <option value="1">
                        1st Year
                      </option>

                      <option value="2">
                        2nd Year
                      </option>

                      <option value="3">
                        3rd Year
                      </option>

                      <option value="4">
                        4th Year
                      </option>
                    </select>
                  </label>

                  <label className="profile-form-field">
                    <span>Semester</span>

                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Semester
                      </option>

                      {[1, 2, 3, 4, 5, 6, 7, 8].map(
                        (semester) => (
                          <option
                            key={semester}
                            value={semester}
                          >
                            Semester {semester}
                          </option>
                        )
                      )}
                    </select>
                  </label>

                  <label className="profile-form-field">
                    <span>CGPA</span>

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      inputMode="decimal"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleChange}
                      placeholder="Enter CGPA"
                    />
                  </label>

                  <label className="profile-form-field">
                    <span>
                      Graduation Year
                    </span>

                    <input
                      type="number"
                      min="2000"
                      max="2100"
                      name="graduationYear"
                      value={
                        formData.graduationYear
                      }
                      onChange={handleChange}
                      placeholder="Enter Graduation Year"
                    />
                  </label>

                  <label className="profile-form-field">
                    <span>
                      Backlog Status
                    </span>

                    <select
                      name="backlogStatus"
                      value={
                        formData.backlogStatus
                      }
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Backlog Status
                      </option>

                      <option value="no-backlog">
                        No Backlog
                      </option>

                      <option value="active-backlog">
                        Active Backlog
                      </option>

                      <option value="dead-backlog">
                        Dead Backlog
                      </option>
                    </select>
                  </label>

                </div>

              )}

            </section>

            {/* ==================================
                SKILLS
            ================================== */}

            <section className="panel profile-card">

              <div className="profile-card__header">
                <h2>
                  Skills
                </h2>

                <p className="muted-text">
                  Skills extracted from your resume
                  are automatically shown here.
                </p>
              </div>

              {!isEditing ? (

                <div className="skill-chip-list">

                  {profile.skills?.length ? (

                    profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="skill-chip"
                      >
                        {skill}
                      </span>
                    ))

                  ) : (

                    <p className="muted-text">
                      No skills added yet.
                    </p>

                  )}

                </div>

              ) : (

                <div className="profile-skill-manager">

                  <div className="profile-skill-input-row">

                    <input
                      type="text"
                      placeholder="Add a custom skill"
                      value={newSkill}
                      onChange={(event) =>
                        setNewSkill(
                          event.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleSkillAdd}
                    >
                      Add Skill
                    </button>

                  </div>

                  <div className="skill-chip-list skill-chip-list--editable">

                    {formData.skills.map(
                      (skill) => (
                        <button
                          type="button"
                          key={skill}
                          className="skill-chip skill-chip--removable"
                          onClick={() =>
                            handleSkillRemove(
                              skill
                            )
                          }
                        >
                          {skill}

                          <span>
                            ×
                          </span>
                        </button>
                      )
                    )}

                  </div>

                </div>

              )}

            </section>

            {/* ==================================
                RESUME
            ================================== */}

            <section className="panel profile-card">

              <div className="profile-card__header">
                <h2>
                  Resume
                </h2>
              </div>

              {resumeMessage && (
                <div className="alert alert-success">
                  {resumeMessage}
                </div>
              )}

              {resumeError && (
                <div className="alert alert-error">
                  {resumeError}
                </div>
              )}

              <div className="profile-resume-card">

                <div>
                  <p className="profile-field__label">
                    Resume Status
                  </p>

                  <strong>
                    {resumeStatus
                      ? resumeStatus.fileName
                      : "No Resume Uploaded"}
                  </strong>

                  {resumeStatus?.uploadedAt && (
                    <p className="muted-text">
                      Uploaded:{" "}
                      {formatDate(
                        resumeStatus.uploadedAt
                      )}
                    </p>
                  )}
                </div>

                <div className="profile-resume-actions">

                  {!resumeStatus ? (

                    <>
                      <input
                        type="file"
                        name="profileResume"
                        accept=".pdf,application/pdf"
                        onChange={(event) =>
                          setResumeFile(
                            event.target.files?.[0] ||
                              null
                          )
                        }
                      />

                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={
                          handleResumeUpload
                        }
                        disabled={
                          uploadingResume ||
                          !resumeFile
                        }
                      >
                        {uploadingResume
                          ? "Uploading..."
                          : "Upload Resume"}
                      </button>
                    </>

                  ) : (

                    <>
                      <a
                        className="btn btn-secondary"
                        href={
                          resumeStatus.fileUrl ||
                          "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Resume
                      </a>

                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                          setResumeStatus(null)
                        }
                      >
                        Replace Resume
                      </button>
                    </>

                  )}

                </div>

              </div>

              {resumeStatus && (
                <div className="profile-note-card">

                  <p>
                    Your resume has been uploaded.
                    Resume analysis, AI match score,
                    skill gap analysis, and AI
                    suggestions are available through
                    the AI Mentor.
                  </p>

                  {extractingSkills && (
                    <p className="muted-text">
                      Extracting resume skills...
                    </p>
                  )}

                  {resumeSkillsError && (
                    <div className="alert alert-error">
                      {resumeSkillsError}
                    </div>
                  )}

                  {resumeSkills.length > 0 && (
                    <p className="muted-text">
                      {resumeSkills.length} skills
                      extracted from your resume
                      and added to your Skills section.
                    </p>
                  )}

                </div>
              )}

            </section>

            {/* ==================================
                SOCIAL & CODING PROFILES
            ================================== */}

            <section className="panel profile-card">

              <div className="profile-card__header">
                <h2>
                  Social & Coding Profiles
                </h2>
              </div>

              {!isEditing ? (

                <div className="profile-stack-list">

                  <div className="profile-field profile-field--stacked">

                    <span className="profile-field__label">
                      LinkedIn
                    </span>

                    {profile.linkedin ? (

                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {profile.linkedin}
                      </a>

                    ) : (

                      <strong>
                        Not updated
                      </strong>

                    )}

                  </div>

                  <div className="profile-field profile-field--stacked">

                    <span className="profile-field__label">
                      GitHub
                    </span>

                    {profile.github ? (

                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {profile.github}
                      </a>

                    ) : (

                      <strong>
                        Not updated
                      </strong>

                    )}

                  </div>

                  <div className="profile-field profile-field--stacked">

                    <span className="profile-field__label">
                      LeetCode
                    </span>

                    {profile.leetcode ? (

                      <a
                        href={profile.leetcode}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {profile.leetcode}
                      </a>

                    ) : (

                      <strong>
                        Not updated
                      </strong>

                    )}

                  </div>

                </div>

              ) : (

                <div className="profile-form-stack">

                  <label className="profile-form-field">
                    <span>
                      LinkedIn
                    </span>

                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/your-profile"
                    />
                  </label>

                  <label className="profile-form-field">
                    <span>
                      GitHub
                    </span>

                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="https://github.com/your-username"
                    />
                  </label>

                  <label className="profile-form-field">
                    <span>
                      LeetCode
                    </span>

                    <input
                      type="url"
                      name="leetcode"
                      value={formData.leetcode}
                      onChange={handleChange}
                      placeholder="https://leetcode.com/your-username"
                    />
                  </label>

                </div>

              )}

            </section>

            {/* ==================================
                ACCOUNT INFORMATION
            ================================== */}

            <section className="panel profile-card">

              <div className="profile-card__header">
                <h2>
                  Account Information
                </h2>
              </div>

              <div className="profile-stack-list">

                <div className="profile-field profile-field--stacked">

                  <span className="profile-field__label">
                    Account Type
                  </span>

                  <strong>
                    {profile.role ||
                      "student"}
                  </strong>

                </div>

                <div className="profile-field profile-field--stacked">

                  <span className="profile-field__label">
                    College
                  </span>

                  <strong>
                    {profile.college ||
                      "Not updated"}
                  </strong>

                </div>

                <div className="profile-field profile-field--stacked">

                  <span className="profile-field__label">
                    Authentication Email
                  </span>

                  <strong>
                    {profile.email ||
                      "Not updated"}
                  </strong>

                </div>

                <div className="profile-field profile-field--stacked">

                  <span className="profile-field__label">
                    Member Since
                  </span>

                  <strong>
                    {formatDate(
                      profile.createdAt
                    )}
                  </strong>

                </div>

              </div>

            </section>

            {/* ==================================
                EDIT PROFILE BUTTONS
            ================================== */}

            <div className="profile-action-row">

              {!isEditing ? (

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    setIsEditing(true)
                  }
                >
                  Edit Profile
                </button>

              ) : (

                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </>

              )}

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default Profile;