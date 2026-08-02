const {
  mergeSkills,
  sanitizeSkills,
} = require("./skillMergeService");

const {
  analyzeJobMarketFit,
} = require("./jobMarketAnalysisService");

const {
  calculatePlacementReadiness,
  calculateAtsScore,
} = require("./placementReadinessService");

const {
  generateStrengths,
  generateWeaknesses,
  generateSuggestions,
  selectPriorityActions,
  generateEstimatedImprovement,
} = require("./suggestionAnalysisService");

const generatePlacementSuggestions = ({
  student,
  latestResume = null,
  jobs = [],
}) => {
  const profileSkills = sanitizeSkills(
    student?.skills || []
  );

  const resumeSkills = sanitizeSkills(
    latestResume?.extractedSkills || []
  );

  const mergedSkills = mergeSkills(
    profileSkills,
    resumeSkills
  );

  const hasResume = Boolean(latestResume);

  const hasResumeText = Boolean(
    latestResume?.resumeText
  );

  const marketAnalysis = analyzeJobMarketFit(
    student,
    resumeSkills,
    jobs
  );

  const {
    placementReadiness,
  } = calculatePlacementReadiness({
    cgpa: student?.cgpa,
    skillCount: mergedSkills.length,
    resume: latestResume,
    matchScore: marketAnalysis.matchScore,
  });

  const atsScore = calculateAtsScore({
    resume: latestResume,
    missingSkills: marketAnalysis.missingSkills,
    matchScore: marketAnalysis.matchScore,
  });

  const strengths = generateStrengths({
    cgpa: student?.cgpa,
    profileSkills,
    resumeSkills,
    mergedSkills,
    matchScore: marketAnalysis.matchScore,
    hasResume,
    resumeText: latestResume?.resumeText || "",
  });

  const weaknesses = generateWeaknesses({
    cgpa: student?.cgpa,
    mergedSkills,
    missingSkills: marketAnalysis.missingSkills,
    matchScore: marketAnalysis.matchScore,
    hasResume,
    resumeText: latestResume?.resumeText || "",
    resumeSkills,
  });

  const suggestions = generateSuggestions({
    missingSkills: marketAnalysis.missingSkills,
    mergedSkills,
    hasResume,
    resumeSkillCount: resumeSkills.length,
    matchScore: marketAnalysis.matchScore,
    resumeText: latestResume?.resumeText || "",
  });

  const priorityActions = selectPriorityActions(
    suggestions,
    weaknesses,
    marketAnalysis.missingSkills
  );

  const estimatedImprovement =
    generateEstimatedImprovement(
      placementReadiness,
      priorityActions
    );

  return {
    placementReadiness,
    atsScore,
    strengths,
    weaknesses,
    suggestions,
    priorityActions,
    estimatedImprovement,
    analysisContext: {
      resumeExists: hasResume,
      resumeTextAvailable: hasResumeText,
      profileSkills,
      resumeSkills,
      extractedSkills: resumeSkills,
      mergedSkillCount: mergedSkills.length,
      studentCGPA: Number(student?.cgpa) || 0,
      matchScore: marketAnalysis.matchScore,
      bestMatchScore: marketAnalysis.bestMatchScore,
      missingSkills: marketAnalysis.missingSkills,
      jobsAnalyzed: marketAnalysis.jobsAnalyzed,
    },
  };
};

module.exports = {
  generatePlacementSuggestions,
};
