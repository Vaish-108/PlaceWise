import { useEffect, useState } from "react";
import { getJobs } from "../../services/jobService";
import { getJobMatch } from "../../services/matchingService";
import JobCard from "../../components/JobCard/JobCard";
import Navbar from "../../components/Navbar/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [matchMap, setMatchMap] = useState({});
  const [matchLoadingMap, setMatchLoadingMap] = useState({});
  const [matchErrorMap, setMatchErrorMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobsAndMatches = async () => {
      try {
        const data = await getJobs();
        setJobs(data);

        const initialLoading = {};
        data.forEach((job) => {
          initialLoading[job._id] = true;
        });
        setMatchLoadingMap(initialLoading);

        await Promise.all(
          data.map(async (job) => {
            try {
              const matchData = await getJobMatch(job._id);
              setMatchMap((prev) => ({
                ...prev,
                [job._id]: matchData,
              }));
              setMatchErrorMap((prev) => ({
                ...prev,
                [job._id]: "",
              }));
            } catch (err) {
              setMatchErrorMap((prev) => ({
                ...prev,
                [job._id]:
                  err.response?.data?.message ||
                  "Unable to load match data.",
              }));
            } finally {
              setMatchLoadingMap((prev) => ({
                ...prev,
                [job._id]: false,
              }));
            }
          })
        );
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load jobs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndMatches();
  }, []);

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-content">
        <section className="page-header">
          <div>
            <p className="eyebrow">Opportunities</p>
            <h1>Available Jobs</h1>
            <p className="page-subtitle">
              Browse job openings with personalized match scores based on your profile and resume.
            </p>
          </div>
        </section>

        {loading && <LoadingSpinner label="Loading jobs..." />}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && jobs.length === 0 && (
          <div className="empty-state">
            <h2>No jobs available</h2>
            <p>Job listings will appear here once they are published.</p>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="card-grid">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                matchData={matchMap[job._id]}
                matchLoading={matchLoadingMap[job._id]}
                matchError={matchErrorMap[job._id]}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Jobs;
