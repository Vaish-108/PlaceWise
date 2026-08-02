const path = require("path");
const Student = require("../models/Student");
const Job = require("../models/Job");
const Resume = require("../models/Resume");

const {
  generatePlacementSuggestions,
} = require("../services/aiSuggestionService");

const { generateResponse } = require("../services/groqService");

const getBackendUrl = () =>
  process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

const buildResumeFileUrl = (resume) => {
  if (!resume?.filePath) {
    return null;
  }

  return `${getBackendUrl()}/uploads/${encodeURIComponent(path.basename(resume.filePath))}`;
};

const getSuggestions = async (req, res) => {
  try {
    const studentId = req.user?._id || req.user?.id;
    const student = await Student.findById(studentId).lean();

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const studentCollege = String(student?.college || "").trim().toLowerCase();

    if (!studentCollege) {
      return res.status(400).json({
        message: "Student is not associated with a college",
      });
    }

    const [latestResume, jobs] = await Promise.all([
      Resume.findOne({ studentId: student._id })
        .sort({ uploadedAt: -1 })
        .lean(),

      Job.find({
        college: { $regex: new RegExp(`^${studentCollege}$`, "i") },
      })
        .select("requiredSkills minCGPA title company college")
        .lean(),
    ]);

    const resumeFileUrl = buildResumeFileUrl(latestResume);

    // ==========================================
    // BASIC RULE-BASED ANALYSIS
    // ==========================================

    const result = generatePlacementSuggestions({
      student,
      latestResume,
      jobs,
    });

    // ==========================================
    // GEMINI RESUME ANALYSIS
    // ==========================================

    let resumeAnalysis = {
      overallScore: null,
      summary: latestResume?.resumeText
        ? "AI resume analysis is temporarily unavailable."
        : "Resume text is unavailable for AI analysis.",
      strengths: [],
      weaknesses: [],
      missingSkills: [],
      resumeImprovements: [],
      recommendedSkills: [],
      placementAdvice: [],
      atsFeedback: "",
    };

    if (latestResume?.resumeText) {
      try {
        const prompt = `
You are an expert AI placement mentor.

Analyze the student's resume and profile for software engineering placements.

STUDENT PROFILE:
Name: ${student.name || "Not provided"}
College: ${student.college || "Not provided"}
Course: ${student.course || "Not provided"}
Branch: ${student.branch || "Not provided"}
Year: ${student.year || "Not provided"}
Semester: ${student.semester || "Not provided"}
CGPA: ${student.cgpa || "Not provided"}
Profile Skills: ${(student.skills || []).join(", ") || "None"}
Resume Extracted Skills: ${(latestResume.extractedSkills || []).join(", ") || "None"}

RESUME TEXT:
${latestResume.resumeText}

Provide a detailed, placement-oriented analysis.
Return ONLY valid JSON in exactly this format:
{
  "overallScore": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "resumeImprovements": [],
  "recommendedSkills": [],
  "placementAdvice": [],
  "atsFeedback": ""
}

overallScore must be a number between 0 and 100.
Focus on:
1. Resume quality
2. Technical skills
3. Missing skills
4. Projects and experience
5. DSA readiness
6. ATS friendliness
7. Placement readiness
8. Actionable improvements
If you return markdown code fences, return only the contents of the JSON object.
If you return any text around the JSON, it must be safely removed before parsing.
`;

        console.log("Gemini resume analysis: resume text is available", Boolean(latestResume.resumeText));

        const aiResponse = await generateResponse(prompt);

        console.log("Gemini resume analysis: raw response length", aiResponse?.length || 0);
        console.log("Gemini resume analysis: raw response preview", aiResponse?.slice(0, 800));

        let cleanedResponse = aiResponse
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();

        // If the response contains text before or after JSON, attempt to extract the first JSON object.
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanedResponse = jsonMatch[0];
        }

        try {
          const parsed = JSON.parse(cleanedResponse);
          resumeAnalysis = {
            overallScore:
              typeof parsed.overallScore === "number"
                ? parsed.overallScore
                : null,
            summary: parsed.summary || "",
            strengths: Array.isArray(parsed.strengths)
              ? parsed.strengths
              : [],
            weaknesses: Array.isArray(parsed.weaknesses)
              ? parsed.weaknesses
              : [],
            missingSkills: Array.isArray(parsed.missingSkills)
              ? parsed.missingSkills
              : [],
            resumeImprovements: Array.isArray(parsed.resumeImprovements)
              ? parsed.resumeImprovements
              : [],
            recommendedSkills: Array.isArray(parsed.recommendedSkills)
              ? parsed.recommendedSkills
              : [],
            placementAdvice: Array.isArray(parsed.placementAdvice)
              ? parsed.placementAdvice
              : [],
            atsFeedback: parsed.atsFeedback || "",
          };
        } catch (parseError) {
          console.error(
            "Gemini response was not valid JSON:",
            parseError.message,
            "cleanedResponsePreview",
            cleanedResponse?.slice(0, 800)
          );
          resumeAnalysis.summary = aiResponse;
        }
      } catch (aiError) {
        console.error("Gemini resume analysis failed:", aiError.message);
      }
    }

    // ==========================================
    // FINAL RESPONSE
    // ==========================================

    return res.status(200).json({
      placementReadiness: result.placementReadiness,
      atsScore: result.atsScore,
      strengths:
        resumeAnalysis?.strengths?.length
          ? resumeAnalysis.strengths
          : result.strengths,
      weaknesses:
        resumeAnalysis?.weaknesses?.length
          ? resumeAnalysis.weaknesses
          : result.weaknesses,
      suggestions:
        resumeAnalysis?.resumeImprovements?.length
          ? resumeAnalysis.resumeImprovements
          : result.suggestions,
      priorityActions: result.priorityActions,
      estimatedImprovement: result.estimatedImprovement,
      analysisContext: {
        profileSkills: result.analysisContext.profileSkills,
        resumeSkills: result.analysisContext.resumeSkills,
        mergedSkillCount: result.analysisContext.mergedSkillCount,
        studentCGPA: result.analysisContext.studentCGPA,
        matchScore: result.analysisContext.matchScore,
        bestMatchScore: result.analysisContext.bestMatchScore,
        missingSkills: result.analysisContext.missingSkills,
        jobsAnalyzed: result.analysisContext.jobsAnalyzed,
        resumeTextAvailable: result.analysisContext.resumeTextAvailable,
        resumeFileName: latestResume?.fileName || null,
        resumeFileUrl,
      },
      resumeAnalysis,
    });
  } catch (error) {
    console.error("AI suggestions failed:", error);

    return res.status(500).json({
      message: "Failed to generate AI suggestions",
      error: error.message,
    });
  }
};

module.exports = {
  getSuggestions,
};
