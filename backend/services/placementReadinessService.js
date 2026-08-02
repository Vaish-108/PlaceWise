const CGPA_WEIGHT = 25;
const TECHNICAL_SKILLS_WEIGHT = 35;
const RESUME_COMPLETENESS_WEIGHT = 20;
const MATCH_SCORE_WEIGHT = 20;

const SKILL_TARGET_COUNT = 10;
const MAX_CGPA = 10;

/**
 * Scores CGPA on a 0–25 scale (assumes 10-point scale).
 * @param {number} cgpa
 * @returns {number}
 */
const calculateCgpaScore = (cgpa = 0) => {
  const normalizedCgpa = Math.max(0, Math.min(Number(cgpa), MAX_CGPA));
  return (normalizedCgpa / MAX_CGPA) * CGPA_WEIGHT;
};

/**
 * Scores technical breadth on a 0–35 scale based on unique skill count.
 * @param {number} skillCount
 * @returns {number}
 */
const calculateTechnicalSkillsScore = (skillCount = 0) => {
  const normalizedCount = Math.max(0, Math.min(Number(skillCount), SKILL_TARGET_COUNT));
  return (normalizedCount / SKILL_TARGET_COUNT) * TECHNICAL_SKILLS_WEIGHT;
};

/**
 * Scores resume completeness on a 0–20 scale.
 * @param {Object|null} resume
 * @returns {number}
 */
const calculateResumeCompletenessScore = (resume = null) => {
  if (!resume) {
    return 0;
  }

  let score = 10;

  if (resume.extractedSkills?.length > 0) {
    score += 5;
  }

  if (resume.resumeText && resume.resumeText.trim().length >= 100) {
    score += 5;
  }

  return Math.min(score, RESUME_COMPLETENESS_WEIGHT);
};

/**
 * Scores market match on a 0–20 scale.
 * @param {number} matchScore
 * @returns {number}
 */
const calculateMatchContribution = (matchScore = 0) => {
  const normalizedMatch = Math.max(0, Math.min(Number(matchScore), 100));
  return (normalizedMatch / 100) * MATCH_SCORE_WEIGHT;
};

/**
 * Calculates an ATS-style resume score using resume text, extracted skills, missing skill penalties, and job fit.
 * @param {Object|null} params
 * @returns {number}
 */
const calculateAtsScore = ({ resume = null, missingSkills = [], matchScore = 0 }) => {
  if (!resume) {
    return 0;
  }

  const textLength = resume.resumeText?.trim().length || 0;
  let textScore = 0;

  if (textLength >= 400) {
    textScore = 30;
  } else if (textLength >= 200) {
    textScore = 20;
  } else if (textLength >= 100) {
    textScore = 10;
  }

  const extractedSkillCount = Math.min(SKILL_TARGET_COUNT, resume.extractedSkills?.length || 0);
  const skillScore = Math.round((extractedSkillCount / SKILL_TARGET_COUNT) * 30);

  const fitScore = Math.round(Math.max(0, Math.min(100, matchScore)) * 0.2);

  const missingPenalty = Math.max(0, 20 - Math.min(missingSkills.length * 3, 20));

  return Math.min(100, Math.round(textScore + skillScore + fitScore + missingPenalty));
};

/**
 * Calculates overall placement readiness (0–100).
 * @param {Object} params
 * @returns {Object}
 */
const calculatePlacementReadiness = ({
  cgpa = 0,
  skillCount = 0,
  resume = null,
  matchScore = 0,
}) => {
  const cgpaScore = calculateCgpaScore(cgpa);
  const technicalSkillsScore = calculateTechnicalSkillsScore(skillCount);
  const resumeCompletenessScore = calculateResumeCompletenessScore(resume);
  const matchContribution = calculateMatchContribution(matchScore);

  const placementReadiness = Math.round(
    cgpaScore + technicalSkillsScore + resumeCompletenessScore + matchContribution
  );

  return {
    placementReadiness,
    breakdown: {
      cgpaScore: Math.round(cgpaScore * 100) / 100,
      technicalSkillsScore: Math.round(technicalSkillsScore * 100) / 100,
      resumeCompletenessScore,
      matchContribution: Math.round(matchContribution * 100) / 100,
    },
  };
};

module.exports = {
  calculatePlacementReadiness,
  calculateAtsScore,
  calculateCgpaScore,
  calculateTechnicalSkillsScore,
  calculateResumeCompletenessScore,
  calculateMatchContribution,
  CGPA_WEIGHT,
  TECHNICAL_SKILLS_WEIGHT,
  RESUME_COMPLETENESS_WEIGHT,
  MATCH_SCORE_WEIGHT,
};
