const {
  mergeSkills,
  sanitizeSkills,
  normalizeSkill,
} = require("./skillMergeService");
const { generateRecommendation } = require("./recommendationService");

const SKILL_WEIGHT = 70;
const CGPA_WEIGHT = 30;

/**
 * Calculates AI match score using merged profile + resume skills against requirements.
 * @param {Object} params
 * @param {number} params.studentCGPA
 * @param {string[]} params.profileSkills
 * @param {string[]} params.resumeSkills
 * @param {string[]} params.requiredSkills
 * @param {number} params.requiredCGPA
 * @returns {Object} Match result payload
 */
const calculateMatchScore = ({
  studentCGPA = 0,
  profileSkills = [],
  resumeSkills = [],
  requiredSkills = [],
  requiredCGPA = 0,
}) => {
  const cleanProfileSkills = sanitizeSkills(profileSkills);
  const cleanResumeSkills = sanitizeSkills(resumeSkills);
  const cleanRequiredSkills = sanitizeSkills(requiredSkills);
  const mergedSkills = mergeSkills(cleanProfileSkills, cleanResumeSkills);

  const normalizedMerged = mergedSkills.map(normalizeSkill);

  const matchedSkills = [];
  const missingSkills = [];

  cleanRequiredSkills.forEach((requiredSkill) => {
    if (normalizedMerged.includes(normalizeSkill(requiredSkill))) {
      matchedSkills.push(requiredSkill);
    } else {
      missingSkills.push(requiredSkill);
    }
  });

  const cgpaMatched = Number(studentCGPA) >= Number(requiredCGPA);
  const cgpaScore = cgpaMatched ? CGPA_WEIGHT : 0;

  let skillScore = 0;

  if (cleanRequiredSkills.length === 0) {
    skillScore = SKILL_WEIGHT;
  } else {
    skillScore =
      (matchedSkills.length / cleanRequiredSkills.length) * SKILL_WEIGHT;
  }

  const matchScore = Math.round(skillScore + cgpaScore);
  const eligible = cgpaMatched && missingSkills.length === 0;

  return {
    matchScore,
    eligible,
    cgpaMatched,
    requiredCGPA: Number(requiredCGPA),
    studentCGPA: Number(studentCGPA),
    matchedSkills,
    missingSkills,
    resumeSkills: cleanResumeSkills,
    profileSkills: cleanProfileSkills,
    recommendation: generateRecommendation(missingSkills),
  };
};

module.exports = {
  calculateMatchScore,
  SKILL_WEIGHT,
  CGPA_WEIGHT,
};
