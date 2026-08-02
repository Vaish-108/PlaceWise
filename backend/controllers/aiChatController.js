const Student = require("../models/Student");
const Resume = require("../models/Resume");
const Job = require("../models/Job");

const {
  generatePlacementSuggestions,
} = require("../services/aiSuggestionService");

const {
  extractSkillsFromText,
} = require("../services/skillExtractionService");

const {
  sanitizeSkills,
} = require("../services/skillMergeService");

const {
  generateResponse,
} = require("../services/groqService");

// ============================================================
// GENERAL QUESTION KEYWORDS
// ============================================================

const GENERAL_QUESTION_KEYWORDS = [
  "binary search",
  "tcp",
  "udp",
  "react hooks",
  "javascript",
  "c++",
  "sql",
  "dynamic programming",
  "machine learning",
  "closures",
  "bfs",
  "dfs",
  "leetcode",
  "docker",
  "kubernetes",
  "system design",
  "operating system",
  "dbms",
  "network",
  "oop",
  "mern",
  "node.js",
  "mongodb",
  "express",
  "what is",
  "explain",
  "difference between",
  "write",
  "solve",
  "generate",
  "code",
  "algorithm",
  "complexity",
  "interview question",
];

// ============================================================
// PROFILE / RESUME QUESTION KEYWORDS
// ============================================================

const PROFILE_QUESTION_KEYWORDS = [
  "resume",
  "ats",
  "placement ready",
  "placement readiness",
  "roadmap",
  "skills should",
  "company match",
  "eligible",
  "profile",
  "strength",
  "weakness",
  "suggest projects",
  "prepare me",
  "interview prep",
  "company preparation",
  "improve my resume",
  "analyze my resume",
  "analyze my profile",
  "review my",
  "my resume",
  "my profile",
  "missing skills",
  "match score",
  "priority actions",
  "career guidance",
];

// ============================================================
// NORMALIZE TEXT
// ============================================================

const normalizeText = (value) => {
  return typeof value === "string"
    ? value.trim()
    : "";
};

// ============================================================
// CLASSIFY QUESTION
// ============================================================

const classifyQuestion = (
  message
) => {
  const normalized =
    normalizeText(message).toLowerCase();

  if (!normalized) {
    return "general";
  }

  const isProfileQuestion =
    PROFILE_QUESTION_KEYWORDS.some(
      (keyword) =>
        normalized.includes(keyword)
    );

  const isGeneralQuestion =
    GENERAL_QUESTION_KEYWORDS.some(
      (keyword) =>
        normalized.includes(keyword)
    );

  if (
    isProfileQuestion &&
    !isGeneralQuestion
  ) {
    return "profile";
  }

  if (
    isProfileQuestion &&
    isGeneralQuestion
  ) {
    if (
      normalized.startsWith(
        "what is"
      ) ||
      normalized.startsWith(
        "explain"
      ) ||
      normalized.startsWith(
        "difference between"
      )
    ) {
      return "general";
    }

    return "profile";
  }

  return "general";
};

// ============================================================
// CONVERSATION HISTORY
// ============================================================

const buildConversationHistoryPrompt = (
  history = []
) => {
  const recentHistory =
    Array.isArray(history)
      ? history.slice(
          -20
        )
      : [];

  if (
    !recentHistory.length
  ) {
    return "Conversation History: None";
  }

  const lines = [
    "CONVERSATION HISTORY",
  ];

  recentHistory.forEach(
    (entry) => {
      const role =
        entry?.role ===
        "user"
          ? "User"
          : "Assistant";

      const content =
        normalizeText(
          entry?.content
        );

      if (content) {
        lines.push(
          `${role}: ${content}`
        );
      }
    }
  );

  return lines.join("\n");
};

// ============================================================
// GENERAL AI PROMPT
// ============================================================

