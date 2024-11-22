import React, { useState, useEffect } from "react";

const AddReview = () => {
  const [investors, setInvestors] = useState([]); // Initialize as empty array
  const [selectedInvestor, setSelectedInvestor] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);

  // Simulate getting the pitcherId (e.g., from local storage)
//   const pitcherId = localStorage.getItem("username");
  const pitcherId = '673c9c8794f16cf4b9304ce0';

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await fetch("/api/user/investors", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch investors");
        }
        const data = await response.json();
        setInvestors(data); // Populate investors
      } catch (error) {
        console.error("Error fetching investors:", error);
      } finally {
        setLoading(false); // Mark as not loading
      }
    };
    fetchInvestors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pitcherId) {
      alert("Pitcher not logged in. Please log in to add a review.");
      return;
    }

    try {
      const response = await fetch("/api/reviews/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          investorId: selectedInvestor,
          pitcherId,
          reviewText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add review");
      }

      const data = await response.json();
      alert("Review added successfully!");
      setReviewText(""); // Clear the input field
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Error adding review");
    }
  };

  if (loading) {
    return <div>Loading investors...</div>;
  }

  return (
    <div className="add-review">
      <h2>Add Review</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Select Investor:
          <select
            value={selectedInvestor}
            onChange={(e) => setSelectedInvestor(e.target.value)}
          >
            <option value="">--Choose an investor--</option>
            {investors.map((investor) => (
              <option key={investor._id} value={investor._id}>
                {investor.username}
              </option>
            ))}
          </select>
        </label>
        <label>
          Review:
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddReview;