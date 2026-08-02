function JobCard({ job, matchData, matchLoading, matchError }) {
  return (
    <article className="info-card hover-card">
      <div className="info-card__header">
        <h2>{job.title}</h2>
        <span className="tag">{job.company?.name || "Company"}</span>
      </div>

      <div className="info-card__body">
        <p>
          <strong>Package:</strong> {job.package}
        </p>
        <p>
          <strong>Minimum CGPA:</strong> {job.minCGPA}
        </p>
        <p>
          <strong>Description:</strong> {job.description}
        </p>
        <p>
          <strong>Skills:</strong>{" "}
          {job.requiredSkills?.length
            ? job.requiredSkills.join(", ")
            : "Not specified"}
        </p>
      </div>

      <section className="match-panel">
        <h3>Your Match</h3>

        {matchLoading && <p className="match-status">Calculating match score...</p>}

        {!matchLoading && matchError && (
          <p className="match-status match-status--error">{matchError}</p>
        )}

        {!matchLoading && !matchError && matchData && (
          <>
            <div className="match-metrics">
              <div className="match-metric">
                <span>Match Score</span>
                <strong>{matchData.matchScore}%</strong>
              </div>
              <div className="match-metric">
                <span>Eligibility</span>
                <strong
                  className={
                    matchData.eligible
                      ? "match-eligible"
                      : "match-not-eligible"
                  }
                >
                  {matchData.eligible ? "Eligible" : "Not Eligible"}
                </strong>
              </div>
            </div>

            <p>
              <strong>Matched Skills:</strong>{" "}
              {matchData.matchedSkills?.length
                ? matchData.matchedSkills.join(", ")
                : "None"}
            </p>
            <p>
              <strong>Missing Skills:</strong>{" "}
              {matchData.missingSkills?.length
                ? matchData.missingSkills.join(", ")
                : "None"}
            </p>
            <p className="match-recommendation">
              <strong>Recommendation:</strong> {matchData.recommendation}
            </p>
          </>
        )}
      </section>

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => window.open(job.applicationLink, "_blank")}
      >
        Apply
      </button>
    </article>
  );
}

export default JobCard;