const buildGeneralPrompt = ({
  message,
  history,
}) => [
  "=========================================",
  "ROLE",
  "=========================================",
  "You are PlaceWise AI Mentor.",
  "",
  "You are an intelligent placement mentor and software engineering assistant.",
  "",
  "You can answer:",
  "• DSA",
  "• Coding",
  "• React",
  "• Node.js",
  "• MongoDB",
  "• Express",
  "• JavaScript",
  "• C++",
  "• DBMS",
  "• Operating Systems",
  "• Computer Networks",
  "• OOPS",
  "• Machine Learning",
  "• AI",
  "• Resume Review",
  "• Placement Preparation",
  "• Career Guidance",
  "• HR Questions",
  "• Interview Preparation",
  "• Company Preparation",
  "• System Design",
  "",
  "Answer naturally using your own knowledge exactly like ChatGPT when the question is general.",
  "Never force resume or profile information into unrelated questions.",
  "Never mention the student's profile unless it is relevant to the question.",
  "",
  "=========================================",
  "CONVERSATION HISTORY",
  "=========================================",
  buildConversationHistoryPrompt(
    history
  ),
  "",
  "=========================================",
  "USER QUESTION",
  "=========================================",
  `Current Message: ${message.trim()}`,
  "",
  "=========================================",
  "FORMATTING",
  "=========================================",
  "Always answer using markdown.",
  "Use headings.",
  "Use bullet points.",
  "Use numbered lists.",
  "Use code blocks when helpful.",
  "Keep the answer clear and professional.",
].join("\n");

// ============================================================
// PLACEMENT / RESUME AI PROMPT
// ============================================================

