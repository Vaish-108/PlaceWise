import { useEffect, useMemo, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { getAllTickets, updateTicket } from "../../services/ticketService";
import "../AdminCompanies/AdminCompanies.css";

function AdminQueries() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [expandedTicketId, setExpandedTicketId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllTickets();
      setTickets(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load queries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const unreadCount = useMemo(
    () => tickets.filter((ticket) => !ticket.adminRead).length,
    [tickets]
  );

  const openTicket = async (ticket) => {
    const isOpening = expandedTicketId !== ticket._id;
    setExpandedTicketId(isOpening ? ticket._id : null);
    setSelectedTicket(isOpening ? ticket : null);
    setResponse(isOpening ? ticket.adminResponse || "" : "");

    if (isOpening && !ticket.adminRead) {
      try {
        const responseData = await updateTicket(ticket._id, { adminRead: true });
        const updated = responseData?.ticket || { ...ticket, adminRead: true };
        setTickets((prev) => prev.map((item) => (item._id === ticket._id ? updated : item)));
        setSelectedTicket(updated);
      } catch (err) {
        console.error("Failed to mark query as read:", err);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedTicket) {
      return;
    }

    const trimmedResponse = response.trim();
    if (!trimmedResponse) {
      setError("Please write a response before sending.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const updatedTicket = await updateTicket(selectedTicket._id, {
        adminResponse: trimmedResponse,
        studentRead: false,
        adminRead: true,
      });

      const nextTicket = updatedTicket?.ticket || {
        ...selectedTicket,
        adminResponse: trimmedResponse,
        studentRead: false,
        adminRead: true,
      };

      setSelectedTicket(nextTicket);
      setTickets((prev) => prev.map((ticket) => (ticket._id === nextTicket._id ? nextTicket : ticket)));
      setResponse("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send response.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-companies-page admin-queries-page">
      <AdminNavbar />

      <main className="admin-dashboard-content">
        <div className="admin-companies-header">
          <div>
            <p className="admin-companies-eyebrow">Admin Panel</p>
            <h1>Student Queries</h1>
            <p className="admin-companies-subtitle">Read incoming student questions and reply directly.</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <section className="admin-companies-list-card">
          <div className="admin-companies-list-header">
            <h2>Incoming Queries</h2>
            {unreadCount > 0 && <span className="query-count-badge query-count-badge--admin">{unreadCount}</span>}
          </div>

          {loading ? (
            <LoadingSpinner label="Loading student queries..." />
          ) : tickets.length === 0 ? (
            <p className="admin-companies-status">No student queries yet.</p>
          ) : (
            <div className="admin-companies-grid">
              {tickets.map((ticket) => {
                const isUnread = !ticket.adminRead;
                const studentName = ticket.studentId?.name || "Unknown student";
                const studentEmail = ticket.studentId?.email || "No email";
                const isExpanded = expandedTicketId === ticket._id;

                return (
                  <article
                    key={ticket._id}
                    className={`admin-company-card ${isUnread ? "admin-company-card--unread" : ""} ${
                      isExpanded ? "admin-company-card--expanded" : ""
                    }`}
                  >
                    <div className="ticket-header-row">
                      <div className="ticket-avatar">
                        {studentName
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase() || "S"}
                      </div>

                      <div className="ticket-header-main">
                        <div className="ticket-header-topline">
                          <h3 className="ticket-subject">{ticket.subject}</h3>
                          <span className="ticket-date">
                            {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "Recent"}
                          </span>
                        </div>

                        <div className="ticket-info-row">
                          <span className="ticket-label">Student:</span>
                          <span className="ticket-value">{studentName}</span>
                        </div>
                        <div className="ticket-info-row ticket-info-row--email">
                          <span className="ticket-label">Email:</span>
                          <span className="ticket-value">{studentEmail}</span>
                        </div>
                      </div>

                      {isUnread && <span className="query-new-badge">NEW</span>}
                    </div>

                    <div className="admin-companies-actions ticket-actions">
                      <button type="button" className="btn-primary" onClick={() => openTicket(ticket)}>
                        {isExpanded ? "Close" : "Open"}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="ticket-body admin-query-detail">
                        <div className="admin-query-detail__body">
                          <div className="admin-query-section">
                            <div className="admin-query-section__label">Student Message</div>
                            <div className="admin-query-message-box">
                              <p>{ticket.message}</p>
                              <span className="conversation-bubble__meta">
                                {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : ""}
                              </span>
                            </div>
                          </div>

                          {ticket.adminResponse ? (
                            <div className="admin-query-section">
                              <div className="admin-query-section__label admin-query-section__label--admin">
                                Admin Response
                              </div>
                              <div className="admin-query-message-box admin-query-message-box--admin">
                                <p>{ticket.adminResponse}</p>
                                <span className="conversation-bubble__meta">Previous response</span>
                              </div>
                            </div>
                          ) : (
                            <div className="admin-query-section">
                              <div className="admin-query-section__label admin-query-section__label--waiting">
                                Waiting for admin response
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="admin-query-response-box">
                          <label className="admin-query-response-box__label">Write a Response</label>
                          <textarea
                            value={response}
                            onChange={(event) => setResponse(event.target.value)}
                            rows="5"
                            placeholder="Type your response..."
                          />

                          <button type="button" className="admin-query-send-btn" onClick={handleSubmit} disabled={saving}>
                            {saving ? "Sending..." : "Send Response"}
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default AdminQueries;
