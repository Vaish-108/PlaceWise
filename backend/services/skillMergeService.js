const normalizeSkill = (skill) => skill.trim().toLowerCase();

/**
 * Returns sanitized skill arrays with empty values removed.
 * @param {string[]} skills
 * @returns {string[]}
 */
const sanitizeSkills = (skills = []) =>
  skills
    .filter((skill) => skill && typeof skill === "string")
    .map((skill) => skill.trim())
    .filter(Boolean);

/**
 * Builds a deduplicated skill list from profile and resume skills.
 * Comparison is case-insensitive; the first occurrence keeps its original casing.
 * @param {string[]} profileSkills
 * @param {string[]} resumeSkills
 * @returns {string[]} Merged skill list
 */
const buildMergedSkillList = (profileSkills = [], resumeSkills = []) => {
  const merged = [];
  const seen = new Set();

  const addSkill = (skill) => {
    if (!skill || typeof skill !== "string") {
      return;
    }

    const trimmed = skill.trim();

    if (!trimmed) {
      return;
    }

    const normalized = normalizeSkill(trimmed);

    if (seen.has(normalized)) {
      return;
    }

    seen.add(normalized);
    merged.push(trimmed);
  };

  sanitizeSkills(profileSkills).forEach(addSkill);
  sanitizeSkills(resumeSkills).forEach(addSkill);

  return merged;
};

/**
 * Merges profile and resume skills into a deduplicated list.
 * Comparison is case-insensitive; the first occurrence keeps its original casing.
 * @param {string[]} profileSkills
 * @param {string[]} resumeSkills
 * @returns {string[]} Merged skill list
 */
const mergeSkills = (profileSkills = [], resumeSkills = []) =>
  buildMergedSkillList(profileSkills, resumeSkills);

module.exports = {
  buildMergedSkillList,
  mergeSkills,
  sanitizeSkills,
  normalizeSkill,
};
