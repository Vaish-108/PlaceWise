import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminCompanies.css";

function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    package: "",
    requiredSkills: "",
    minCGPA: "",
  });

  const adminToken = localStorage.getItem("adminToken");

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("http://localhost:5000/api/companies", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      setCompanies(response.data.companies || response.data || []);
    } catch (err) {
      setError("Unable to load companies right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Company name is required.";
    if (!formData.role.trim()) return "Role is required.";
    if (!formData.package.trim()) return "Package is required.";

    const skills = formData.requiredSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (skills.length === 0) return "At least one required skill is required.";

    const minCGPA = Number(formData.minCGPA);
    if (!Number.isFinite(minCGPA) || minCGPA < 0 || minCGPA > 10) {
      return "Minimum CGPA must be a number between 0 and 10.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      role: formData.role.trim(),
      package: formData.package.trim(),
      requiredSkills: formData.requiredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      minCGPA: Number(formData.minCGPA),
    };

    try {
      setSubmitting(true);
      setError("");
      await axios.post("http://localhost:5000/api/companies", payload, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });

      setSuccessMessage("Company added successfully.");
      setFormData({
        name: "",
        role: "",
        package: "",
        requiredSkills: "",
        minCGPA: "",
      });
      fetchCompanies();
    } catch (err) {
      setError("Failed to create company. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-companies-page">
      <div className="admin-companies-header">
        <div>
          <p className="admin-companies-eyebrow">Admin Panel</p>
          <h1>Company Management</h1>
          <p className="admin-companies-subtitle">
            Manage placement companies and add new opportunities for students.
          </p>
        </div>
      </div>

      <div className="admin-companies-content">
        <section className="admin-companies-form-card">
          <h2>Add New Company</h2>
          <form onSubmit={handleSubmit} className="admin-companies-form">
            <label>
              Company Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </label>

            <label>
              Role
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Enter role title"
              />
            </label>

            <label>
              Package
              <input
                type="text"
                name="package"
                value={formData.package}
                onChange={handleChange}
                placeholder="e.g. 12 LPA"
              />
            </label>

            <label>
              Required Skills
              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="e.g. C++, DSA, React, Node.js"
              />
            </label>

            <label>
              Minimum CGPA
              <input
                type="number"
                name="minCGPA"
                min="0"
                max="10"
                step="0.1"
                value={formData.minCGPA}
                onChange={handleChange}
                placeholder="e.g. 7.5"
              />
            </label>

            <button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Company"}
            </button>
          </form>

          {error && <p className="admin-companies-error">{error}</p>}
          {successMessage && <p className="admin-companies-success">{successMessage}</p>}
        </section>

        <section className="admin-companies-list-card">
          <div className="admin-companies-list-header">
            <h2>Company List</h2>
            <span>{companies.length} companies</span>
          </div>

          {loading ? (
            <p className="admin-companies-status">Loading companies...</p>
          ) : error && companies.length === 0 ? (
            <p className="admin-companies-status">{error}</p>
          ) : companies.length === 0 ? (
            <p className="admin-companies-status">No companies available yet.</p>
          ) : (
            <div className="admin-companies-grid">
              {companies.map((company, index) => (
                <article key={company._id || `${company.name}-${index}`} className="admin-company-card">
                  <h3>{company.name}</h3>
                  <p>
                    <strong>Role:</strong> {company.role}
                  </p>
                  <p>
                    <strong>Package:</strong> {company.package}
                  </p>
                  <p>
                    <strong>Required Skills:</strong>{" "}
                    {Array.isArray(company.requiredSkills)
                      ? company.requiredSkills.join(", ")
                      : company.requiredSkills}
                  </p>
                  <p>
                    <strong>Minimum CGPA:</strong> {company.minCGPA}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminCompanies;
