import { useEffect, useState } from "react";
import { fetchHistory } from "../api/resume";
import { FaHistory } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../App.css";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory().then(({ data }) => setHistory(data.items || []));
  }, []);

  return (
    <div className="dashboard">
  <div className="dashboard-card" style={{ background: "linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%)", color: "#222" }}>
        <h2 className="dashboard-title">
      <FaHistory style={{ marginRight: 8, verticalAlign: "middle", color: "#2575fc" }} /> History
        </h2>
        {Array.isArray(history) && history.length === 0 ? (
      <p className="dashboard-desc" style={{ color: "#222" }}>No history found.</p>
        ) : (
          <div style={{ marginTop: "1rem" }}>
            {(history || []).map((item) => (
              <div key={item.id} className="dashboard-card fade-in" style={{ marginBottom: "1rem" }}>
                <p className="dashboard-desc" style={{ color: "#222" }}><b>Job Description:</b> {item.job_description}</p>
                <details style={{ marginTop: "0.5rem" }}>
                  <summary style={{ cursor: "pointer", color: "#2575fc" }}><b>Tailored Resume</b></summary>
                  <div className="dashboard-pre" style={{ color: "#222" }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {typeof item.tailored_text === "string" ? item.tailored_text : JSON.stringify(item.tailored_text, null, 2)}
                    </ReactMarkdown>
                  </div>
                </details>
                <details style={{ marginTop: "0.5rem" }}>
                  <summary style={{ cursor: "pointer", color: "#2575fc" }}><b>Cover Letter</b></summary>
                  <div className="dashboard-pre" style={{ color: "#222" }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {typeof item.cover_letter === "string" ? item.cover_letter : JSON.stringify(item.cover_letter, null, 2)}
                    </ReactMarkdown>
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
  </div>
    </div>
  );
}

