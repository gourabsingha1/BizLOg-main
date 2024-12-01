import User from "../models/user.model.js";

const FLASK_API_BASE_URL = "http://localhost:5000"; // Update if Flask runs on a different host/port

export const addReview = async (req, res) => {
  const { investorId, pitcherId, reviewText } = req.body;

  try {
    // Check if the investor exists
    const investor = await User.findById(investorId);
    if (!investor) return res.status(404).json({ message: "Investor not found" });

    // Send review to Flask for sentiment analysis
    const flaskResponse = await post(`${FLASK_API_BASE_URL}/analyze`, {
      InvestorId: investorId,
      PitcherId: pitcherId,
      ReviewText: reviewText,
    });

    const { SentimentScore } = flaskResponse.Score;

    // Add the review to the investor's database
    investor.reviews.push({
      pitcherId,
      reviewText,
      sentimentScore: 140,
    });

    // Recalculate the average rating using Flask
    const ratingResponse = await get(`${FLASK_API_BASE_URL}/investor-rating/${investorId}`);
    const { Rating } = ratingResponse.Rating;

    // Update the investor's average rating
    investor.averageRating = Rating;

    await investor.save();
    res.status(200).json({ message: "Review added successfully", investor });
  } catch (err) {
    res.status(500).json({ message: "Error adding review", error: err.message });
  }
};

export const getInvestorRating = async (req, res) => {
  const { investorId } = req.params;

  try {
    const investor = await User.findById(investorId);
    if (!investor) return res.status(404).json({ message: "Investor not found" });

    // Fetch the average rating from Flask
    const ratingResponse = await get(`${FLASK_API_BASE_URL}/investor-rating/${investorId}`);
    const { Rating } = ratingResponse.data;

    res.status(200).json({ investorId, rating: Rating });
  } catch (err) {
    res.status(500).json({ message: "Error fetching investor rating", error: err.message });
  }
};
