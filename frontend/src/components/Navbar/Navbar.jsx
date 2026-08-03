import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

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
          Queries
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
