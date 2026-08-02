import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { getCollegeDisplayName } from "../../utils/collegeUtils";

function Login() {
  const [formData, setFormData] = useState({
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
      const data = await loginUser({
        ...formData,
        collegeCode: college || "",
      });
      localStorage.setItem("token", data.token);

      if (college) {
        localStorage.setItem("selectedCollege", college);
      } else if (data?.user?.college) {
        localStorage.setItem("selectedCollege", data.user.college);
      }

      setMessage("Login successful");
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Welcome Back</p>
        <h1>Login to PlaceWise</h1>
        <p className="page-subtitle">
          Access your placement dashboard, AI insights, and support tickets.
        </p>

        {college && <p className="form-message">College: {getCollegeDisplayName(college)}</p>}

        <form className="stack-form" onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>

        {message && <p className="form-message">{message}</p>}

        <p className="auth-switch">
          New user? <Link to={`/register${college ? `?college=${college}` : ""}`}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
