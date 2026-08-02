import { useEffect, useState } from "react";
import { getCompanies } from "../../services/companyService";
import CompanyCard from "../../components/CompanyCard/CompanyCard";
import Navbar from "../../components/Navbar/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load company listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const normalizedQuery = query.toLowerCase().trim();
  const filteredCompanies = companies.filter((company) => {
    if (!normalizedQuery) return true;
    return (company.name || "").toLowerCase().includes(normalizedQuery);
  });

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-content">
        <section className="page-header companies-page-header">
          <div>
            <p className="eyebrow">Placement Directory</p>
            <h1>Companies</h1>
            <p className="page-subtitle">
              Explore placement opportunities available for your college.
            </p>
          </div>
        </section>

        <div className="companies-search-shell">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company..."
            className="companies-search-input"
          />
        </div>

        {loading && <LoadingSpinner label="Loading companies..." />}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && filteredCompanies.length === 0 && (
          <div className="empty-state">
            <h2>No companies match your search</h2>
            <p>Try searching by a different company name.</p>
          </div>
        )}

        {!loading && !error && filteredCompanies.length > 0 && (
          <div className="card-grid company-card-grid">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Companies;
