import React, { useEffect, useState } from "react";
import "../topInvestors.css";

const InvestorsList = () => {
  const [investors, setInvestors] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // View mode state

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await fetch("/api/user/topinvestors", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch investors");
        }
        const data = await response.json();
        setInvestors(data);
      } catch (error) {
        console.error("Error fetching investors:", error);
      }
    };
    fetchInvestors();
  }, []);

  return (
    <div className="investors-container">
      <div className="header">
        <h1 className="title">Top Investors</h1>
        <div className="view-options">
          <button
            className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            Grid
          </button>
          <button
            className={`view-btn ${viewMode === "compact" ? "active" : ""}`}
            onClick={() => setViewMode("compact")}
          >
            List
          </button>
        </div>
      </div>
      {investors.length > 0 ? (
        <div className={`investors-list ${viewMode}`}>
          {investors.map((investor) => (
            <div key={investor._id} className="investor-card">
              <img
                className="profile-picture"
                src={investor.profilePicture || "/default-avatar.png"}
                alt={investor.username}
              />
              <div className="investor-info">
                <h2 className="investor-username">{investor.username}</h2>
                <p className="investor-rating">
                  <span className="single-star">★</span>{Math.round(investor.averageRating)}{" "}
                  ({investor.reviews.length})
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-investors-message">No investors found.</p>
      )}
    </div>
  );
};

export default InvestorsList;
