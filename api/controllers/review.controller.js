const FLASK_API_URL = "http://127.0.0.1:5000/api";

export const addReview = async (req, res) => {
  const { investorId, pitcherId, reviewText } = req.body;

  try {
    const response = await post(`${FLASK_API_URL}/add-review`, {
      investorId,
      pitcherId,
      reviewText,
    });

    if (response.status === 200) {
      return res.status(200).json({
        message: "Review added successfully",
        sentimentScore: response.data.sentimentScore,
      });
    } else {
      return res.status(response.status).json({
        message: "Failed to add review",
        error: response.data,
      });
    }
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRatings = async (req, res) => {
  const { investorId } = req.params;

  try {
    const response = await get(`${FLASK_API_URL}/get-ratings/${investorId}`);

    if (response.status === 200) {
      return res.status(200).json({
        averageRating: response.data.averageRating,
        reviews: response.data.reviews,
      });
    } else {
      return res.status(response.status).json({
        message: "Failed to fetch ratings",
        error: response.data,
      });
    }
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const trainModel = async (req, res) => {
  try {
    const response = await post(`${FLASK_API_URL}/train-model`);

    if (response.status === 200) {
      return res.status(200).json({ message: response.data.message });
    } else {
      return res.status(response.status).json({
        message: "Failed to train the model",
        error: response.data,
      });
    }
  } catch (error) {
    console.error("Error training the model:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
