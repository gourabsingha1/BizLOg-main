from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import pandas as pd
from transformers import pipeline
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
import os
import time

nltk.download("vader_lexicon")

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb+srv://soumyadeep:soum%402106@mern-estate.hu6awzx.mongodb.net/")
db = client["mern-blog"]
users_collection = db["users"]

roberta_model = pipeline("sentiment-analysis")
vader_analyzer = SentimentIntensityAnalyzer()

CSV_FILE = "reviews.csv"
if not os.path.exists(CSV_FILE):
    pd.DataFrame(columns=[
        "Id", "InvestorId", "PitcherId", "ProfileName",
        "HelpfulnessNumerator", "HelpfulnessDenominator",
        "Score", "Time", "Summary", "Text"
    ]).to_csv(CSV_FILE, index=False)

def analyze_sentiment(review_text):
    """Analyzes sentiment using both RoBERTa and Vader."""
    roberta_result = roberta_model(review_text)[0]
    vader_result = vader_analyzer.polarity_scores(review_text)

    sentiment_score = (roberta_result["score"] + vader_result["compound"]) / 2
    return sentiment_score


def calculate_star_rating(sentiment_score, investor_id):
    """Convert sentiment score (0-1) to star rating (1-5)."""
    investor = users_collection.find_one({"_id": investor_id})
    if not investor:
        return jsonify({"error": "Investor not found"}), 404
    existing_reviews = investor.get("reviews", [])
    existing_scores = [review["sentimentScore"] for review in existing_reviews]
    updated_scores = existing_scores + [sentiment_score]
    average_sentiment_score = sum(updated_scores) / len(updated_scores)
    return max(1, round(average_sentiment_score * 5))

@app.route("/")
def home():
    return {"message": "Flask backend is running!"}

@app.route("/api/add-review", methods=["POST"])
def add_review():
    data = request.json
    investor_id = data["investorId"]
    pitcher_id = data["pitcherId"]
    review_text = data["reviewText"]

    try:
        investor_id = ObjectId(investor_id)
        pitcher_id = ObjectId(pitcher_id)
    except:
        return jsonify({"error": "Invalid IDs"}), 400

    sentiment_score = analyze_sentiment(review_text)

    # Calculate helpfulness (dummy values for now)
    helpfulness_numerator = len(review_text.split())
    helpfulness_denominator = helpfulness_numerator + 5
    score = calculate_star_rating(sentiment_score, investor_id)
    summary = review_text[:50]

    # Save review to MongoDB
    review = {
        "pitcherId": str(pitcher_id),
        "reviewText": review_text,
        "sentimentScore": sentiment_score,
    }

    result = users_collection.update_one(
        {"_id": investor_id},
        {
            "$push": {"reviews": review},
            "$set": {
                "averageRating": calculate_star_rating(sentiment_score, investor_id)
            },
        },
    )
    if result.matched_count == 0:
        return jsonify({"error": "Investor not found"}), 404

    new_entry = pd.DataFrame([{
        "Id": len(pd.read_csv(CSV_FILE)) + 1,
        "InvestorId": str(investor_id),
        "PitcherId": str(pitcher_id),
        "ProfileName": "Pitcher Profile",
        "HelpfulnessNumerator": helpfulness_numerator,
        "HelpfulnessDenominator": helpfulness_denominator,
        "Score": score,
        "Time": int(time.time()),
        "Summary": summary,
        "Text": review_text,
    }])
    new_entry.to_csv(CSV_FILE, mode="a", header=False, index=False)

    return jsonify({"message": "Review added successfully", "sentimentScore": sentiment_score})

@app.route("/api/get-ratings/<investor_id>", methods=["GET"])
def get_ratings(investor_id):
    try:
        investor_id = ObjectId(investor_id)
    except:
        return jsonify({"error": "Invalid ID"}), 400

    investor = users_collection.find_one({"_id": investor_id})
    if not investor:
        return jsonify({"error": "Investor not found"}), 404

    return jsonify({
        "averageRating": investor.get("averageRating", 0),
        "reviews": investor.get("reviews", [])
    })

@app.route("/api/train-model", methods=["POST"])
def train_model():
    reviews_df = pd.read_csv(CSV_FILE)
    # Here, you can integrate further training for your sentiment models.
    # (For simplicity, this demo assumes models are pre-trained.)
    return jsonify({"message": "Training initiated on new reviews!"})

if __name__ == "__main__":
    app.run(debug=True)
