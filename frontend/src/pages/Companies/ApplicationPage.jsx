import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCompanies } from "../../services/companyService";
import Navbar from "../../components/Navbar/Navbar";

function ApplicationPage() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompanies();
        const matchedCompany = (Array.isArray(data) ? data : []).find(
          (item) => String(item._id) === String(companyId)
        );
        setCompany(matchedCompany || null);
      } catch (error) {
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-content">
        <section className="page-header companies-page-header">
          <div>
            <p className="eyebrow">Application Status</p>
            <h1>Application Portal</h1>
            <p className="page-subtitle">
              Temporary application page for companies awaiting the official link.
            </p>
          </div>
        </section>

        {loading ? (
          <div className="empty-state">
            <h2>Loading company details...</h2>
          </div>
        ) : (
          <div className="application-page-card">
            <h2>{company?.name || "Company"}</h2>
            <p className="application-page-role">{company?.role || "Role Not Specified"}</p>
            <p className="application-page-message">
              The application portal for this company is not yet available.
              <br />
              Once the Training & Placement Office publishes the official application link, you will be able to apply from here.
            </p>
            <Link to="/companies" className="btn btn-primary">
              Back to Companies
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default ApplicationPage;
