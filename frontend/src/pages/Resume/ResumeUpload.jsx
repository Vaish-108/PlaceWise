import { useState, useRef } from "react";
import Navbar from "../../components/Navbar/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { uploadResume } from "../../services/resumeService";

function ResumeUpload() {
  const formRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setError("");
    setResult(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a PDF resume to upload.");
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are allowed.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      const token = localStorage.getItem("token");
      const response = await uploadResume(selectedFile, token);
      setResult(response);
      setSelectedFile(null);
      formRef.current?.reset();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Resume upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-content">
        <section className="page-header">
          <div>
            <p className="eyebrow">Resume Intelligence</p>
            <h1>Upload Resume</h1>
            <p className="page-subtitle">
              Upload your PDF resume to extract skills automatically and improve AI matching.
            </p>
          </div>
        </section>

        <section className="panel">
          <form ref={formRef} className="stack-form" onSubmit={handleSubmit}>
            <input
              type="file"
              name="resume"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              required
            />

            {selectedFile && (
              <p className="file-selected">
                Selected file: <strong>{selectedFile.name}</strong>
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading || !selectedFile}
            >
              {uploading ? "Uploading and analyzing..." : "Upload Resume"}
            </button>
          </form>
        </section>

        {uploading && (
          <LoadingSpinner label="Extracting text and skills from your resume..." />
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {result && (
          <section className="panel upload-success-panel">
            <h2>Resume Analyzed Successfully</h2>
            <p>{result.message}</p>

            <div className="upload-result-grid">
              <div>
                <strong>File Name</strong>
                <p>{result.resume?.fileName}</p>
              </div>
              <div>
                <strong>Skills Found</strong>
                <p>{result.extractedSkills?.length || 0}</p>
              </div>
            </div>

            {result.extractedSkills?.length > 0 ? (
              <div className="skill-chip-list">
                {result.extractedSkills.map((skill) => (
                  <span key={skill} className="skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="empty-state compact">
                <p>
                  No technical skills were detected. Try a resume with clearer skill keywords.
                </p>
              </div>
            )}

            <p className="upload-hint">
              These skills are now used by the AI Match Engine and Placement Readiness dashboard.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default ResumeUpload;
