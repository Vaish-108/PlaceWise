import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../../apiConfig";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import "./AdminProfile.css";

function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    designation: "",
  });
  const [photoFile, setPhotoFile] = useState(null);

  const token = localStorage.getItem("adminToken");

  const initials = useMemo(() => {
    const name = admin?.name || "Admin";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "A";
  }, [admin]);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (!token) {
        setError("Please log in as an admin.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/admin/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profileData = response.data;
        setAdmin(profileData);
        setFormData({
          name: profileData.name || "",
          phone: profileData.phone || "",
          designation: profileData.designation || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Please log in as an admin.");
      return;
    }

    try {
      setSaving(true);
      const response = await axios.put(
        `${API_URL}/api/admin/profile`,
        {
          name: formData.name,
          phone: formData.phone,
          designation: formData.designation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAdmin(response.data.admin);
      setSuccess(response.data.message || "Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setError("");
      setSuccess("");
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile || !token) {
      setError("Please choose a photo to upload.");
      return;
    }

    try {
      setUploadingPhoto(true);
      const formData = new FormData();
      formData.append("photo", photoFile);

      const response = await axios.post(
        `${API_URL}/api/admin/profile/photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAdmin(response.data.admin);
      setSuccess(response.data.message || "Photo updated successfully.");
      setPhotoFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload profile photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="admin-dashboard-page">
      <AdminNavbar />

      <main className="admin-dashboard-content">
        <section className="admin-dashboard__hero">
          <div className="admin-dashboard__hero-text">
            <p className="eyebrow">Admin Profile</p>
            <h1>Manage your account details</h1>
            <p className="page-subtitle">Update your contact information and profile photo securely.</p>
          </div>
        </section>

        {loading && <div className="admin-dashboard__state">Loading profile...</div>}
        {error && <div className="admin-dashboard__state admin-dashboard__state--error">{error}</div>}
        {success && <div className="admin-dashboard__state admin-dashboard__state--success">{success}</div>}

        {!loading && admin && (
          <div className="admin-profile-layout">
            <section className="admin-profile-card admin-profile-card--wide">
              <div className="admin-profile-card__avatar">
                {admin.profilePhoto ? (
                  <img src={admin.profilePhoto} alt={admin.name} />
                ) : (
                  initials
                )}
              </div>

              <div className="admin-profile-card__details">
                <h2>{admin.name}</h2>
                <p>{admin.designation || "Placement Administrator"}</p>
                <p>{admin.college || "College not updated"}</p>
                <p>{admin.email}</p>
                <p>{admin.phone || "Phone not updated"}</p>
              </div>
            </section>

            <section className="admin-profile-panel">
              <h3>Profile Photo</h3>
              <div className="admin-profile-photo-actions">
                <input type="file" accept="image/*" onChange={handlePhotoChange} />
                <button type="button" className="btn btn-primary" onClick={handlePhotoUpload} disabled={uploadingPhoto || !photoFile}>
                  {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                </button>
              </div>
            </section>

            <section className="admin-profile-panel">
              <h3>Profile Details</h3>
              <form className="admin-profile-form" onSubmit={handleSubmit}>
                <label>
                  <span>Name</span>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </label>

                <label>
                  <span>Phone</span>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </label>

                <label>
                  <span>Designation</span>
                  <input type="text" name="designation" value={formData.designation} onChange={handleChange} />
                </label>

                <label>
                  <span>Email</span>
                  <input type="text" value={admin.email} readOnly />
                </label>

                <label>
                  <span>College</span>
                  <input type="text" value={admin.college || ""} readOnly />
                </label>

                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminProfile;
