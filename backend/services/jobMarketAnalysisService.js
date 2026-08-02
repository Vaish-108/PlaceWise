const { calculateMatchScore } = require("./matchScoreService");
const { sanitizeSkills, normalizeSkill } = require("./skillMergeService");

/**
 * Evaluates a student against all available jobs and aggregates match insights.
 * @param {Object} student
 * @param {string[]} resumeSkills
 * @param {Object[]} jobs
 * @returns {Object}
 */
const analyzeJobMarketFit = (student, resumeSkills = [], jobs = []) => {
  if (!jobs.length) {
    return {
      matchScore: 0,
      averageMatchScore: 0,
      bestMatchScore: 0,
      missingSkills: [],
      matchedSkills: [],
      jobsAnalyzed: 0,
    };
  }

  const matchResults = jobs.map((job) =>
    calculateMatchScore({
      studentCGPA: student.cgpa,
      profileSkills: student.skills,
      resumeSkills,
      requiredSkills: job.requiredSkills,
      requiredCGPA: job.minCGPA,
    })
  );

  const averageMatchScore = Math.round(
    matchResults.reduce((total, result) => total + result.matchScore, 0) /
      matchResults.length
  );

  const bestMatchScore = Math.max(
    ...matchResults.map((result) => result.matchScore)
  );

  const missingSkillFrequency = new Map();

  matchResults.forEach((result) => {
    result.missingSkills.forEach((skill) => {
      const key = normalizeSkill(skill);
      missingSkillFrequency.set(key, {
        label: skill,
        count: (missingSkillFrequency.get(key)?.count || 0) + 1,
      });
    });
  });

  const missingSkills = Array.from(missingSkillFrequency.values())
    .sort((a, b) => b.count - a.count)
    .map((entry) => entry.label);

  const matchedSkillSet = new Set();

  matchResults.forEach((result) => {
    result.matchedSkills.forEach((skill) => {
      matchedSkillSet.add(normalizeSkill(skill));
    });
  });

  const mergedSkills = sanitizeSkills([
    ...(student.skills || []),
    ...resumeSkills,
  ]);

  const matchedSkills = mergedSkills.filter((skill) =>
    matchedSkillSet.has(normalizeSkill(skill))
  );

  return {
    matchScore: averageMatchScore,
    averageMatchScore,
    bestMatchScore,
    missingSkills,
    matchedSkills,
    jobsAnalyzed: jobs.length,
  };
};

module.exports = {
  analyzeJobMarketFit,
};
