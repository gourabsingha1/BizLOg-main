import React, { useEffect, useState } from 'react';

const InvestorsList = () => {
  const [investors, setInvestors] = useState([]);

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
        setInvestors(data); // Populate investors
      } catch (error) {
        console.error("Error fetching investors:", error);
      }
    };
    fetchInvestors();
  }, []);

  return (
    <div>
      <h1>Top Investors</h1>
      {investors.length > 0 ? (
        <ul>
          {investors.map((investor) => (
            <li key={investor._id}>
              <img src={investor.profilePicture} alt={investor.username} width="50" />
              <p>{investor.username}</p>
              <p>Average Rating: {investor.averageRating.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No investors found.</p>
      )}
    </div>
  );
};

export default InvestorsList;
