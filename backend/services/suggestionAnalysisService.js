const { mergeSkills, sanitizeSkills, normalizeSkill } = require("./skillMergeService");

const CLOUD_SKILLS = [
  "aws",
  "amazon web services",
  "azure",
  "gcp",
  "google cloud platform",
  "docker",
  "kubernetes",
  "terraform",
];

const BACKEND_SKILLS = [
  "node.js",
  "express",
  "express.js",
  "java",
  "spring",
  "spring boot",
  "python",
  "django",
  "flask",
  "fastapi",
  "mongodb",
  "postgresql",
  "mysql",
  "sql",
];

const FRONTEND_SKILLS = [
  "react",
  "angular",
  "vue",
  "javascript",
  "typescript",
  "html",
  "css",
];

const DSA_SKILLS = [
  "dsa",
  "data structures",
  "algorithms",
  "competitive programming",
];

const FULL_STACK_INDICATORS = [
  ...FRONTEND_SKILLS,
  ...BACKEND_SKILLS,
  "mongodb",
  "sql",
  "rest api",
  "graphql",
];

const hasSkillMatch = (skills, dictionary) => {
  const normalizedSkills = skills.map(normalizeSkill);
  return dictionary.some((term) => normalizedSkills.includes(normalizeSkill(term)));
};

const getTopProfileSkills = (profileSkills = [], limit = 2) =>
  sanitizeSkills(profileSkills).slice(0, limit);

const hasResumeTextContent = (resumeText = "") => {
  if (!resumeText) {
    return false;
  }

  const normalizedText = resumeText.toLowerCase();
  return [
    "project",
    "academic project",
    "capstone",
    "internship",
    "intern",
    "work experience",
    "professional experience",
    "training",
    "certification",
    "certificate",
    "achievement",
  ].some((term) => normalizedText.includes(term));
};

const hasProjectOrExperienceContent = (resumeText = "") => {
  if (!resumeText) {
    return false;
  }

  const normalizedText = resumeText.toLowerCase();
  return [
    "project",
    "academic project",
    "capstone",
    "internship",
    "intern",
    "work experience",
    "professional experience",
  ].some((term) => normalizedText.includes(term));
};

const hasCertificationContent = (resumeText = "") => {
  if (!resumeText) {
    return false;
  }

  const normalizedText = resumeText.toLowerCase();
  return [
    "certification",
    "certified",
    "certificate",
    "training program",
    "coursework",
    "online course",
  ].some((term) => normalizedText.includes(term));
};

/**
 * Generates profile strengths based on student data.
 * @param {Object} params
 * @returns {string[]}
 */
const generateStrengths = ({
  cgpa = 0,
  profileSkills = [],
  resumeSkills = [],
  mergedSkills = [],
  matchScore = 0,
  hasResume = false,
  resumeText = "",
}) => {
  const strengths = [];

  const topSkills = getTopProfileSkills(profileSkills);

  topSkills.forEach((skill) => {
    strengths.push(`Strong ${skill} Skills`);
  });

  if (Number(cgpa) >= 8) {
    strengths.push("Good CGPA");
  } else if (Number(cgpa) >= 7) {
    strengths.push("Decent Academic Performance");
  }

  if (hasResume) {
    strengths.push("Resume Uploaded");
  }

  if (resumeText && resumeText.trim().length >= 100) {
    strengths.push("Resume contains readable text for review");
  }

  if (resumeSkills.length >= 3) {
    strengths.push("Resume includes technical skills");
  }

  if (hasProjectOrExperienceContent(resumeText)) {
    strengths.push("Resume highlights projects or experience");
  }

  if (hasCertificationContent(resumeText)) {
    strengths.push("Resume mentions certifications or training");
  }

  if (mergedSkills.length >= 8) {
    strengths.push("Good skill coverage in profile and resume");
  }

  if (matchScore >= 75) {
    strengths.push("Strong job market match");
  }

  return [...new Set(strengths)];
};

/**
 * Generates profile weaknesses based on gaps.
 * @param {Object} params
 * @returns {string[]}
 */
const generateWeaknesses = ({
  cgpa = 0,
  mergedSkills = [],
  missingSkills = [],
  matchScore = 0,
  hasResume = false,
  resumeText = "",
  resumeSkills = [],
}) => {
  const weaknesses = [];
  const normalizedMerged = mergedSkills.map(normalizeSkill);
  const normalizedMissing = missingSkills.map(normalizeSkill);

  if (mergedSkills.length < 5) {
    weaknesses.push("Low skill coverage");
  }

  if (
    normalizedMissing.some((skill) =>
      CLOUD_SKILLS.some((cloudSkill) => skill.includes(cloudSkill))
    ) ||
    !hasSkillMatch(normalizedMerged, CLOUD_SKILLS)
  ) {
    weaknesses.push("Missing cloud skills");
  }

  if (!hasSkillMatch(normalizedMerged, BACKEND_SKILLS)) {
    weaknesses.push("Weak backend skills");
  }

  if (!hasSkillMatch(normalizedMerged, FRONTEND_SKILLS)) {
    weaknesses.push("Weak frontend skills");
  }

  if (!hasSkillMatch(normalizedMerged, DSA_SKILLS)) {
    weaknesses.push("Limited DSA preparation");
  }

  if (Number(cgpa) > 0 && Number(cgpa) < 7) {
    weaknesses.push("CGPA below placement threshold");
  }

  if (hasResume && !resumeText) {
    weaknesses.push("Resume text could not be parsed or is not available");
  }

  if (hasResume && resumeText && resumeText.trim().length < 200) {
    weaknesses.push("Resume text is short and may lack sufficient detail");
  }

  if (hasResume && !resumeSkills.length) {
    weaknesses.push("Resume has few or no extractable technical skills");
  }

  if (hasResume && !hasProjectOrExperienceContent(resumeText)) {
    weaknesses.push("Resume lacks a clear project or experience section");
  }

  if (hasResume && !hasCertificationContent(resumeText)) {
    weaknesses.push("Resume does not mention certifications or training");
  }

  if (!hasResume) {
    weaknesses.push("No resume uploaded");
  }

  if (matchScore < 60) {
    weaknesses.push("Low job market match");
  }

  return [...new Set(weaknesses)];
};

