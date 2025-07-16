import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const submitFeedback = async () => {
    if (rating === 0 || comment.trim() === "") {
      alert("Please give a rating and feedback");
      return;
    }

    const feedback = {
      userID: 1, // Replace with actual user ID
      packageID: 101, // Replace with actual package ID
      rating,
      comment,
    };

    try {
      await axios.post("http://localhost:8083/api/reviews", feedback);
      alert("Feedback submitted!");
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Rate Us</h3>
      <div className="mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`fs-3 me-2 ${star <= rating ? "text-warning" : "text-secondary"}`}
            onClick={() => setRating(star)}
            style={{ cursor: "pointer" }}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        className="form-control mb-3"
        rows={2}
        placeholder="Write your feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button className="btn btn-primary me-2" onClick={submitFeedback}>
        Submit
      </button>
      <button className="btn btn-outline-secondary" onClick={() => navigate("/reviews")}>
        View Feedbacks
      </button>
    </div>
  );
};

export default Home;
