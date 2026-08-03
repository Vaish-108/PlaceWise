import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { getAnnouncements } from "../../services/announcementService";
import "./Announcements.css";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAnnouncements();

setAnnouncements(data || []);
      } catch (err) {
        setError("Unable to load announcements right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const formatDate = (value) => {
    if (!value) return "Recently published";

    const date = new Date(value);
    return date.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="announcements-page">
      <Navbar />

      <main className="student-dashboard-content">
        <section className="announcements-header">
          <p className="announcements-eyebrow">Student Portal</p>
          <h1>Announcements</h1>
          <p className="announcements-subtitle">
            Stay updated with the latest placement and college announcements.
          </p>
        </section>

        {loading ? (
          <div className="announcements-state">Loading announcements...</div>
        ) : error ? (
          <div className="announcements-state announcements-state-error">{error}</div>
        ) : announcements.length === 0 ? (
          <div className="announcements-state">No announcements available at the moment.</div>
        ) : (
          <div className="announcements-list">
            {announcements.map((announcement) => (
              <article key={announcement._id} className="announcement-card">
                <div className="announcement-card__header">
                  <h3>{announcement.title}</h3>
                  <span>{formatDate(announcement.createdAt)}</span>
                </div>
                <p>{announcement.message}</p>
                <div className="announcement-card__footer">
                  <span>Posted by {announcement.createdBy?.name || "Admin"}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Announcements;