/**
 * Builds actionable improvement suggestions.
 * @param {Object} params
 * @returns {string[]}
 */
const generateSuggestions = ({
  missingSkills = [],
  mergedSkills = [],
  hasResume = false,
  resumeSkillCount = 0,
  matchScore = 0,
  resumeText = "",
}) => {
  const suggestions = [];
  const normalizedMerged = mergedSkills.map(normalizeSkill);

  missingSkills.slice(0, 5).forEach((skill) => {
    suggestions.push(`Learn ${skill}`);
  });

  if (!hasSkillMatch(normalizedMerged, DSA_SKILLS)) {
    suggestions.push("Practice DSA");
  }

  if (!hasResume) {
    suggestions.push("Upload a searchable resume PDF");
  } else if (!resumeText) {
    suggestions.push("Use a text-based resume that can be parsed by ATS");
  }

  if (hasResume && resumeSkillCount < 3) {
    suggestions.push("Add more technical skills and tools to your resume");
  }

  if (hasResume && !hasProjectOrExperienceContent(resumeText)) {
    suggestions.push("Add project or internship details to the resume");
  }

  if (hasResume && !hasCertificationContent(resumeText)) {
    suggestions.push("Mention certifications, training, or coursework on the resume");
  }

  if (!hasSkillMatch(normalizedMerged, FULL_STACK_INDICATORS)) {
    suggestions.push("Build full stack projects to strengthen practical experience");
  }

  if (matchScore < 80) {
    suggestions.push("Align your profile and resume with target job requirements");
  }

  if (!hasResume || resumeSkillCount === 0) {
    suggestions.push("Improve resume content and structure");
  }

  return [...new Set(suggestions)];
};

/**
 * Assigns priority scores and returns top 3 actions.
 * @param {string[]} suggestions
 * @param {string[]} weaknesses
 * @param {string[]} missingSkills
 * @returns {string[]}
 */
const selectPriorityActions = (suggestions = [], weaknesses = [], missingSkills = []) => {
  const priorityMap = new Map();

  const addPriority = (action, score) => {
    const current = priorityMap.get(action) || 0;
    priorityMap.set(action, current + score);
  };

  missingSkills.slice(0, 3).forEach((skill, index) => {
    addPriority(`Learn ${skill}`, 30 - index * 5);
  });

  suggestions.forEach((suggestion) => {
    if (suggestion.startsWith("Learn ")) {
      addPriority(suggestion, 20);
    }
  });

  if (weaknesses.includes("No resume uploaded")) {
    addPriority("Upload a searchable resume PDF", 25);
  }

  if (weaknesses.includes("Limited DSA preparation")) {
    addPriority("Practice DSA", 22);
  }

  if (weaknesses.includes("Missing cloud skills")) {
    const cloudSuggestion = suggestions.find((item) =>
      ["Learn AWS", "Learn Docker", "Learn Kubernetes", "Learn Azure"].includes(item)
    );
    if (cloudSuggestion) {
      addPriority(cloudSuggestion, 24);
    }
  }

  if (weaknesses.includes("Weak backend skills")) {
    addPriority("Build full stack projects to strengthen practical experience", 18);
  }

  if (weaknesses.includes("Low job market match")) {
    addPriority("Align your profile and resume with target job requirements", 16);
  }

  suggestions.forEach((suggestion) => {
    if (!priorityMap.has(suggestion)) {
      addPriority(suggestion, 10);
    }
  });

  return Array.from(priorityMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([action]) => action);
};

/**
 * Estimates potential readiness improvement from priority actions.
 * @param {number} placementReadiness
 * @param {string[]} priorityActions
 * @returns {string}
 */
const generateEstimatedImprovement = (placementReadiness = 0, priorityActions = []) => {
  if (!priorityActions.length) {
    return "Your profile is already strong. Focus on interview preparation and mock placements.";
  }

  const remainingGap = Math.max(0, 100 - placementReadiness);
  const impactPerAction = Math.min(8, Math.max(4, Math.round(remainingGap / 6)));
  const lowerBound = Math.min(remainingGap, impactPerAction * priorityActions.length);
  const upperBound = Math.min(
    remainingGap,
    Math.round(lowerBound * 1.3) || lowerBound + 3
  );

  if (lowerBound === upperBound) {
    return `Completing the priority actions may improve your placement readiness by approximately ${lowerBound}%.`;
  }

  return `Completing the priority actions may improve your placement readiness by approximately ${lowerBound}–${upperBound}%.`;
};

module.exports = {
  generateStrengths,
  generateWeaknesses,
  generateSuggestions,
  selectPriorityActions,
  generateEstimatedImprovement,
};
