from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from models.roberta_sentiment_analysis import analyze_sentiment
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define the reviews file
reviews_file = "reviews.csv"

# Initialize VADER analyzer
vader_analyzer = SentimentIntensityAnalyzer()

def update_reviews_csv(review_data):
    """Append new review data directly to the reviews.csv file."""
    df = pd.DataFrame([review_data])
    if not os.path.exists(reviews_file):
        df.to_csv(reviews_file, index=False)
    else:
        df.to_csv(reviews_file, mode='a', header=False, index=False)

@app.route('/analyze', methods=['POST'])
def analyze_review():
    """Analyze review sentiment and update the reviews.csv file."""
    data = request.json
    pitcher_id = data.get("PitcherId")
    investor_id = data.get("InvestorId")
    review_text = data.get("ReviewText")
    
    if not (pitcher_id and investor_id and review_text):
        return jsonify({"error": "Missing fields"}), 400

    # Perform sentiment analysis using RoBERTa and VADER
    roberta_score = analyze_sentiment(review_text)
    vader_score = vader_analyzer.polarity_scores(review_text)['compound']
    
    # Final sentiment score (average of both models)
    sentiment_score = round((roberta_score + vader_score) / 2, 3)
    
    # Convert sentiment score to a scale of 0-5
    score = round(sentiment_score * 5, 2)

    # Create the review data to append
    review_data = {
        "Id": len(pd.read_csv(reviews_file)) + 1 if os.path.exists(reviews_file) else 1,
        "InvestorId": investor_id,
        "PitcherId": pitcher_id,
        "ProfileName": "Anonymous",  # Placeholder for now
        "HelpfulnessNumerator": len(review_text.split()),
        "HelpfulnessDenominator": len(review_text.split()) + 5,  # Arbitrary denominator
        "Score": score,
        "Time": int(pd.Timestamp.now().timestamp()),
        "Summary": review_text[:50],  # First 50 characters as summary
        "Text": review_text,
    }

    # Append the review to the reviews.csv file
    update_reviews_csv(review_data)

    return jsonify(review_data), 200

@app.route('/investor-rating/<investor_id>', methods=['GET'])
def investor_rating(investor_id):
    """Fetch average star rating for a specific investor."""
    if not os.path.exists(reviews_file):
        return jsonify({"error": "No reviews found"}), 404
    
    reviews = pd.read_csv(reviews_file)
    investor_reviews = reviews[reviews['InvestorId'] == investor_id]
    
    if investor_reviews.empty:
        return jsonify({"error": "No reviews for this investor"}), 404
    
    avg_score = investor_reviews['Score'].mean()
    stars = round(avg_score, 2)  # Return the average score as the rating

    return jsonify({"InvestorId": investor_id, "Rating": stars}), 200

if __name__ == "__main__":
    app.run(debug=True)
