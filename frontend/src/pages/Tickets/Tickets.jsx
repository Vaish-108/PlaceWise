import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import {
  createTicket,
  getMyTickets,
  updateTicket,
  deleteTicket,
} from "../../services/ticketService";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [expandedTicketId, setExpandedTicketId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyTickets();
      setTickets(data || []);

      if (expandedTicketId && !(data || []).some((ticket) => ticket._id === expandedTicketId)) {
        setExpandedTicketId(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load queries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const unreadCount = useMemo(
    () => tickets.filter((ticket) => ticket.adminResponse && !ticket.studentRead).length,
    [tickets]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      setError("Please add both a subject and your message.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await createTicket({
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setFormData({ subject: "", message: "" });
      setNotice("Query submitted successfully.");
      const updatedTickets = await getMyTickets();
      setTickets(updatedTickets || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit query.");
    } finally {
      setSubmitting(false);
    }
  };

  const openTicket = async (ticket) => {
    const isOpening = expandedTicketId !== ticket._id;

    setExpandedTicketId(isOpening ? ticket._id : null);

    if (ticket.adminResponse && !ticket.studentRead) {
      try {
        const response = await updateTicket(ticket._id, { studentRead: true });
        const updated = response?.ticket || { ...ticket, studentRead: true };
        setTickets((prev) => prev.map((item) => (item._id === ticket._id ? updated : item)));
      } catch (err) {
        console.error("Failed to mark query as read:", err);
      }
    }
  };

  const handleDeleteClick = (ticketId) => {
    setTicketToDelete(ticketId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!ticketToDelete) {
      return;
    }

    try {
      const response = await deleteTicket(ticketToDelete);
      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket._id !== ticketToDelete)
      );

      if (expandedTicketId === ticketToDelete) {
        setExpandedTicketId(null);
      }

      setDeleteDialogOpen(false);
      setTicketToDelete(null);
      setSnackbarMessage(response?.message || "Query deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete query.";
      setError(message);
      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-content tickets-page-content">
        <section className="page-header tickets-page-header">
          <div>
            <p className="eyebrow">Student Portal</p>
            <h1>Queries</h1>
            <p className="page-subtitle">
              Send your questions to the placement admin and track their responses.
            </p>
          </div>
        </section>

        {notice && <div className="alert alert-success">{notice}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <section className="panel ticket-form-panel tickets-form-panel">
          <div className="tickets-section-header">
            <h2>New Query</h2>
          </div>
          <form className="stack-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="subject"
              placeholder="Query subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Describe your query"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            />
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Query"}
            </button>
          </form>
        </section>

        {loading ? (
          <LoadingSpinner label="Loading queries..." />
        ) : (
          <section className="panel tickets-panel">
            <div className="student-query-header">
              <h2>My Queries</h2>
              {unreadCount > 0 && <span className="query-count-badge">{unreadCount} New</span>}
            </div>

            {tickets.length === 0 ? (
              <div className="empty-state compact empty-state--queries tickets-empty-state">
                <span className="empty-state__icon">📝</span>
                <p className="empty-state__title">No queries yet.</p>
                <p className="empty-state__subtitle">
                  Have a question about placements? Send your first query to the admin.
                </p>
              </div>
            ) : (
              <div className="ticket-list">
                {tickets.map((ticket) => {
                  const isUnread = Boolean(ticket.adminResponse && !ticket.studentRead);
                  const isExpanded = expandedTicketId === ticket._id;

                  return (
                    <article
                      key={ticket._id}
                      className={`query-card ${isUnread ? "query-card--unread" : ""} ${
                        isExpanded ? "query-card--expanded" : ""
                      }`}
                    >
                      <div className="query-card__top">
                        <div className="query-card__title-block">
                          <h3>{ticket.subject}</h3>
                        </div>
                        <span className="query-card__time">
                          {new Date(ticket.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="query-card__summary">
                        <div
                          className={`query-card__status ${
                            isUnread ? "query-card__status--new" : "query-card__status--pending"
                          }`}
                        >
                          <span className="status-dot" />
                          <span>{isUnread ? "Admin replied" : "Waiting for admin response"}</span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="query-card__detail">
                          <div className="query-card__detail-section">
                            <div className="query-card__label">Your Message</div>
                            <div className="query-card__content-box">{ticket.message}</div>
                          </div>

                          {ticket.adminResponse ? (
                            <div className="query-card__detail-section">
                              <div className="query-card__label query-card__label--admin">
                                Admin Response
                              </div>
                              <div className="query-card__content-box query-card__content-box--admin">
                                {ticket.adminResponse}
                              </div>
                            </div>
                          ) : (
                            <div className="query-card__detail-section">
                              <div className="query-card__label query-card__label--waiting">
                                Waiting for admin response
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="query-card__footer">
                        <div className="query-card__meta">
                          {ticket.adminResponse ? "Admin response available" : "No response yet"}
                        </div>

                        <div className="query-card__actions">
                          <button
                            type="button"
                            className="btn btn-secondary query-open-btn"
                            onClick={() => openTicket(ticket)}
                          >
                            {isExpanded ? "Close" : "Open"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary query-delete-btn"
                            onClick={() => handleDeleteClick(ticket._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

      </main>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete this query?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this query? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Tickets;
