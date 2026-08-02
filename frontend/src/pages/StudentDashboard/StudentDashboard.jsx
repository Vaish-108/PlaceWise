import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile } from "../../services/authService";
import { getAISuggestions } from "../../services/aiService";
import Navbar from "../../components/Navbar/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const token = localStorage.getItem("token");
        const [profileData, aiResponse] = await Promise.all([
          getProfile(token),
          getAISuggestions(),
        ]);

        setUser(profileData);
        setAiData(aiResponse);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load workspace information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, []);

  const displayValue = (value) =>
    value || value === 0 ? value : "Not Updated";

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join("")
    : "S";

  const aiInsight =
    aiData?.priorityActions?.[0] || aiData?.suggestions?.[0] || null;
  const resumeFileUrl =
    aiData?.analysisContext?.resumeFileUrl ||
    aiData?.resume?.fileUrl ||
    "";
  const resumeExists =
    Boolean(
      aiData?.analysisContext?.resumeExists ||
        aiData?.resume ||
        resumeFileUrl
    );
  const resumeUrl =
    resumeFileUrl ||
    (resumeExists ? "/resume" : null);
  const activityItems = aiData?.recentActivity || [];

  const professionalProfiles = [
    {
      label: "LinkedIn",
      key: "linkedin",
      icon: "in",
      url: user?.linkedin,
      emptyMessage: "Add this link from your Profile page.",
    },
    {
      label: "GitHub",
      key: "github",
      icon: "GH",
      url: user?.github,
      emptyMessage: "Add this link from your Profile page.",
    },
    {
      label: "LeetCode",
      key: "leetcode",
      icon: "LC",
      url: user?.leetcode,
      emptyMessage: "Add this link from your Profile page.",
    },
    {
      label: "Resume",
      key: "resume",
      icon: "📄",
      url: resumeUrl,
      emptyMessage: "No resume uploaded.",
      fallback: !resumeExists,
    },
  ];

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-content workspace-page">
        {loading && <LoadingSpinner label="Loading workspace details..." />}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && user && (
          <>
            <section
              className="workspace-section panel profile-summary-panel clickable-card"
              onClick={() => navigate("/profile")}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => event.key === "Enter" && navigate("/profile")}
            >
              <div className="profile-summary-content">
                <div className="profile-summary-copy">
                  <p className="eyebrow section-heading">Profile Summary</p>
                  <h1 className="profile-name">{user.name || "Student"}</h1>
                  <div className="profile-details-list">
                    <div>
                      <p className="summary-label">Branch</p>
                      <strong>{displayValue(user.branch)}</strong>
                    </div>
                    <div>
                      <p className="summary-label">Current Year</p>
                      <strong>{displayValue(user.year)}</strong>
                    </div>
                    <div>
                      <p className="summary-label">Semester</p>
                      <strong>{displayValue(user.semester)}</strong>
                    </div>
                    <div>
                      <p className="summary-label">CGPA</p>
                      <strong>{displayValue(user.cgpa)}</strong>
                    </div>
                    <div>
                      <p className="summary-label">College</p>
                      <strong>{displayValue(user.college)}</strong>
                    </div>
                    <div>
                      <p className="summary-label">Email</p>
                      <strong>{displayValue(user.email)}</strong>
                    </div>
                    <div>
                      <p className="summary-label">Phone</p>
                      <strong>{displayValue(user.phone)}</strong>
                    </div>
                  </div>
                  <Link to="/profile" className="btn btn-primary workspace-edit-btn">
                    Edit Profile
                  </Link>
                </div>

                <div className="profile-avatar-column">
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={`${user.name} profile`}
                      className="workspace-avatar"
                    />
                  ) : (
                    <div className="workspace-avatar workspace-avatar--initials">
                      {initials}
                    </div>
                  )}
                  <Link to="/profile" className="workspace-photo-link">
                    📷 Change Photo
                  </Link>
                </div>
              </div>
            </section>

            <section className="workspace-section panel coding-profiles-panel">
              <div className="workspace-panel-header">
                <div>
                  <p className="eyebrow section-heading">Professional Profiles</p>
                  <h2>Quick access to your professional accounts.</h2>
                </div>
              </div>

              <div className="coding-profiles-grid">
                {professionalProfiles.map((profile) => {
                  const card = (
                    <div
                      className={`coding-card ${profile.fallback ? "coding-card--empty" : ""}`}
                    >
                      <div className="coding-card__meta">
                        <span className={`coding-card__icon coding-card__icon--${profile.key}`}>
                          {profile.icon}
                        </span>
                        <div>
                          <h3>{profile.label}</h3>
                          <p className="coding-card__cta-text">
                            {profile.url
                              ? profile.key === "resume"
                                ? "Open resume"
                                : "Open profile"
                              : "Click to add from Profile"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );

                  if (profile.url) {
                    if (
                      profile.key === "resume" &&
                      profile.url !== "/resume"
                    ) {
                      return (
                        <a
                          key={profile.key}
                          href={profile.url}
                          target="_blank"
                          rel="noreferrer"
                          className="coding-card-link-wrapper"
                        >
                          {card}
                        </a>
                      );
                    }

                    return (
                      <Link
                        key={profile.key}
                        to={profile.url}
                        className="coding-card-link-wrapper"
                      >
                        {card}
                      </Link>
                    );
                  }

                  return (
                    <Link key={profile.key} to="/profile" className="coding-card-link-wrapper">
                      {card}
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="workspace-section panel ai-insight-card">
              <div className="workspace-panel-header">
                <div>
                  <p className="eyebrow">AI Insight</p>
                  <h2 className="section-heading">Today's AI Insight</h2>
                </div>
              </div>
              <div className="ai-insight-content">
                <p className="ai-insight-description">
                  {aiInsight
                    ? aiInsight
                    : "Complete your AI analysis to receive personalized placement recommendations."}
                </p>
              </div>
              <Link to="/ai-dashboard" className="btn btn-primary workspace-cta-btn">
                Open AI Mentor
              </Link>
            </section>

            <section className="workspace-section quick-actions-panel">
              <div className="workspace-panel-header">
                <div>
                  <p className="eyebrow section-heading">Quick Actions</p>
                  <h2>What to do next</h2>
                </div>
              </div>

              <div className="quick-actions-grid">
                <Link to="/ai-dashboard" className="quick-action-card">
                  <span className="quick-action-card__icon">🤖</span>
                  <div>
                    <h3>AI Mentor</h3>
                    <p>Analyze your placement profile</p>
                  </div>
                </Link>
                <Link to="/companies" className="quick-action-card">
                  <span className="quick-action-card__icon">🏢</span>
                  <div>
                    <h3>Companies</h3>
                    <p>Browse companies and opportunities</p>
                  </div>
                </Link>
                <Link to="/tickets" className="quick-action-card">
                  <span className="quick-action-card__icon">💬</span>
                  <div>
                    <h3>Queries</h3>
                    <p>Raise and track placement queries</p>
                  </div>
                </Link>
                <Link to="/profile" className="quick-action-card">
                  <span className="quick-action-card__icon">👤</span>
                  <div>
                    <h3>Profile</h3>
                    <p>Update your personal information</p>
                  </div>
                </Link>
              </div>
            </section>

            {activityItems?.length > 0 && (
              <section className="workspace-section panel recent-activity-panel">
                <div className="workspace-panel-header">
                  <div>
                    <p className="eyebrow">Recent Activity</p>
                    <h2>Your latest placement actions</h2>
                  </div>
                </div>
                <ul className="activity-list">
                  {activityItems.map((item, index) => (
                    <li key={index} className="activity-item">
                      <p>{item}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;
