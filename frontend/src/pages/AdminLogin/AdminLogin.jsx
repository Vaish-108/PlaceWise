import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { getCollegeDisplayName } from "../../utils/collegeUtils";
import "./AdminLogin.css";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const college = searchParams.get("college") || localStorage.getItem("selectedCollege");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", {
        email: formData.email,
        password: formData.password,
        collegeCode: college || "",
      });

      const token = response?.data?.token;

      if (!token) {
        throw new Error("Admin login failed.");
      }

      localStorage.setItem("adminToken", token);

      const adminCollege = response?.data?.admin?.college || college || "";

      if (adminCollege) {
        localStorage.setItem("selectedCollege", adminCollege);
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-auth-page">
      <div className="auth-card admin-auth-card">
        <p className="eyebrow">Secure Access</p>
        <h1>Admin Login</h1>
        <p className="page-subtitle">
          Sign in to manage the PlaceWise admin portal.
        </p>

        {college && <p className="form-message">College: {getCollegeDisplayName(college)}</p>}

        <form className="stack-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter admin email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="form-message form-message--error">{error}</p>}

        <p className="auth-switch">
          <Link to={college ? `/?college=${college}` : "/"}>Back to Home</Link>
        </p>

        <p className="auth-switch">
          <Link to={college ? `/admin/register?college=${college}` : "/admin/register"}>
            Don&apos;t have an admin account? Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
