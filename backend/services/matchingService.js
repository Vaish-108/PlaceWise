const { calculateMatchScore } = require("./matchScoreService");

/**
 * Compares a student against company requirements using the AI match score engine.
 * @param {Object} student
 * @param {Object} company
 * @param {string[]} resumeSkills
 * @returns {Object}
 */
const checkEligibility = (student, company, resumeSkills = []) =>
  calculateMatchScore({
    studentCGPA: student.cgpa,
    profileSkills: student.skills,
    resumeSkills,
    requiredSkills: company.requiredSkills,
    requiredCGPA: company.minCGPA,
  });

/**
 * Compares a student against job requirements using the AI match score engine.
 * @param {Object} student
 * @param {Object} job
 * @param {string[]} resumeSkills
 * @returns {Object}
 */
const checkJobMatch = (student, job, resumeSkills = []) =>
  calculateMatchScore({
    studentCGPA: student.cgpa,
    profileSkills: student.skills,
    resumeSkills,
    requiredSkills: job.requiredSkills,
    requiredCGPA: job.minCGPA,
  });

module.exports = {
  checkEligibility,
  checkJobMatch,
  calculateMatchScore,
};
