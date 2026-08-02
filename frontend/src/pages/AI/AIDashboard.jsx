import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

import {
  chatWithAI,
  getAISuggestions,
} from "../../services/aiService";

import { getProfile } from "../../services/authService";
import { getCompanies } from "../../services/companyService";
import { getCompanyMatch } from "../../services/matchingService";

const sidebarItems = [
  {
    id: "assistant",
    label: "AI Mentor",
    icon: "🧠",
  },
  {
    id: "resume",
    label: "Resume Analysis",
    icon: "🧾",
  },
  {
    id: "strengths",
    label: "Strengths",
    icon: "✨",
  },
  {
    id: "weaknesses",
    label: "Weaknesses",
    icon: "⚠️",
  },
  {
    id: "skills",
    label: "Extracted Skills",
    icon: "🛠️",
  },
  {
    id: "missing",
    label: "Missing Skills",
    icon: "📌",
  },
  {
    id: "company",
    label: "Company Match",
    icon: "🏢",
  },
  {
    id: "roadmap",
    label: "Roadmap",
    icon: "🗺️",
  },
];

const suggestedQuestions = [
  "Review my Resume",
  "Am I Placement Ready?",
  "Generate a 30-Day Roadmap",
  "What skills should I improve?",
  "Show my Company Match",
  "Improve my ATS Score",
  "Generate React Interview Questions",
  "Generate DSA Interview Questions",
  "Prepare me for Google",
];

const MAX_HISTORY_MESSAGES = 20;

function AIDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [companyMatches, setCompanyMatches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeView, setActiveView] = useState("assistant");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const [featureLoading, setFeatureLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // ============================================================
  // LOAD AI MENTOR INSIGHTS
  // ============================================================

  const loadMentorInsights = async (viewId = null) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const [aiResponse, profileData] = await Promise.all([
        getAISuggestions(),
        getProfile(token),
      ]);

      setData(aiResponse);
      setProfile(profileData);

      if (viewId) {
        setActiveView(viewId);
      }

      setMessages([
        {
          role: "assistant",
          content: buildWelcomeMessage(aiResponse),
          timestamp: formatTimestamp(new Date()),
        },
      ]);
    } catch (error) {
      console.error(
        "Failed to load AI mentor insights:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to fetch AI insights."
      );

      setMessages([
        {
          role: "assistant",
          content:
            "Unable to fetch AI insights. Please make sure your backend server is running.",
          timestamp: formatTimestamp(new Date()),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadMentorInsights();
  }, []);

  // ============================================================
  // AUTO SCROLL CHAT
  // ============================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, chatLoading]);

  // ============================================================
  // LOAD COMPANY MATCHES
  // ============================================================

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const companies = await getCompanies();

        const topCompanies = Array.isArray(companies)
          ? companies.slice(0, 3)
          : [];

        const companyResults = await Promise.all(
          topCompanies.map(async (company) => {
            try {
              const matchData = await getCompanyMatch(
                company._id
              );

              return {
                company,
                matchData,
              };
            } catch {
              return null;
            }
          })
        );

        setCompanyMatches(
          companyResults.filter(Boolean)
        );
      } catch (error) {
        console.error(
          "Failed to fetch company matches:",
          error
        );

        setCompanyMatches([]);
      }
    };

    fetchMatches();
  }, []);

  // ============================================================
  // SEND MESSAGE TO AI
  // ============================================================

  const handleSend = async (promptText) => {
    const normalizedPrompt = (
      promptText || chatInput
    ).trim();

    if (!normalizedPrompt || chatLoading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: normalizedPrompt,
      timestamp: formatTimestamp(new Date()),
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setChatInput("");
    setChatLoading(true);
    setSidebarOpen(false);
    setError("");

    const nextView =
      resolveViewFromPrompt(normalizedPrompt);

    setActiveView(nextView);

    const conversationHistory = [
      ...messages,
      userMessage,
    ].slice(-MAX_HISTORY_MESSAGES);

    try {
      const aiResponse = await chatWithAI(
        normalizedPrompt,
        conversationHistory
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            aiResponse ||
            "Sorry, I couldn't process your request.",
          timestamp: formatTimestamp(new Date()),
        },
      ]);
    } catch (error) {
      console.error(
        "AI chat error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error?.response?.data?.message ||
            "Sorry, I couldn't process your request.",
          timestamp: formatTimestamp(new Date()),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // ============================================================
  // SIDEBAR VIEW SELECTION
  // ============================================================

  const handleViewSelection = async (viewId) => {
    if (activeView === viewId) {
      setActiveView("assistant");
      return;
    }

    setSidebarOpen(false);
    setActiveView(viewId);
    setError("");

    if (data && profile) {
      return;
    }

    try {
      setFeatureLoading(true);

      const token = localStorage.getItem("token");

      const [aiResponse, profileData] =
        await Promise.all([
          getAISuggestions(),
          getProfile(token),
        ]);

      setData(aiResponse);
      setProfile(profileData);
      setError("");
    } catch (error) {
      console.error(
        "Failed to load AI section:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to fetch AI insights."
      );
    } finally {
      setFeatureLoading(false);
    }
  };

  // ============================================================
  // AI DATA
  // ============================================================

  const atsScore =
    typeof data?.atsScore === "number"
      ? data.atsScore
      : typeof data?.resumeAnalysis?.overallScore ===
        "number"
      ? data.resumeAnalysis.overallScore
      : null;

  const placementReadinessValue =
    typeof data?.placementReadiness === "number"
      ? data.placementReadiness
      : null;

  const jobMatchScore =
    typeof data?.analysisContext?.bestMatchScore ===
    "number"
      ? data.analysisContext.bestMatchScore
      : null;

  // ============================================================
  // RESUME INFORMATION
  // ============================================================

  const resumeFileUrl =
    data?.analysisContext?.resumeFileUrl ||
    data?.resume?.fileUrl ||
    "";

  const resumeFileName =
    data?.analysisContext?.resumeFileName ||
    data?.resume?.fileName ||
    "";

  const resumeExists = Boolean(
    data?.analysisContext?.resumeExists ||
      data?.resume ||
      resumeFileUrl ||
      resumeFileName
  );

  const resumeTextAvailable = Boolean(
    data?.analysisContext?.resumeTextAvailable ||
      data?.resume?.resumeTextAvailable ||
      data?.resume?.hasResumeText
  );

  // ============================================================
  // STRENGTHS
  // ============================================================

  const strengths =
    Array.isArray(
      data?.resumeAnalysis?.strengths
    ) &&
    data.resumeAnalysis.strengths.length > 0
      ? data.resumeAnalysis.strengths
      : Array.isArray(data?.strengths)
      ? data.strengths
      : [];

  // ============================================================
  // WEAKNESSES
  // ============================================================

  const weaknesses =
    Array.isArray(
      data?.resumeAnalysis?.weaknesses
    ) &&
    data.resumeAnalysis.weaknesses.length > 0
      ? data.resumeAnalysis.weaknesses
      : Array.isArray(data?.weaknesses)
      ? data.weaknesses
      : [];

  // ============================================================
  // MISSING SKILLS
  // ============================================================

  const missingSkills =
    Array.isArray(
      data?.resumeAnalysis?.missingSkills
    ) &&
    data.resumeAnalysis.missingSkills.length > 0
      ? data.resumeAnalysis.missingSkills
      : Array.isArray(
          data?.analysisContext?.missingSkills
        ) &&
        data.analysisContext.missingSkills.length > 0
      ? data.analysisContext.missingSkills
      : [];

  // ============================================================
  // RESUME IMPROVEMENTS
  // ============================================================

  const resumeImprovements =
    Array.isArray(
      data?.resumeAnalysis?.resumeImprovements
    )
      ? data.resumeAnalysis.resumeImprovements
      : [];

  // ============================================================
  // RECOMMENDED SKILLS
  // ============================================================

  const recommendedSkills =
    Array.isArray(
      data?.resumeAnalysis?.recommendedSkills
    )
      ? data.resumeAnalysis.recommendedSkills
      : [];

  // ============================================================
  // PLACEMENT ADVICE
  // ============================================================

  const placementAdvice =
    Array.isArray(
      data?.resumeAnalysis?.placementAdvice
    )
      ? data.resumeAnalysis.placementAdvice
      : [];

  // ============================================================
  // ATS FEEDBACK
  // ============================================================

  const atsFeedback =
    data?.resumeAnalysis?.atsFeedback || "";

  // ============================================================
  // RESUME SUMMARY
  // ============================================================

  const resumeSummary =
    data?.resumeAnalysis?.summary ||
    (placementReadinessValue !== null
      ? `Your placement readiness score is ${placementReadinessValue}/100 based on your current profile, resume, skills, and job-market analysis.`
      : "Resume analysis is not available yet.");

  // ============================================================
  // EXTRACTED SKILLS FROM RESUME
  // ============================================================

  /*
   * IMPORTANT:
   * These are ONLY skills extracted from the uploaded resume.
   * Profile/manual skills are kept separate.
   */

  const extractedSkills =
    Array.isArray(
      data?.analysisContext?.resumeSkills
    )
      ? data.analysisContext.resumeSkills
      : Array.isArray(
          data?.analysisContext?.extractedSkills
        )
      ? data.analysisContext.extractedSkills
      : Array.isArray(
          data?.resume?.extractedSkills
        )
      ? data.resume.extractedSkills
      : [];

  // ============================================================
  // PROFILE SKILLS
  // ============================================================

  const profileSkills =
    Array.isArray(
      data?.analysisContext?.profileSkills
    )
      ? data.analysisContext.profileSkills
      : Array.isArray(profile?.skills)
      ? profile.skills
      : [];

  // ============================================================
  // ROADMAP
  // ============================================================

  const roadmapItems =
    Array.isArray(data?.priorityActions) &&
    data.priorityActions.length > 0
      ? data.priorityActions
      : Array.isArray(data?.suggestions)
      ? data.suggestions
      : [];

  const roadmapWeeks = Array.from(
    { length: 4 },
    (_, index) => ({
      week: `Week ${index + 1}`,
      tasks: roadmapItems.slice(
        index * 2,
        index * 2 + 2
      ),
    })
  );

  // ============================================================
  // OPEN RESUME
  // ============================================================

  const handleOpenResume = () => {
    if (!resumeFileUrl) {
      return;
    }

    window.open(
      resumeFileUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ============================================================
  // RENDER FEATURE CONTENT
  // ============================================================

  const renderFeatureContent = () => {
    switch (activeView) {
      // ========================================================
      // AI ASSISTANT
      // ========================================================

      case "assistant":
        return (
          <div className="ai-feature-panel ai-feature-panel--welcome">
            <h3>🧠 AI Placement Mentor</h3>

            <p className="ai-feature-summary">
              {data
                ? `Placement readiness: ${
                    placementReadinessValue ??
                    "n/a"
                  }/100. ${
                    data.priorityActions?.[0] ||
                    data.suggestions?.[0] ||
                    "Your latest placement insights are ready."
                  }`
                : "Loading your latest placement insights from the backend..."}
            </p>

            <div className="ai-feature-grid">
              <button
                type="button"
                className="ai-feature-card ai-feature-card--clickable"
                onClick={() =>
                  handleViewSelection("resume")
                }
              >
                <span className="ai-feature-label">
                  ATS Score
                </span>

                <strong>
                  {atsScore !== null
                    ? `${atsScore}/100`
                    : "Not available"}
                </strong>
              </button>

              <button
                type="button"
                className="ai-feature-card ai-feature-card--clickable"
                onClick={() =>
                  handleViewSelection("resume")
                }
              >
                <span className="ai-feature-label">
                  Placement Readiness
                </span>

                <strong>
                  {placementReadinessValue !== null
                    ? `${placementReadinessValue}/100`
                    : "Not available"}
                </strong>
              </button>

              <button
                type="button"
                className="ai-feature-card ai-feature-card--clickable"
                onClick={() =>
                  handleViewSelection("skills")
                }
              >
                <span className="ai-feature-label">
                  Extracted Skills
                </span>

                <strong>
                  {extractedSkills.length}
                </strong>
              </button>

              <button
                type="button"
                className="ai-feature-card ai-feature-card--clickable"
                onClick={() =>
                  handleViewSelection("missing")
                }
              >
                <span className="ai-feature-label">
                  Missing Skills
                </span>

                <strong>
                  {missingSkills.length}
                </strong>
              </button>

              <button
                type="button"
                className="ai-feature-card ai-feature-card--clickable"
                onClick={() =>
                  handleViewSelection("company")
                }
              >
                <span className="ai-feature-label">
                  Best Job Match
                </span>

                <strong>
                  {jobMatchScore !== null
                    ? `${jobMatchScore}%`
                    : "N/A"}
                </strong>
              </button>
            </div>
          </div>
        );

      // ========================================================
      // RESUME ANALYSIS
      // ========================================================

      case "resume":
        return (
          <div className="ai-feature-panel">
            <h3>🧾 Resume Analysis</h3>

            {!resumeExists ? (
              <>
                <p className="ai-feature-summary">
                  No resume uploaded yet.
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/resume")
                  }
                >
                  Upload Resume
                </button>
              </>
            ) : (
              <>
                {/* RESUME STATUS */}

                <div className="ai-feature-card ai-resume-summary-card">
                  <div className="ai-resume-summary-header">
                    <div>
                      <span className="ai-feature-label">
                        Resume Analysis
                      </span>

                      <h4>
                        {resumeFileName ||
                          "Uploaded Resume"}
                      </h4>
                    </div>

                    {resumeFileUrl && (
                      <button
                        type="button"
                        className="btn btn-tertiary"
                        onClick={
                          handleOpenResume
                        }
                      >
                        View Resume
                      </button>
                    )}
                  </div>

                  <p className="ai-feature-summary">
                    {resumeTextAvailable
                      ? "Your uploaded resume has been analyzed. Review the AI insights below."
                      : "Your resume is uploaded, but readable text could not be extracted."}
                  </p>
                </div>

                {/* SCORE CARDS */}

                <div className="ai-feature-grid">
                  <div className="ai-feature-card">
                    <span className="ai-feature-label">
                      ATS Score
                    </span>

                    <strong>
                      {atsScore !== null
                        ? `${atsScore}/100`
                        : "Unavailable"}
                    </strong>
                  </div>

                  <div className="ai-feature-card">
                    <span className="ai-feature-label">
                      Placement Readiness
                    </span>

                    <strong>
                      {placementReadinessValue !== null
                        ? `${placementReadinessValue}/100`
                        : "Unavailable"}
                    </strong>
                  </div>

                  <div className="ai-feature-card">
                    <span className="ai-feature-label">
                      Extracted Skills
                    </span>

                    <strong>
                      {extractedSkills.length}
                    </strong>
                  </div>
                </div>

                {/* AI SUMMARY */}

                <div className="ai-feature-card">
                  <span className="ai-feature-label">
                    AI Resume Summary
                  </span>

                  <p className="ai-feature-summary">
                    {resumeSummary}
                  </p>
                </div>

                {/* EXTRACTED SKILLS */}

                <div className="ai-feature-card">
                  <span className="ai-feature-label">
                    Skills Found in Resume
                  </span>

                  {extractedSkills.length >
                  0 ? (
                    <>
                      <p className="ai-feature-summary">
                        These skills were
                        detected directly
                        from your uploaded
                        resume.
                      </p>

                      <div className="ai-chip-list">
                        {extractedSkills.map(
                          (skill) => (
                            <span
                              key={skill}
                              className="ai-chip"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="ai-feature-empty">
                      Your resume is uploaded,
                      but no technical skills
                      were detected.
                    </p>
                  )}
                </div>

                {/* STRENGTHS AND WEAKNESSES */}

                <div className="ai-feature-grid">
                  <div className="ai-feature-card">
                    <span className="ai-feature-label">
                      Resume Strengths
                    </span>

                    {strengths.length >
                    0 ? (
                      <ul className="ai-feature-list">
                        {strengths.map(
                          (item, index) => (
                            <li
                              key={`${item}-${index}`}
                            >
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="ai-feature-empty">
                        No strengths
                        available yet.
                      </p>
                    )}
                  </div>

                  <div className="ai-feature-card">
                    <span className="ai-feature-label">
                      Resume Weaknesses
                    </span>

                    {weaknesses.length >
                    0 ? (
                      <ul className="ai-feature-list">
                        {weaknesses.map(
                          (item, index) => (
                            <li
                              key={`${item}-${index}`}
                            >
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="ai-feature-empty">
                        No weaknesses
                        available yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* MISSING SKILLS */}

                <div className="ai-feature-card">
                  <span className="ai-feature-label">
                    Missing Skills
                  </span>

                  {missingSkills.length >
                  0 ? (
                    <div className="ai-chip-list">
                      {missingSkills.map(
                        (skill) => (
                          <span
                            key={skill}
                            className="ai-chip"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="ai-feature-empty">
                      No missing skills
                      identified yet.
                    </p>
                  )}
                </div>

                {/* ATS FEEDBACK */}

                {atsFeedback && (
                  <div className="ai-feature-card">
                    <span className="ai-feature-label">
                      ATS Feedback
                    </span>

                    <p className="ai-feature-summary">
                      {atsFeedback}
                    </p>
                  </div>
                )}

                {/* RESUME IMPROVEMENTS */}

                {resumeImprovements.length >
                  0 && (
                  <div className="ai-feature-card">
                    <span className="ai-feature-label">
                      Resume Improvements
                    </span>

                    <ul className="ai-feature-list">
                      {resumeImprovements.map(
                        (item, index) => (
                          <li
                            key={`${item}-${index}`}
                          >
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* RECOMMENDED SKILLS */}

                {recommendedSkills.length >
                  0 && (
                  <div className="ai-feature-card">
                    <span className="ai-feature-label">
                      Recommended Skills
                    </span>

                    <div className="ai-chip-list">
                      {recommendedSkills.map(
                        (skill) => (
                          <span
                            key={skill}
                            className="ai-chip"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* PLACEMENT ADVICE */}

                {placementAdvice.length >
                  0 && (
                  <div className="ai-feature-card">
                    <span className="ai-feature-label">
                      Placement Advice
                    </span>

                    <ul className="ai-feature-list">
                      {placementAdvice.map(
                        (item, index) => (
                          <li
                            key={`${item}-${index}`}
                          >
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* RECOMMENDATIONS */}

                {roadmapItems.length > 0 && (
                  <div className="ai-feature-card">
                    <span className="ai-feature-label">
                      Recommended Next Steps
                    </span>

                    <ul className="ai-feature-list">
                      {roadmapItems.map(
                        (item, index) => (
                          <li
                            key={`${item}-${index}`}
                          >
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        );

      // ========================================================
      // STRENGTHS
      // ========================================================

      case "strengths":
        return (
          <div className="ai-feature-panel">
            <h3>✨ Strengths</h3>

            {strengths.length > 0 ? (
              <ul className="ai-feature-list">
                {strengths.map(
                  (item, index) => (
                    <li
                      key={`${item}-${index}`}
                    >
                      {item}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="ai-feature-empty">
                No strength analysis
                available yet.
              </p>
            )}
          </div>
        );

      // ========================================================
      // WEAKNESSES
      // ========================================================

      case "weaknesses":
        return (
          <div className="ai-feature-panel">
            <h3>⚠️ Weaknesses</h3>

            {weaknesses.length > 0 ? (
              <ul className="ai-feature-list">
                {weaknesses.map(
                  (item, index) => (
                    <li
                      key={`${item}-${index}`}
                    >
                      {item}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="ai-feature-empty">
                No weakness analysis
                available yet.
              </p>
            )}
          </div>
        );

      // ========================================================
      // EXTRACTED SKILLS
      // ========================================================

      case "skills":
        return (
          <div className="ai-feature-panel">
            <h3>
              🛠️ Skills Extracted From Resume
            </h3>

            {extractedSkills.length > 0 ? (
              <>
                <p className="ai-feature-summary">
                  These skills were detected
                  directly from your uploaded
                  resume.
                </p>

                <div className="ai-chip-list">
                  {extractedSkills.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="ai-chip"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </>
            ) : resumeExists ? (
              <p className="ai-feature-empty">
                Your resume is uploaded,
                but no technical skills were
                detected from its extracted
                text.
              </p>
            ) : (
              <>
                <p className="ai-feature-empty">
                  Upload a resume to extract
                  your technical skills.
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/resume")
                  }
                >
                  Upload Resume
                </button>
              </>
            )}

            {/* PROFILE SKILLS */}

            {profileSkills.length > 0 && (
              <div
                className="ai-feature-card"
                style={{
                  marginTop: "20px",
                }}
              >
                <span className="ai-feature-label">
                  Your Profile Skills
                </span>

                <p className="ai-feature-summary">
                  These are the skills saved
                  manually in your student
                  profile.
                </p>

                <div className="ai-chip-list">
                  {profileSkills.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="ai-chip"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        );

      // ========================================================
      // MISSING SKILLS
      // ========================================================

      case "missing":
        return (
          <div className="ai-feature-panel">
            <h3>📌 Missing Skills</h3>

            {missingSkills.length > 0 ? (
              <div className="ai-match-list">
                {missingSkills.map(
                  (skill) => (
                    <div
                      key={skill}
                      className="ai-match-card"
                    >
                      <strong>
                        {skill}
                      </strong>

                      <span>
                        Priority
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="ai-feature-empty">
                No missing skills available
                yet.
              </p>
            )}
          </div>
        );

      // ========================================================
      // COMPANY MATCH
      // ========================================================

      case "company":
        return (
          <div className="ai-feature-panel">
            <h3>🏢 Company Match</h3>

            {companyMatches.length > 0 ? (
              <div className="ai-match-list">
                {companyMatches.map(
                  ({
                    company,
                    matchData,
                  }) => (
                    <div
                      key={company._id}
                      className="ai-match-card"
                    >
                      <div>
                        <strong>
                          {company.name}
                        </strong>

                        <p>
                          {company.role ||
                            "Available Position"}
                        </p>
                      </div>

                      <div>
                        <strong>
                          {
                            matchData?.matchScore ??
                            0
                          }
                          % match
                        </strong>

                        <p>
                          {matchData?.eligibility ||
                            "Eligibility available from backend"}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="ai-feature-empty">
                No company match analysis
                available yet.
              </p>
            )}
          </div>
        );

      // ========================================================
      // ROADMAP
      // ========================================================

      case "roadmap":
        return (
          <div className="ai-feature-panel">
            <h3>🗺️ Roadmap</h3>

            <p className="ai-feature-summary">
              {data?.estimatedImprovement
                ? `Estimated improvement: ${data.estimatedImprovement}`
                : "No improvement estimate available yet."}
            </p>

            {roadmapWeeks.some(
              (week) =>
                week.tasks.length > 0
            ) ? (
              <div className="ai-match-list">
                {roadmapWeeks.map(
                  (week) => (
                    <div
                      key={week.week}
                      className="ai-match-card"
                    >
                      <div>
                        <strong>
                          {week.week}
                        </strong>

                        <p>
                          {week.tasks.length >
                          0
                            ? week.tasks.join(
                                " • "
                              )
                            : "No tasks assigned yet."}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="ai-feature-empty">
                No roadmap available yet.
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================================
  // RESET CONVERSATION
  // ============================================================

  const resetConversation = () => {
    setMessages([]);
    setChatInput("");
    setActiveView("assistant");
    setSidebarOpen(false);
    setChatLoading(false);
    setError("");
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-content ai-mentor-layout">
        {/* SIDEBAR OVERLAY */}

        <div
          className={`ai-sidebar-overlay ${
            sidebarOpen
              ? "is-visible"
              : ""
          }`}
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-hidden="true"
        />

        <section className="ai-main-panel">
          {/* TOP BAR */}

          <div className="ai-topbar">
            <div className="ai-topbar__left">
              <div className="ai-topbar__menu-wrap">
                <button
                  type="button"
                  className="ai-topbar__menu"
                  onClick={() =>
                    setSidebarOpen(
                      (prev) => !prev
                    )
                  }
                  aria-label="Toggle AI mentor menu"
                >
                  ☰
                </button>

                <div
                  className={`ai-sidebar-popup ${
                    sidebarOpen
                      ? "is-open"
                      : ""
                  }`}
                  role="menu"
                >
                  <div className="ai-sidebar__header">
                    <p className="eyebrow">
                      AI Assistant
                    </p>

                    <h2>
                      🧠 AI Mentor
                    </h2>
                  </div>

                  <nav
                    className="ai-sidebar__menu"
                    aria-label="AI mentor sections"
                  >
                    {sidebarItems.map(
                      (item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`ai-sidebar__item ${
                            activeView ===
                            item.id
                              ? "is-active"
                              : ""
                          }`}
                          onClick={() =>
                            handleViewSelection(
                              item.id
                            )
                          }
                        >
                          <span className="ai-sidebar__icon">
                            {item.icon}
                          </span>

                          <span>
                            {item.label}
                          </span>
                        </button>
                      )
                    )}
                  </nav>
                </div>
              </div>

              <div className="ai-topbar__title">
                <p className="eyebrow">
                  AI Mentor
                </p>

                <h1>AI Mentor</h1>

                <p className="ai-topbar__subtitle">
                  Your personal AI placement
                  assistant for resumes,
                  skills, company matching,
                  and interviews.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="ai-topbar__new"
              onClick={
                resetConversation
              }
            >
              New Conversation
            </button>
          </div>

          {/* CHAT */}

          <div className="ai-chat-shell">
            <div className="ai-chat-messages">
              {messages.map(
                (message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`ai-chat-bubble ${message.role}`}
                  >
                    <div className="ai-chat-bubble__meta">
                      {message.role ===
                      "user"
                        ? "You"
                        : "AI Mentor"}{" "}
                      •{" "}
                      {message.timestamp}
                    </div>

                    <div className="ai-chat-message-content">
                      {message.content}
                    </div>
                  </div>
                )
              )}

              {chatLoading && (
                <div className="ai-chat-bubble assistant">
                  <div className="ai-chat-bubble__meta">
                    AI Mentor • typing
                  </div>

                  <div className="ai-chat-message-content">
                    Thinking
                    <span className="ai-typing-dots">
                      <span />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* CHAT INPUT */}

            <div className="ai-chat-input-row">
              <textarea
                rows={2}
                value={chatInput}
                onChange={(event) =>
                  setChatInput(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask AI anything..."
                className="ai-chat-input"
                disabled={chatLoading}
              />

              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  handleSend()
                }
                disabled={chatLoading}
              >
                {chatLoading
                  ? "Sending..."
                  : "Send"}
              </button>
            </div>

            {/* SUGGESTED QUESTIONS */}

            <div className="ai-suggested-questions">
              <p className="ai-suggested-questions__title">
                Suggested Questions
              </p>

              <div className="ai-chip-list">
                {suggestedQuestions.map(
                  (question) => (
                    <button
                      key={question}
                      type="button"
                      className="ai-chip ai-chip--interactive"
                      onClick={() =>
                        handleSend(
                          question
                        )
                      }
                      disabled={
                        chatLoading
                      }
                    >
                      {question}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* FEATURE CONTENT */}

          {loading || featureLoading ? (
            <div className="ai-loading-card">
              <LoadingSpinner
                label={
                  loading
                    ? "Analyzing your placement readiness..."
                    : "Loading this section..."
                }
              />
            </div>
          ) : error ? (
            <div className="ai-feature-panel ai-feature-panel--warning">
              <h3>Current Status</h3>

              <p className="ai-feature-empty">
                {error}
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  loadMentorInsights(
                    activeView
                  )
                }
              >
                Retry Analysis
              </button>
            </div>
          ) : (
            renderFeatureContent()
          )}
        </section>
      </main>
    </div>
  );
}

// ============================================================
// RESOLVE VIEW FROM PROMPT
// ============================================================

function resolveViewFromPrompt(prompt) {
  const lowerPrompt =
    prompt.toLowerCase();

  if (
    lowerPrompt.includes("resume") ||
    lowerPrompt.includes("ats") ||
    lowerPrompt.includes("review") ||
    lowerPrompt.includes("placement ready") ||
    lowerPrompt.includes("placement readiness")
  ) {
    return "resume";
  }

  if (
    lowerPrompt.includes("company") ||
    lowerPrompt.includes("match") ||
    lowerPrompt.includes("eligible")
  ) {
    return "company";
  }

  if (
    lowerPrompt.includes("roadmap") ||
    lowerPrompt.includes("30-day")
  ) {
    return "roadmap";
  }

  if (
    lowerPrompt.includes("strength") &&
    !lowerPrompt.includes("weak")
  ) {
    return "strengths";
  }

  if (
    lowerPrompt.includes("weak") ||
    lowerPrompt.includes("skill") ||
    lowerPrompt.includes("improve") ||
    lowerPrompt.includes("missing")
  ) {
    return "missing";
  }

  return "assistant";
}

// ============================================================
// WELCOME MESSAGE
// ============================================================

function buildWelcomeMessage(aiResponse) {
  const readiness =
    aiResponse?.placementReadiness ??
    "n/a";

  const firstAction =
    aiResponse?.priorityActions?.[0] ||
    aiResponse?.suggestions?.[0] ||
    "Your latest placement insights are ready.";

  return `Placement readiness: ${readiness}/100. ${firstAction}`;
}

// ============================================================
// TIMESTAMP
// ============================================================

function formatTimestamp(date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default AIDashboard;