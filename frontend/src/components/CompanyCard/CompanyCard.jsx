import { useNavigate } from "react-router-dom";

function CompanyCard({ company }) {
  const navigate = useNavigate();
  const deadlineDate = company.deadline ? new Date(company.deadline) : null;
  const isValidDeadline = Boolean(deadlineDate && !Number.isNaN(deadlineDate.getTime()));
  const today = new Date();
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const normalizedDeadline = isValidDeadline
    ? new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate())
    : null;
  const isExpired = normalizedDeadline ? normalizedToday > normalizedDeadline : false;
  const hasValidApplicationLink = Boolean(
    company.applicationLink &&
      typeof company.applicationLink === "string" &&
      company.applicationLink.trim() &&
      /^(https?:\/\/)/i.test(company.applicationLink.trim())
  );

  const locationText = company.location || "Not Specified";
  const batchText = company.batch || company.eligibleBatch || company.batchEligible || "Not Specified";
  const packageText = company.package || "Not Specified";
  const roleText = company.role || "Role Not Specified";
  const cgpaText =
    company.minCGPA !== undefined && company.minCGPA !== null && company.minCGPA !== "" && company.minCGPA !== 0
      ? company.minCGPA
      : "Not Specified";
  const backlogText = company.backlogRequirement || company.backlog || "Not Specified";
  const deadlineText = isValidDeadline
    ? deadlineDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not Specified";
  const skills = Array.isArray(company.requiredSkills)
    ? company.requiredSkills.filter(Boolean)
    : [];
  const logoLabel = (company.name || "C")
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleApply = () => {
    if (isExpired) return;
    if (company._id) {
      navigate(`/apply/${company._id}`);
      return;
    }
    if (hasValidApplicationLink) {
      window.open(company.applicationLink.trim(), "_blank", "noopener,noreferrer");
    }
  };

  return (
    <article className={`info-card hover-card company-card ${isExpired ? "company-card--expired" : ""}`}>
      <div className="company-card__top">
        <div className="company-card__logo">{logoLabel}</div>
        <div className="company-card__header">
          <h2>{company.name || "Company Name"}</h2>
          <p className="company-card__role">{roleText}</p>
        </div>
        <span className={`company-card__status ${isExpired ? "company-card__status--expired" : "company-card__status--open"}`}>
          {isExpired ? "Expired" : "Open"}
        </span>
      </div>

      <div className="company-card__body">
        <div className="company-card__meta-grid">
          <div className="company-card__meta">
            <span className="company-card__label">Location</span>
            <strong>{locationText}</strong>
          </div>
          <div className="company-card__meta">
            <span className="company-card__label">Eligible Batch</span>
            <strong>{batchText}</strong>
          </div>
          <div className="company-card__meta">
            <span className="company-card__label">Package</span>
            <strong>{packageText}</strong>
          </div>
          <div className="company-card__meta">
            <span className="company-card__label">Deadline</span>
            <strong className={isExpired ? "company-card__deadline--expired" : ""}>{deadlineText}</strong>
          </div>
        </div>

        <div className="company-card__section">
          <div className="company-card__section-title">Eligibility</div>
          <div className="company-card__eligibility">
            <div className="company-card__eligibility-row">
              <span>CGPA</span>
              <strong>{cgpaText}</strong>
            </div>
            <div className="company-card__eligibility-row">
              <span>Backlogs</span>
              <strong>{backlogText}</strong>
            </div>
          </div>
        </div>

        <div className="company-card__section">
          <div className="company-card__section-title">Required Skills</div>
          {skills.length > 0 ? (
            <div className="company-card__chip-list">
              {skills.map((skill) => (
                <span key={skill} className="company-card__chip">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="company-card__muted">Not Specified</p>
          )}
        </div>
      </div>

      <div className="company-card__actions">
        <button
          type="button"
          className={`btn ${isExpired ? "btn-secondary" : "btn-primary"}`}
          onClick={handleApply}
          disabled={isExpired}
        >
          {isExpired ? "Applications Closed" : "Apply"}
        </button>
      </div>
    </article>
  );
}

export default CompanyCard;
