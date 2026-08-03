import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import "./AdminAnnouncements.css";

function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });

  const adminToken = localStorage.getItem("adminToken");

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("http://localhost:5000/api/announcements");
      setAnnouncements(response.data || []);
    } catch (err) {
      setError("Unable to load announcements right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!formData.title.trim() || !formData.message.trim()) {
      setError("Title and message are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await axios.post(
        "http://localhost:5000/api/announcements",
        {
          title: formData.title.trim(),
          message: formData.message.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMessage("Announcement created successfully.");
      setFormData({ title: "", message: "" });
      fetchAnnouncements();
    } catch (err) {
      setError("Failed to create announcement. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-announcements-page">
      <AdminNavbar />

      <main className="admin-dashboard-content">
        <div className="admin-announcements-header">
          <div>
            <p className="admin-announcements-eyebrow">Admin Portal</p>
            <h1>Announcements</h1>
            <p className="admin-announcements-subtitle">
              Create and manage placement-related updates for students in one place.
            </p>
          </div>
        </div>

        <div className="admin-announcements-content">
          <section className="admin-announcements-form-card">
          <h2>Create New Announcement</h2>
          <form onSubmit={handleSubmit} className="admin-announcements-form">
            <label>
              Title
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter announcement title"
              />
            </label>

            <label>
              Message
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="Write the announcement message"
              />
            </label>

            <button type="submit" disabled={submitting}>
              {submitting ? "Publishing..." : "Publish Announcement"}
            </button>
          </form>

          {error && <p className="admin-announcements-error">{error}</p>}
          {successMessage && <p className="admin-announcements-success">{successMessage}</p>}
        </section>

          <section className="admin-announcements-list-card">
            <div className="admin-announcements-list-header">
              <h2>Recent Announcements</h2>
              <span>{announcements.length} items</span>
            </div>

            {loading ? (
              <p className="admin-announcements-status">Loading announcements...</p>
            ) : error && announcements.length === 0 ? (
              <p className="admin-announcements-status">{error}</p>
            ) : announcements.length === 0 ? (
              <p className="admin-announcements-status">No announcements yet.</p>
            ) : (
              <div className="admin-announcements-grid">
                {announcements.map((announcement) => (
                  <article key={announcement._id} className="admin-announcement-card">
                    <h3>{announcement.title}</h3>
                    <p>{announcement.message}</p>
                    <div className="admin-announcement-meta">
                      <span>
                        {announcement.createdAt
                          ? new Date(announcement.createdAt).toLocaleDateString()
                          : "Recently added"}
                      </span>
                      <span>
                        {announcement.createdBy?.name || "Admin"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdminAnnouncements;