const buildPlacementPrompt = ({
  student,
  latestResume,
  jobs,
  aiSuggestions,
  message,
  history,
}) => [
  "=========================================",
  "ROLE",
  "=========================================",
  "You are PlaceWise AI Mentor.",
  "",
  "You are an intelligent placement mentor and software engineering assistant.",
  "",
  "When the user's question requires personal information, use the provided student profile and resume.",
  "",
  "When the user asks about their resume, analyze the actual resume text provided below.",
  "",
  "When the user asks about skills, use both:",
  "1. Skills extracted from the resume.",
  "2. Skills manually present in the student profile.",
  "",
  "Never invent information.",
  "Only use the student's real backend data when relevant.",
  "If information is unavailable, clearly mention it instead of guessing.",
  "",
  "=========================================",
  "STUDENT PROFILE",
  "=========================================",
  `Name: ${
    student.name ||
    "Not provided in backend data"
  }`,
  `College: ${
    student.college ||
    "Not provided in backend data"
  }`,
  `Branch: ${
    student.branch ||
    "Not provided in backend data"
  }`,
  `Year: ${
    student.year ||
    "Not provided in backend data"
  }`,
  `Semester: ${
    student.semester ||
    "Not provided in backend data"
  }`,
  `CGPA: ${
    student.cgpa !== undefined &&
    student.cgpa !== null
      ? student.cgpa
      : "Not provided in backend data"
  }`,
  `Profile Skills: ${
    student.skills?.length
      ? student.skills.join(
          ", "
        )
      : "No manually added skills listed in backend data"
  }`,
  "",
  "=========================================",
  "RESUME INFORMATION",
  "=========================================",
  `Resume Available: ${
    latestResume
      ? "Yes"
      : "No"
  }`,
  `Resume File Name: ${
    latestResume?.fileName ||
    "No resume uploaded"
  }`,
  `Resume Uploaded At: ${
    latestResume?.uploadedAt ||
    "Not available"
  }`,
  `Resume Text Available: ${
    latestResume?.resumeText
      ? "Yes"
      : "No"
  }`,
  "",
  "EXTRACTED RESUME SKILLS:",
  latestResume?.extractedSkills
    ?.length
    ? latestResume.extractedSkills.join(
        ", "
      )
    : "No extracted skills available.",
  "",
  "FULL RESUME TEXT:",
  latestResume?.resumeText ||
    "No resume uploaded yet.",
  "",
  "=========================================",
  "AI PLACEMENT ANALYSIS",
  "=========================================",
  `Strengths: ${
    aiSuggestions?.strengths
      ?.length
      ? aiSuggestions.strengths.join(
          ", "
        )
      : "No strength analysis available."
  }`,
  `Weaknesses: ${
    aiSuggestions?.weaknesses
      ?.length
      ? aiSuggestions.weaknesses.join(
          ", "
        )
      : "No weakness analysis available."
  }`,
  `Missing Skills: ${
    aiSuggestions?.analysisContext
      ?.missingSkills?.length
      ? aiSuggestions.analysisContext.missingSkills.join(
          ", "
        )
      : "No missing skills available."
  }`,
  `Priority Actions: ${
    aiSuggestions?.priorityActions
      ?.length
      ? aiSuggestions.priorityActions.join(
          ", "
        )
      : "No priority actions available."
  }`,
  `Recommended Next Steps: ${
    aiSuggestions?.suggestions
      ?.length
      ? aiSuggestions.suggestions.join(
          ", "
        )
      : "No suggestions available."
  }`,
  `Estimated Improvement: ${
    aiSuggestions?.estimatedImprovement ||
    "Not available."
  }`,
  `Placement Readiness: ${
    aiSuggestions?.placementReadiness !==
      undefined &&
    aiSuggestions?.placementReadiness !==
      null
      ? aiSuggestions.placementReadiness
      : "Not available."
  }`,
  "",
  "=========================================",
  "AVAILABLE JOBS",
  "=========================================",
  jobs?.length
    ? jobs
        .map(
          (
            job,
            index
          ) => {
            const eligibleCGPA =
              job.minCGPA !==
                undefined &&
              job.minCGPA !==
                null
                ? job.minCGPA
                : "Not provided in backend data";

            const requiredSkills =
              job.requiredSkills
                ?.length
                ? job.requiredSkills.join(
                    ", "
                  )
                : "Not provided in backend data";

            const title =
              job.title ||
              "Not provided in backend data";

            return [
              `${index + 1}. Job Title: ${title}`,
              `   Eligible CGPA: ${eligibleCGPA}`,
              `   Required Skills: ${requiredSkills}`,
              "   Allowed Backlogs: Not provided in backend data",
              "   Location: Not provided in backend data",
              "   Batch: Not provided in backend data",
            ].join("\n");
          }
        )
        .join(
          "\n\n"
        )
    : "No jobs available in backend data.",
  "",
  "=========================================",
  "CONVERSATION HISTORY",
  "=========================================",
  buildConversationHistoryPrompt(
    history
  ),
  "",
  "=========================================",
  "USER QUESTION",
  "=========================================",
  `Current Message: ${message.trim()}`,
  "",
  "=========================================",
  "RESPONSE RULES",
  "=========================================",
  "1. Use actual resume data when the user asks about their resume.",
  "2. Use actual extracted resume skills when discussing resume skills.",
  "3. Clearly distinguish manually added profile skills from extracted resume skills.",
  "4. Never claim that a skill exists in the resume if it is not present in the provided resume text.",
  "5. Never invent projects, experience, certifications, or achievements.",
  "6. If resume text is unavailable, clearly explain that detailed resume analysis cannot be performed yet.",
  "7. If the resume exists but no skills were extracted, analyze the actual resume text manually and identify skills that are clearly present.",
  "8. If ATS improvement is requested, review resume structure, keywords, clarity, measurable achievements, projects, skills, and formatting based on the actual resume text.",
  "9. If roadmap is requested, create a day-wise roadmap.",
  "10. If interview preparation is requested, recommend company-specific preparation when a company is mentioned.",
  "11. If skills are requested, rank them by importance.",
  "12. If DSA is requested, recommend topic-wise preparation.",
  "13. If company comparison is requested, compare eligibility using actual backend job data.",
  "14. If placement chances are requested, consider CGPA, Projects, Resume, Skills, and current profile.",
  "15. Never hallucinate.",
  "16. If information is missing, say 'Based on the available profile...' instead of making assumptions.",
  "",
  "=========================================",
  "FORMATTING",
  "=========================================",
  "Always answer using markdown.",
  "Use headings.",
  "Use bullet points.",
  "Use numbered lists.",
  "Use tables whenever comparison is useful.",
  "Highlight important points.",
  "If giving a roadmap, create proper Week 1, Week 2, Week 3, Week 4 sections.",
  "Always end every response with 'Recommended Next 3 Actions' listing exactly three personalized action items.",
].join("\n");

// ============================================================
// BUILD PROMPT
// ============================================================

const buildPromptForQuestion = ({
  student,
  latestResume,
  jobs,
  aiSuggestions,
  message,
  history,
}) => {
  const questionType =
    classifyQuestion(message);

  if (
    questionType ===
    "profile"
  ) {
    return buildPlacementPrompt({
      student,
      latestResume,
      jobs,
      aiSuggestions,
      message,
      history,
    });
  }

  return buildGeneralPrompt({
    message,
    history,
  });
};

