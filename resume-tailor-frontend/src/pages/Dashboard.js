import { useState } from "react";
import { processResume, exportPDF } from "../api/resume";
import { FaFilePdf, FaMagic, FaDownload } from "react-icons/fa";
import "../App.css";

export default function Dashboard() {
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await processResume(resume, jobDesc);
      setResult(data);
    } catch (err) {
      alert("Processing failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const { data } = await exportPDF(result.id);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tailored_resume.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Export failed!");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card" style={{ background: "linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%)", color: "#222" }}>
        <h2 className="dashboard-title" style={{ color: "#222", background: "none", WebkitBackgroundClip: "initial", WebkitTextFillColor: "initial" }}>
          <FaMagic style={{ marginRight: 8, verticalAlign: "middle", color: "#2575fc" }} />
          Upload Resume + Job Description
        </h2>
        <form className="dashboard-form" onSubmit={handleSubmit}>
          <label className="dashboard-label" style={{ color: "#222", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <FaFilePdf style={{ marginRight: 6, color: "#2575fc" }} /> Resume PDF
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResume(e.target.files[0])}
              style={{ flex: 1, minWidth: "160px", padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc", background: "#f5f7fa" }}
            />
          </label>
          <label className="dashboard-label" style={{ color: "#222" }}>
            Job Description
            <textarea
              className="dashboard-textarea"
              placeholder="Paste job description here"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </label>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
            <button className="dashboard-btn" type="submit" style={{ color: "#fff" }}>
              <FaMagic style={{ marginRight: 6, color: "#fff" }} /> Generate
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "2rem 0" }}>
          <div className="spinner" style={{ width: 48, height: 48, border: "6px solid #eee", borderTop: "6px solid #2575fc", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
          <span style={{ marginTop: "1rem", color: "#2575fc", fontWeight: 500, fontSize: "1.1rem" }}>Generating...</span>
        </div>
      )}

      {result && !loading && (
        <div className="dashboard-card fade-in" style={{ background: "#fff", color: "#222" }}>
          <h3 className="dashboard-title" style={{ color: "#222", background: "none", WebkitBackgroundClip: "initial", WebkitTextFillColor: "initial" }}>Tailored Resume Suggestions</h3>
          <pre className="dashboard-pre" style={{ color: "#222" }}>{JSON.stringify(result.tailored_text, null, 2)}</pre>

          <h3 className="dashboard-title" style={{ color: "#222", background: "none", WebkitBackgroundClip: "initial", WebkitTextFillColor: "initial" }}>Cover Letter</h3>
          <pre className="dashboard-pre" style={{ color: "#222" }}>{JSON.stringify(result.cover_letter, null, 2)}</pre>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
            <button className="dashboard-btn" onClick={handleExport} style={{ color: "#fff" }}>
              <FaDownload style={{ marginRight: 6, color: "#fff" }} /> Export PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

