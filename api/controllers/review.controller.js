import User from '../models/user.model.js';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export const addReview = async (req, res) => {
  const { investorId, pitcherId, reviewText } = req.body;

  try {
    const investor = await User.findById(investorId);
    if (!investor) return res.status(404).json({ message: "Investor not found" });

    const sentimentResult = sentiment.analyze(reviewText);
    const sentimentScore = sentimentResult.score;

    investor.reviews.push({ pitcherId, reviewText, sentimentScore });

    // Recalculate average rating
    const totalSentimentScore = investor.reviews.reduce((sum, review) => sum + review.sentimentScore, 0);
    investor.averageRating = totalSentimentScore / investor.reviews.length;

    await investor.save();
    res.status(200).json({ message: "Review added successfully", investor });
  } catch (err) {
    res.status(500).json({ message: "Error adding review", error: err.message });
  }
};
