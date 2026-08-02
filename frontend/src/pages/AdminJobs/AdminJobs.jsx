import { useEffect, useState } from "react";
import axios from "axios";
import "../AdminCompanies/AdminCompanies.css";

function AdminJobs() {
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    company: "",
    title: "",
    description: "",
    package: "",
    applicationLink: "",
    requiredSkills: "",
    minCGPA: "",
  });

  const adminToken = localStorage.getItem("adminToken");

  const fetchData = async () => {
    if (!adminToken) {
      setError("Please log in as an admin.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const [companiesResponse, jobsResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/companies", {
          headers: { Authorization: `Bearer ${adminToken}` },
        }),
        axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${adminToken}` },
        }),
      ]);

      setCompanies(companiesResponse.data?.companies || companiesResponse.data || []);
      setJobs(jobsResponse.data || []);
    } catch (err) {
      setError("Unable to load job data right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.company) return "Please select a company.";
    if (!formData.title.trim()) return "Job title is required.";
    if (!formData.description.trim()) return "Description is required.";
    if (!formData.package.trim()) return "Package is required.";
    if (!formData.applicationLink.trim()) return "Application link is required.";
    if (!formData.requiredSkills.trim()) return "At least one required skill is required.";

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

    try {
      setSubmitting(true);
      setError("");
      await axios.post(
        "http://localhost:5000/api/jobs",
        {
          company: formData.company,
          title: formData.title.trim(),
          description: formData.description.trim(),
          package: formData.package.trim(),
          applicationLink: formData.applicationLink.trim(),
          requiredSkills: formData.requiredSkills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          minCGPA: Number(formData.minCGPA),
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMessage("Job added successfully.");
      setFormData({
        company: "",
        title: "",
        description: "",
        package: "",
        applicationLink: "",
        requiredSkills: "",
        minCGPA: "",
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-companies-page">
      <div className="admin-companies-header">
        <div>
          <p className="admin-companies-eyebrow">Admin Panel</p>
          <h1>Job Management</h1>
          <p className="admin-companies-subtitle">Create jobs for companies from your college and review existing postings.</p>
        </div>
      </div>

      <div className="admin-companies-content">
        <section className="admin-companies-form-card">
          <h2>Add New Job</h2>
          <form onSubmit={handleSubmit} className="admin-companies-form">
            <label>
              Company
              <select name="company" value={formData.company} onChange={handleChange}>
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Job Title
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter job title" />
            </label>

            <label>
              Description
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Enter job description" rows="4" />
            </label>

            <label>
              Package
              <input type="text" name="package" value={formData.package} onChange={handleChange} placeholder="e.g. 12 LPA" />
            </label>

            <label>
              Application Link
              <input type="url" name="applicationLink" value={formData.applicationLink} onChange={handleChange} placeholder="https://example.com/apply" />
            </label>

            <label>
              Required Skills
              <input type="text" name="requiredSkills" value={formData.requiredSkills} onChange={handleChange} placeholder="e.g. React, Node.js, DSA" />
            </label>

            <label>
              Minimum CGPA
              <input type="number" name="minCGPA" min="0" max="10" step="0.1" value={formData.minCGPA} onChange={handleChange} placeholder="e.g. 7.5" />
            </label>

            <button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create Job"}</button>
          </form>

          {error && <p className="admin-companies-error">{error}</p>}
          {successMessage && <p className="admin-companies-success">{successMessage}</p>}
        </section>

        <section className="admin-companies-list-card">
          <div className="admin-companies-list-header">
            <h2>Existing Jobs</h2>
            <span>{jobs.length} jobs</span>
          </div>

          {loading ? (
            <p className="admin-companies-status">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="admin-companies-status">No jobs available yet for your college.</p>
          ) : (
            <div className="admin-companies-grid">
              {jobs.map((job) => (
                <article key={job._id} className="admin-company-card">
                  <h3>{job.title}</h3>
                  <p><strong>Company:</strong> {job.company?.name || "Unknown"}</p>
                  <p><strong>Package:</strong> {job.package}</p>
                  <p><strong>Skills:</strong> {Array.isArray(job.requiredSkills) ? job.requiredSkills.join(", ") : job.requiredSkills}</p>
                  <p><strong>CGPA:</strong> {job.minCGPA}</p>
                  <p><strong>Link:</strong> <a href={job.applicationLink} target="_blank" rel="noreferrer">Open</a></p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminJobs;
