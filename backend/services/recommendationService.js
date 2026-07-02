/**
 * Builds a human-readable recommendation based on missing skills.
 * @param {string[]} missingSkills
 * @returns {string}
 */
const generateRecommendation = (missingSkills = []) => {
  if (missingSkills.length === 0) {
    return "Excellent profile. You satisfy most requirements.";
  }

  if (missingSkills.length === 1) {
    return `Improve your profile by learning ${missingSkills[0]}.`;
  }

  const leadingSkills = missingSkills.slice(0, -1).join(", ");
  const lastSkill = missingSkills[missingSkills.length - 1];

  return `Improve your profile by learning ${leadingSkills} and ${lastSkill}.`;
};

module.exports = {
  generateRecommendation,
};
