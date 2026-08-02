import { useEffect, useState } from "react";
import axios from "axios";
import "../AdminCompanies/AdminCompanies.css";

function AdminQueries() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [status, setStatus] = useState("open");
  const [response, setResponse] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const adminToken = localStorage.getItem("adminToken");

  const fetchTickets = async () => {
    if (!adminToken) {
      setError("Please log in as an admin.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.get("http://localhost:5000/api/tickets/all", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setTickets(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load queries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const openTicket = (ticket) => {
    setSelectedTicket(ticket);
    setStatus(ticket.status || "open");
    setResponse(ticket.adminResponse || "");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      setSaving(true);
      await axios.put(
        `http://localhost:5000/api/tickets/${selectedTicket._id}`,
        { status, adminResponse: response },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update query.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ticketId) => {
    try {
      setDeleting(true);
      await axios.delete(`http://localhost:5000/api/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete query.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-companies-page">
      <div className="admin-companies-header">
        <div>
          <p className="admin-companies-eyebrow">Admin Panel</p>
          <h1>Queries & Tickets</h1>
          <p className="admin-companies-subtitle">Review college queries, update status, and respond to student concerns.</p>
        </div>
      </div>

      <div className="admin-companies-content">
        <section className="admin-companies-list-card">
          <div className="admin-companies-list-header">
            <h2>College Queries</h2>
            <span>{tickets.length} tickets</span>
          </div>

          {loading ? (
            <p className="admin-companies-status">Loading queries...</p>
          ) : tickets.length === 0 ? (
            <p className="admin-companies-status">No queries available for your college yet.</p>
          ) : (
            <div className="admin-companies-grid">
              {tickets.map((ticket) => (
                <article key={ticket._id} className="admin-company-card">
                  <h3>{ticket.subject}</h3>
                  <p><strong>Student:</strong> {ticket.studentId?.name || "Unknown"}</p>
                  <p><strong>Status:</strong> {ticket.status}</p>
                  <p><strong>Message:</strong> {ticket.message}</p>
                  <div className="admin-companies-actions">
                    <button type="button" onClick={() => openTicket(ticket)}>View / Update</button>
                    <button type="button" onClick={() => handleDelete(ticket._id)} disabled={deleting}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {selectedTicket && (
          <section className="admin-companies-form-card">
            <h2>Update Query</h2>
            <form onSubmit={handleUpdate} className="admin-companies-form">
              <label>
                Status
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </label>

              <label>
                Admin Response
                <textarea value={response} onChange={(e) => setResponse(e.target.value)} rows="4" placeholder="Enter your response" />
              </label>

              <button type="submit" disabled={saving}>{saving ? "Updating..." : "Save Changes"}</button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}

export default AdminQueries;
