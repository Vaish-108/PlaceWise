import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
          "http://localhost:5000/api/admin/profile",
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

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="admin-dashboard-page">
      <nav className="admin-navbar">
        <div className="admin-navbar__brand">
          <span className="admin-navbar__logo">PW</span>
          <span>PlaceWise</span>
        </div>

        <div className="admin-navbar__links">
          <Link to="/admin/dashboard">Dashboard</Link>

          <Link to="/admin/profile">Profile</Link>

          <Link to="/admin/companies">Companies</Link>

          <Link to="/admin/announcements">
            Announcements
          </Link>

          <Link to="/admin/queries">Queries</Link>

          <button
            type="button"
            onClick={handleLogout}
            className="admin-navbar__logout"
          >
            Logout
          </button>
        </div>
      </nav>

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

              <div className="admin-profile-card__details">
                <h2>{admin.name}</h2>

                <p>
                  {admin.college ||
                    "College not updated"}
                </p>

                <p>
                  {admin.designation ||
                    "Placement Administrator"}
                </p>

                <p>{admin.email}</p>

                <p>
                  {admin.phone ||
                    "Phone not updated"}
                </p>
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
              </Link>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