// ============================================================
// CHAT CONTROLLER
// ============================================================

const chatWithAI = async (
  req,
  res
) => {
  try {
    // ========================================================
    // AUTH CHECK
    // ========================================================

    if (
      !req.user ||
      !req.user._id
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized",
      });
    }

    // ========================================================
    // GET STUDENT
    // ========================================================

    const studentId = req.user?._id || req.user?.id;

    const student =
      await Student.findById(
        studentId
      ).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message:
          "Student not found",
      });
    }

    // ========================================================
    // GET MESSAGE
    // ========================================================

    const message =
      req.body?.message;

    if (
      typeof message !==
        "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Message is required",
      });
    }

    // ========================================================
    // GET CONVERSATION HISTORY
    // ========================================================

    const history =
      Array.isArray(
        req.body?.history
      )
        ? req.body.history
        : [];

    // ========================================================
    // GET LATEST RESUME
    // ========================================================

    const latestResume =
      await Resume.findOne({
        studentId:
          student._id,
      })
        .sort({
          uploadedAt: -1,
        })
        .select(
          "resumeText extractedSkills fileName uploadedAt"
        );

    // ========================================================
    // ENSURE RESUME SKILLS ARE AVAILABLE
    // ========================================================

    /*
     * If the resume exists and contains text,
     * but extractedSkills is empty,
     * run skill extraction again.
     *
     * This fixes old Resume documents that were
     * uploaded before the extraction logic was fixed.
     */

    let resumeSkills =
      sanitizeSkills(
        latestResume?.extractedSkills ||
          []
      );

    if (
      latestResume?.resumeText &&
      resumeSkills.length === 0
    ) {
      console.log(
        "No stored resume skills found. Running skill extraction again..."
      );

      resumeSkills =
        sanitizeSkills(
          extractSkillsFromText(
            latestResume.resumeText
          )
        );

      console.log(
        "Re-extracted resume skills:",
        resumeSkills
      );

      /*
       * Save newly extracted skills
       * permanently in MongoDB.
       */

      if (
        resumeSkills.length > 0
      ) {
        latestResume.extractedSkills =
          resumeSkills;

        await latestResume.save();

        console.log(
          "Resume skills updated successfully in database."
        );
      }
    }

    /*
     * Make sure the object passed to
     * generatePlacementSuggestions
     * contains the latest extracted skills.
     */

    if (latestResume) {
      latestResume.extractedSkills =
        resumeSkills;
    }

    // ========================================================
    // GET JOBS
    // ========================================================

    const studentCollege = String(student?.college || "").trim().toLowerCase();

    if (!studentCollege) {
      return res.status(400).json({
        success: false,
        message: "Student is not associated with a college",
      });
    }

    const jobs =
      await Job.find({
        college: { $regex: new RegExp(`^${studentCollege}$`, "i") },
      }).select(
        "requiredSkills minCGPA title college"
      );

    // ========================================================
    // GENERATE PLACEMENT ANALYSIS
    // ========================================================

    const aiSuggestions =
      generatePlacementSuggestions({
        student,
        latestResume,
        jobs,
      });

    // ========================================================
    // BUILD AI PROMPT
    // ========================================================

    const prompt =
      buildPromptForQuestion({
        student,
        latestResume,
        jobs,
        aiSuggestions,
        message:
          message.trim(),
        history,
      });

    // ========================================================
    // CALL GROQ AI
    // ========================================================

    const aiResponse =
      await generateResponse(
        prompt
      );

    // ========================================================
    // RETURN RESPONSE
    // ========================================================

    return res.status(200).json({
      success: true,

      response:
        aiResponse,

      /*
       * Returning this metadata is useful
       * for debugging and future frontend
       * features.
       */

      resumeContext: {
        resumeExists:
          Boolean(
            latestResume
          ),

        resumeTextAvailable:
          Boolean(
            latestResume?.resumeText
          ),

        extractedSkills:
          resumeSkills,

        fileName:
          latestResume?.fileName ||
          null,
      },
    });
  } catch (error) {
    console.error(
      "AI chat failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to process AI request.",
      error:
        error.message,
    });
  }
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  chatWithAI,
};