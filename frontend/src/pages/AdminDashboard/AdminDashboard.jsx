import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../apiConfig";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    companies: null,
    announcements: null,
    openQueries: null,
    drives: null,
  });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("Please log in as an admin.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/admin/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAdmin(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load admin profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
    // fetch quick stats (best-effort)
    const fetchStats = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      try {
        const headers = { headers: { Authorization: `Bearer ${token}` } };

        const [companiesRes, announcementsRes, ticketsRes, jobsRes] = await Promise.allSettled([
          axios.get(`${API_URL}/api/companies`, headers),
          axios.get(`${API_URL}/api/announcements`, headers),
          axios.get(`${API_URL}/api/tickets/all`, headers),
          axios.get(`${API_URL}/api/jobs`, headers),
        ]);

        const companies = companiesRes.status === "fulfilled" ? (companiesRes.value.data || []).length : null;
        const announcements = announcementsRes.status === "fulfilled" ? (announcementsRes.value.data || []).length : null;
        const openQueries = ticketsRes.status === "fulfilled" ? (ticketsRes.value.data || []).length : null;
        const drives = jobsRes.status === "fulfilled" ? (jobsRes.value.data || []).length : null;

        setStats({ companies, announcements, openQueries, drives });

        // build a lightweight recent activity list from available data
        const activities = [];
        if (announcementsRes.status === "fulfilled") {
          const anns = announcementsRes.value.data || [];
          anns.slice(-3).reverse().forEach((a) =>
            activities.push({ type: "announcement", title: a.title || "Announcement", when: a.createdAt || a.date, short: a.message?.slice(0, 120) })
          );
        }
        if (companiesRes.status === "fulfilled") {
          const comps = companiesRes.value.data || [];
          comps.slice(-3).reverse().forEach((c) =>
            activities.push({ type: "company", title: c.name || "Company added", when: c.createdAt, short: c.description?.slice(0, 120) })
          );
        }
        if (ticketsRes.status === "fulfilled") {
          const tks = ticketsRes.value.data || [];
          tks.slice(-3).reverse().forEach((t) =>
            activities.push({ type: "ticket", title: t.subject || "Student query", when: t.createdAt, short: t.message?.slice(0, 120) })
          );
        }

        setRecent(activities.slice(0, 6));
      } catch (err) {
        // silently ignore; stats are best-effort
      }
    };

    fetchStats();
  }, []);

  const initials = useMemo(() => {
    const name = admin?.name || "Admin";

    return (
      name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join("") || "A"
    );
  }, [admin]);

  return (
    <div className="admin-dashboard-page">
      <AdminNavbar />

      <main className="admin-dashboard-content">
        <section className="admin-dashboard__hero">
          <div className="admin-dashboard__hero-text">
            <p className="eyebrow">Admin Portal</p>

            <h1>
              Welcome back, {admin?.name || "Admin"}
            </h1>

            <p className="page-subtitle">
              Manage companies, announcements,
              student queries and placement activities
              from one place.
            </p>
          </div>
        </section>

        {loading && (
          <div className="admin-dashboard__state">
            Loading profile...
          </div>
        )}

        {error && (
          <div className="admin-dashboard__state admin-dashboard__state--error">
            {error}
          </div>
        )}

        {!loading && !error && admin && (
          <>
            <section className="admin-profile-card">
              <div className="admin-profile-card__avatar">
                {admin.profilePhoto ? (
                  <img
                    src={admin.profilePhoto}
                    alt={admin.name}
                  />
                ) : (
                  initials
                )}
              </div>

              <div className="admin-profile-card__main">
                <div className="admin-profile-card__details">
                  <h2>{admin.name}</h2>

                  <p>
                    {admin.college || "College not updated"}
                  </p>

                  <p>
                    {admin.designation || "Placement Administrator"}
                  </p>
                </div>

                <div className="admin-profile-card__contact">
                  <p className="contact-label">Email</p>
                  <p className="contact-value">{admin.email}</p>

                  <p className="contact-label">Phone</p>
                  <p className="contact-value">{admin.phone || "Phone not updated"}</p>
                </div>
              </div>
            </section>

            {/* Placement Overview / Quick Stats */}
            <section className="admin-dashboard-overview">
              <h3 className="section-eyebrow">Placement Overview</h3>

              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="stat-icon">🏢</div>
                  <div>
                    <p className="stat-label">Total Companies</p>
                    <p className="stat-value">{stats.companies ?? "—"}</p>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon">📣</div>
                  <div>
                    <p className="stat-label">Active Announcements</p>
                    <p className="stat-value">{stats.announcements ?? "—"}</p>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon">💬</div>
                  <div>
                    <p className="stat-label">Open Queries</p>
                    <p className="stat-value">{stats.openQueries ?? "—"}</p>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon">🧾</div>
                  <div>
                    <p className="stat-label">Placement Drives</p>
                    <p className="stat-value">{stats.drives ?? "—"}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="admin-quick-actions">
              <Link
                to="/admin/companies"
                className="admin-quick-action-card"
              >
                <h3>Manage Companies</h3>

                <p>
                  Add, edit and manage companies
                  visiting your college.
                </p>
                <span className="action-arrow">Manage →</span>
              </Link>

              <Link
                to="/admin/announcements"
                className="admin-quick-action-card"
              >
                <h3>Announcements</h3>

                <p>
                  Publish placement notices,
                  deadlines and important updates
                  for students.
                </p>
                <span className="action-arrow">Open →</span>
              </Link>

              <Link
                to="/admin/queries"
                className="admin-quick-action-card"
              >
                <h3>Student Queries</h3>

                <p>
                  View and respond to student
                  queries raised through PlaceWise.
                </p>
                <span className="action-arrow">Open →</span>
              </Link>
            </section>

            {/* Lower area: Quick Actions + Recent Activity */}
            <div className="admin-dashboard-lower">
              <div className="admin-dashboard-left">
                <div className="admin-dashboard-actions">
                  <Link to="/admin/companies" className="admin-action-btn">+ Add Company</Link>
                  <Link to="/admin/announcements" className="admin-action-btn">+ Post Announcement</Link>
                  <Link to="/admin/queries" className="admin-action-btn">Review Queries</Link>
                  <Link to="/admin/profile" className="admin-action-btn secondary">View Profile</Link>
                </div>

                {/* Simple Placement Activity overview (visual bars) */}
                <div className="admin-activity-card" style={{ marginTop: 14 }}>
                  <h4 style={{ margin: 0, color: '#FFFFFF' }}>Placement Activity</h4>
                  <div style={{ height: 10 }} />
                  <div className="stat-row">
                    <div className="stat-row__label">Companies</div>
                    <div className="stat-row__bar"><div style={{ width: `${stats.companies ? Math.min(100, stats.companies*8) : 20}%` }} /></div>
                  </div>
                  <div className="stat-row">
                    <div className="stat-row__label">Announcements</div>
                    <div className="stat-row__bar"><div style={{ width: `${stats.announcements ? Math.min(100, stats.announcements*15) : 10}%` }} /></div>
                  </div>
                  <div className="stat-row">
                    <div className="stat-row__label">Queries</div>
                    <div className="stat-row__bar"><div style={{ width: `${stats.openQueries ? Math.min(100, stats.openQueries*20) : 30}%` }} /></div>
                  </div>
                </div>
              </div>

              <aside className="admin-dashboard-right">
                <div className="admin-activity-card">
                  <h4 style={{ margin: 0, color: '#FFFFFF', marginBottom: 8 }}>Recent Activity</h4>
                  {recent.length === 0 ? (
                    <p style={{ color: '#CFCFCF', margin: 0 }}>No recent activity available.</p>
                  ) : (
                    <div className="admin-activity-list">
                      {recent.map((item, idx) => (
                        <div className="admin-activity-item" key={idx}>
                          <div className="dot" />
                          <div className="activity-text">
                            <div style={{ color: '#FFFFFF', fontWeight: 700 }}>{item.title}</div>
                            <div style={{ fontSize: 12 }}>{item.short}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
