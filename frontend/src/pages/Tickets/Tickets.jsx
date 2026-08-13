import axios from "axios";
import { API_URL } from "../../apiConfig";
import { useEffect, useState } from "react";
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
  getAllTickets,
  updateTicket,
  deleteTicket,
} from "../../services/ticketService";

const statusLabels = {
  open: "Open",
  "in-progress": "In Progress",
  resolved: "Resolved",
};

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [adminTickets, setAdminTickets] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [expandedTickets, setExpandedTickets] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [adminUpdates, setAdminUpdates] = useState({});

  const getUserProfile = async () => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    if (localStorage.getItem("adminToken")) {
      const response = await axios.get(`${API_URL}/api/admin/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    }

    const response = await axios.get(`${API_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  };

  const loadTickets = async (adminUser = false) => {
    try {
      setLoading(true);
      setError("");

      const myTickets = await getMyTickets();
      setTickets(myTickets);

      if (adminUser) {
        const allTickets = await getAllTickets();
        setAdminTickets(allTickets);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load queries. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const profile = await getUserProfile();
        const adminUser = profile.role === "admin";
        setIsAdmin(adminUser);
        await loadTickets(adminUser);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load query workspace."
        );
        setLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [message]);

  const toggleExpanded = (ticketId) => {
    setExpandedTickets((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }));
  };

  const getPreviewText = (text, isExpanded) => {
    if (isExpanded) {
      return text;
    }

    const lines = text.split(/\n/).filter(Boolean);
    if (lines.length > 2) {
      return `${lines.slice(0, 2).join("\n")}...`;
    }

    if (text.length > 180) {
      return `${text.slice(0, 180)}...`;
    }

    return text;
  };

  const shouldShowToggle = (text, isExpanded) => {
    if (isExpanded) {
      return true;
    }

    const lines = text.split(/\n/).filter(Boolean);
    return text.length > 180 || lines.length > 2;
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");
      setError("");

      await createTicket(formData);

      setFormData({ subject: "", message: "" });
      setMessage("Query submitted successfully.");
      await loadTickets(isAdmin);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit query."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminChange = (ticketId, field, value) => {
    setAdminUpdates((prev) => ({
      ...prev,
      [ticketId]: {
        ...prev[ticketId],
        [field]: value,
      },
    }));
  };

  const handleAdminUpdate = async (ticketId) => {
    try {
      setError("");
      setMessage("");

      const payload = adminUpdates[ticketId] || {};
      await updateTicket(ticketId, payload);
      setMessage("Query updated successfully.");
      await loadTickets(isAdmin);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update query."
      );
    }
  };

  const handleDeleteClick = (ticketId) => {
    setTicketToDelete(ticketId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTicketToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!ticketToDelete) {
      return;
    }

    try {
      setDeletingId(ticketToDelete);
      setError("");
      setMessage("");

      const response = await deleteTicket(ticketToDelete);

      if (response?.success === false) {
        throw new Error(response?.message || "Failed to delete query.");
      }

      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket._id !== ticketToDelete)
      );
      setAdminTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket._id !== ticketToDelete)
      );
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
      setSnackbarMessage(response?.message || "Query deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setMessage("Query deleted successfully.");
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.message || "Failed to delete query.";
      console.error("Delete ticket failed:", err.response?.data || err.message || err);
      setError(backendMessage);
      setSnackbarMessage(backendMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-content">
        <section className="page-header">
          <div>
            <p className="eyebrow">Queries</p>
            <h1>Student Queries</h1>
            <p className="page-subtitle">
              Submit placement questions and track admin responses in one place.
            </p>
          </div>
        </section>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <section className="panel ticket-form-panel">
          <h2>New Query</h2>
          <form className="stack-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="subject"
              placeholder="Query title"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Describe your query in detail"
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

        {loading && <LoadingSpinner label="Loading queries..." />}

        {!loading && (
          <section className="panel">
            <h2>My Queries</h2>
            {tickets.length === 0 ? (
              <div className="empty-state compact empty-state--queries">
                <span className="empty-state__icon">📝</span>
                <p>No Queries Found</p>
              </div>
            ) : (
              <div className="ticket-list">
                {tickets.map((ticket) => (
  <article key={ticket._id} className="ticket-card">
    
    <div className="ticket-card__header">
      <h3>{ticket.subject}</h3>

      <div className="ticket-card__actions">

        <button
          type="button"
          className="btn btn-secondary delete-btn"
          onClick={() => handleDeleteClick(ticket._id)}
          disabled={deletingId === ticket._id}
        >
          {deletingId === ticket._id ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>

    <p className="ticket-preview">
      {getPreviewText(
        ticket.message,
        expandedTickets[ticket._id]
      )}
    </p>

    {shouldShowToggle(
      ticket.message,
      expandedTickets[ticket._id]
    ) && (
      <div className="ticket-expand-row">
        <button
          type="button"
          className="show-more-link"
          onClick={() => toggleExpanded(ticket._id)}
        >
          {expandedTickets[ticket._id]
            ? "Show Less"
            : "Show More"}
        </button>
      </div>
    )}

    {ticket.adminResponse && (
      <div className="admin-response">
        <strong>Admin Response:</strong>
        <p>{ticket.adminResponse}</p>
      </div>
    )}

    <div className="ticket-created">
      Created: {new Date(ticket.createdAt).toLocaleString()}
    </div>

  </article>
))}
              </div>
            )}
          </section>
        )}

        {isAdmin && !loading && (
          <section className="panel admin-panel">
            <h2>Admin Query Management</h2>
            {adminTickets.length === 0 ? (
              <div className="empty-state compact empty-state--queries">
                <span className="empty-state__icon">📝</span>
                <p>No Queries Found</p>
              </div>
            ) : (
              <div className="ticket-list">
                {adminTickets.map((ticket) => (
                  <article key={ticket._id} className="ticket-card">
                    <div className="ticket-card__header">
                      <h3>{ticket.subject}</h3>
                      <div className="ticket-card__actions">
                        <span className={`status-badge status-${ticket.status}`}>
                          {statusLabels[ticket.status] || ticket.status}
                        </span>
                        <button
                          type="button"
                          className="btn btn-secondary delete-btn"
                          onClick={() => handleDeleteClick(ticket._id)}
                          disabled={deletingId === ticket._id}
                        >
                          {deletingId === ticket._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                    <p className="ticket-preview">
                      {getPreviewText(ticket.message, expandedTickets[ticket._id])}
                    </p>
                    {shouldShowToggle(ticket.message, expandedTickets[ticket._id]) && (
                      <button
                        type="button"
                        className="show-more-link"
                        onClick={() => toggleExpanded(ticket._id)}
                      >
                        {expandedTickets[ticket._id] ? "Show Less" : "Show More"}
                      </button>
                    )}
                    <p className="ticket-meta">
                      Student: {ticket.studentId?.name || "Unknown"} (
                      {ticket.studentId?.email || "N/A"})
                    </p>

                    <div className="admin-controls">
                      <select
                        defaultValue={ticket.status}
                        onChange={(event) =>
                          handleAdminChange(ticket._id, "status", event.target.value)
                        }
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>

                      <textarea
                        placeholder="Admin response"
                        defaultValue={ticket.adminResponse || ""}
                        rows="3"
                        onChange={(event) =>
                          handleAdminChange(
                            ticket._id,
                            "adminResponse",
                            event.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleAdminUpdate(ticket._id)}
                      >
                        Update Query
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Query</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this query?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Tickets;
