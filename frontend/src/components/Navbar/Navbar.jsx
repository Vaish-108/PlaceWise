import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getMyTickets } from "../../services/ticketService";

function Navbar() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUnreadCount(0);
        return;
      }

      try {
        const tickets = await getMyTickets();
        const count = (tickets || []).filter(
          (ticket) => ticket.adminResponse && !ticket.studentRead
        ).length;
        setUnreadCount(count);
      } catch (error) {
        setUnreadCount(0);
      }
    };

    loadUnreadCount();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentToken");
    localStorage.removeItem("user");
    localStorage.removeItem("studentProfile");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="brand-mark">PW</span>
        <div>
          <strong>PlaceWise</strong>
          <p>AI Placement Portal</p>
        </div>
      </div>

      <nav className="navbar-links">
        <NavLink to="/dashboard" className={linkClass}>
          Workspace
        </NavLink>
        <NavLink to="/companies" className={linkClass}>
          Companies
        </NavLink>
        <NavLink to="/ai-dashboard" className={linkClass}>
          AI Mentor
        </NavLink>
        <NavLink to="/announcements" className={linkClass}>
          Announcements
        </NavLink>
        <NavLink to="/tickets" className={linkClass}>
          <span className="nav-label">Queries</span>
          {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          Profile
        </NavLink>
      </nav>

      <button type="button" className="btn btn-secondary" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}

export default Navbar;
