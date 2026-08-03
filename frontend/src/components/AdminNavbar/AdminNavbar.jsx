import { NavLink, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("admin")) {
        localStorage.removeItem(key);
      }
    });

    navigate("/admin/login");
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar__brand">
        <span className="admin-navbar__logo">PW</span>
        <span>PlaceWise</span>
      </div>

      <div className="admin-navbar__links">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? "admin-navbar__link admin-navbar__link--active" : "admin-navbar__link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/companies"
          className={({ isActive }) =>
            isActive ? "admin-navbar__link admin-navbar__link--active" : "admin-navbar__link"
          }
        >
          Companies
        </NavLink>

        <NavLink
          to="/admin/announcements"
          className={({ isActive }) =>
            isActive ? "admin-navbar__link admin-navbar__link--active" : "admin-navbar__link"
          }
        >
          Announcements
        </NavLink>

        <NavLink
          to="/admin/queries"
          className={({ isActive }) =>
            isActive ? "admin-navbar__link admin-navbar__link--active" : "admin-navbar__link"
          }
        >
          Queries
        </NavLink>

        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            isActive ? "admin-navbar__link admin-navbar__link--active" : "admin-navbar__link"
          }
        >
          Profile
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="admin-navbar__logout"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
