import { useEffect, useState } from "react";
import "./StudentDashboard.css";
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
    <div className="page-shell workspace-shell">
      <Navbar />

      <main className="page-content workspace-page student-dashboard-page">
        {loading && <LoadingSpinner label="Loading workspace details..." />}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && user && (
          <>
            <section className="workspace-section profile-card-panel">
              <div className="workspace-panel-header">
                <div>
                  <p className="eyebrow section-heading">Profile</p>
                  <h2>Student profile overview</h2>
                </div>
              </div>

              <div className="workspace-section__inner profile-card-inner">
                <div className="workspace-section__content-card profile-card-shell">
                  <div className="profile-card-content">
                    <div className="profile-card-photo-wrap">
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
                    </div>

                    <div className="profile-card-details">
                      <div>
                        <h1 className="profile-name">{user.name || "Student"}</h1>
                        <p className="profile-card-college">{displayValue(user.college)}</p>
                        <p className="profile-card-branch">
                          {displayValue(user.branch)} / {displayValue(user.course)}
                        </p>
                      </div>

                      <div className="profile-card-links">
                        <a
                          href={user?.linkedin || "/profile"}
                          target={user?.linkedin ? "_blank" : undefined}
                          rel={user?.linkedin ? "noopener noreferrer" : undefined}
                          className="profile-link-icon"
                          aria-label="LinkedIn"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <rect x="2" y="2" width="20" height="20" rx="2" fill="currentColor" opacity="0" />
                            <path d="M6.94 8.94H4.5V19.5h2.44V8.94zM5.72 7.5c-.78 0-1.26-.56-1.26-1.26 0-.72.5-1.26 1.29-1.26.79 0 1.26.54 1.26 1.26 0 .7-.47 1.26-1.29 1.26zM19.5 19.5h-2.44v-5.04c0-1.2-.43-2.02-1.5-2.02-.82 0-1.31.55-1.52 1.08-.08.2-.1.48-.1.76V19.5H11.5s.03-8.98 0-9.96h2.44v1.41c.32-.5.9-1.22 2.2-1.22 1.6 0 2.8 1.04 2.8 3.27V19.5z" fill="currentColor" />
                          </svg>
                        </a>
                        <a
                          href={user?.github || "/profile"}
                          target={user?.github ? "_blank" : undefined}
                          rel={user?.github ? "noopener noreferrer" : undefined}
                          className="profile-link-icon"
                          aria-label="GitHub"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.95 3.21 9.15 7.66 10.63.56.1.76-.24.76-.54 0-.27-.01-1-.02-1.97-3.12.68-3.78-1.5-3.78-1.5-.51-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .17 1.54.98 1.54.98.95 1.63 2.5 1.16 3.11.89.1-.7.39-1.16.71-1.43-2.49-.28-5.11-1.25-5.11-5.55 0-1.23.44-2.24 1.16-3.03-.12-.28-.5-1.42.11-2.96 0 0 .95-.31 3.12 1.16a10.8 10.8 0 0 1 2.84-.38c.96 0 1.93.13 2.84.38 2.17-1.47 3.12-1.16 3.12-1.16.61 1.54.23 2.68.11 2.96.72.79 1.16 1.8 1.16 3.03 0 4.31-2.63 5.27-5.13 5.55.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.77.54 4.45-1.48 7.66-5.68 7.66-10.63C23.25 5.48 18.27.5 12 .5z" fill="currentColor" />
                          </svg>
                        </a>
                        <a
                          href={user?.leetcode || "/profile"}
                          target={user?.leetcode ? "_blank" : undefined}
                          rel={user?.leetcode ? "noopener noreferrer" : undefined}
                          className="profile-link-icon"
                          aria-label="LeetCode"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm3.5 8.5c0 .83-.67 1.5-1.5 1.5H13v1.3c0 .5-.54.8-.96.55-1.24-.66-2.85-1.62-3.9-2.36-.4-.3-.45-.86-.1-1.23.34-.36.92-.39 1.31-.08 1.1.82 2.7 1.8 3.97 2.47V11h1.02c1.93 0 3.41-1.8 2.79-3.59-.28-.73-1.07-1.26-1.88-1.26H14v2.88h1.5c.83 0 1.5.67 1.5 1.5z" fill="currentColor" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="workspace-section profile-summary-section">
              <div className="workspace-panel-header">
                <div>
                  <p className="eyebrow section-heading">Profile Summary</p>
                  <h2>Student details at a glance</h2>
                </div>
              </div>

              <div className="workspace-section__inner profile-summary-inner">
                <div className="summary-card-grid">
                  <div className="summary-card">
                    <p className="summary-card-label">Semester</p>
                    <strong>{displayValue(user.semester)}</strong>
                  </div>
                  <div className="summary-card">
                    <p className="summary-card-label">Year</p>
                    <strong>{displayValue(user.year)}</strong>
                  </div>
                  <div className="summary-card">
                    <p className="summary-card-label">CGPA</p>
                    <strong>{displayValue(user.cgpa)}</strong>
                  </div>
                  <div className="summary-card">
                    <p className="summary-card-label">Branch</p>
                    <strong>{displayValue(user.branch)}</strong>
                  </div>
                  <div className="summary-card">
                    <p className="summary-card-label">Email</p>
                    <strong>{displayValue(user.email)}</strong>
                  </div>
                  <div className="summary-card">
                    <p className="summary-card-label">Enrollment Number</p>
                    <strong>{displayValue(user.enrollmentNumber || user.enrollment)}</strong>
                  </div>
                  <div className="summary-card">
                    <p className="summary-card-label">Date of Birth</p>
                    <strong>{displayValue(user.dateOfBirth || user.dob)}</strong>
                  </div>
                  <div className="summary-card">
                    <p className="summary-card-label">Phone Number</p>
                    <strong>{displayValue(user.phone || user.phoneNumber)}</strong>
                  </div>
                </div>
              </div>
            </section>

            <section className="workspace-section coding-profiles-panel">
              <div className="workspace-panel-header">
                <div>
                  <p className="eyebrow section-heading">Professional Profiles</p>
                  <h2>Quick access to your professional accounts.</h2>
                </div>
              </div>

              <div className="workspace-section__inner coding-profiles-inner">
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
              </div>
            </section>

            <section className="workspace-section ai-insight-card">
              <div className="workspace-panel-header">
                <div>
                  <p className="eyebrow">AI Insight</p>
                  <h2 className="section-heading">Today's AI Insight</h2>
                </div>
              </div>

              <div className="workspace-section__inner ai-insight-inner">
                <div className="workspace-section__content-card ai-insight-shell">
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
                </div>
              </div>
            </section>

            <section className="workspace-section quick-actions-panel">
              <div className="workspace-panel-header">
                <div>
                  <p className="eyebrow section-heading">Quick Actions</p>
                  <h2>What to do next</h2>
                </div>
              </div>

              <div className="workspace-section__inner quick-actions-inner">
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
              </div>
            </section>

            {activityItems?.length > 0 && (
              <section className="workspace-section recent-activity-panel">
                <div className="workspace-panel-header">
                  <div>
                    <p className="eyebrow">Recent Activity</p>
                    <h2>Your latest placement actions</h2>
                  </div>
                </div>
                <div className="workspace-section__inner recent-activity-inner">
                  <ul className="activity-list">
                    {activityItems.map((item, index) => (
                      <li key={index} className="activity-item">
                        <p>{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;
