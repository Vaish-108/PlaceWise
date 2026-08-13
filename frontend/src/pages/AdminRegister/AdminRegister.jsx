import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../apiConfig";
import { getCollegeDisplayName } from "../../utils/collegeUtils";
import "./AdminRegister.css";

function AdminRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    designation: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
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
    setMessage("");

    const { name, email, password } = formData;

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Name, email, and password are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/admin/register`, {
        name: name.trim(),
        email: email.trim(),
        password,
        phone: formData.phone.trim(),
        collegeCode: college || "",
        designation: formData.designation.trim(),
      });

      if (college) {
        localStorage.setItem("selectedCollege", college);
      }

      setMessage(response?.data?.message || "Admin registered successfully.");

      setTimeout(() => {
        navigate(`/admin/login${college ? `?college=${college}` : ""}`);
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Admin registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-auth-page">
      <div className="auth-card admin-auth-card">
        <p className="eyebrow">Create Admin Access</p>
        <h1>Admin Registration</h1>
        <p className="page-subtitle">
          Register a new admin account for the PlaceWise portal.
        </p>

        {college && <p className="form-message">College: {getCollegeDisplayName(college)}</p>}

        <form className="stack-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
          <input
            type="text"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="designation"
            placeholder="Enter designation"
            value={formData.designation}
            onChange={handleChange}
          />

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && <p className="form-message form-message--error">{error}</p>}
        {message && <p className="form-message">{message}</p>}

        <p className="auth-switch">
          <Link to={college ? `/admin/login?college=${college}` : "/admin/login"}>
            Back to Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminRegister;
