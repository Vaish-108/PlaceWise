import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { getCollegeDisplayName } from "../../utils/collegeUtils";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
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

    try {
      const payload = {
        ...formData,
        collegeCode: college || "",
      };

      if (college) {
        localStorage.setItem("selectedCollege", college);
      }

      const data = await registerUser(payload);
      setMessage(data.message || "Registration successful");

      // If registration returned a token and user, sign the user in automatically
      if (data?.token) {
        localStorage.setItem("token", data.token);

        const userRole = data?.user?.role || "student";
        const userCollege = data?.user?.college || college || "";

        if (userCollege) {
          localStorage.setItem("selectedCollege", userCollege);
        }

        navigate(userRole === "admin" ? "/admin/dashboard" : "/dashboard");
      } else {
        // Fallback: navigate to login as before
        navigate(`/login${college ? `?college=${college}` : ""}`);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Get Started</p>
        <h1>Create Your Account</h1>
        <p className="page-subtitle">
          Join PlaceWise to manage your placement journey with AI-powered insights.
        </p>

        {college && <p className="form-message">College: {getCollegeDisplayName(college)}</p>}

        <form className="stack-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter email"
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
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>

        {message && <p className="form-message">{message}</p>}

        <p className="auth-switch">
          Already registered? <Link to={`/login${college ? `?college=${college}` : ""}`}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
