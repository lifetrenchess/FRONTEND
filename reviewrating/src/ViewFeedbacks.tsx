import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewFeedbacks = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8083/api/reviews")
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error("Error fetching feedbacks:", err));
  }, []);

  return (
    <div className="container mt-5">
      <button className="btn btn-outline-primary mb-3" onClick={() => navigate("/")}>
        ← Back
      </button>
      <h4>All Feedbacks</h4>
      {feedbacks.length === 0 ? (
        <p>No feedbacks yet.</p>
      ) : (
        feedbacks.map((fb: any, idx: number) => (
          <div key={idx} className="border rounded p-3 mb-3">
            <div className="text-warning">
              {"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}
            </div>
            <div>{fb.comment}</div>
            {fb.agentResponse && (
              <div className="mt-2 text-muted">
                <strong>Agent Response:</strong> {fb.agentResponse}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ViewFeedbacks;
