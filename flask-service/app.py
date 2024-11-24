from flask import Flask, request, jsonify
import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk import download
from scipy.special import softmax
import numpy as np

# Download necessary NLTK resources
download('vader_lexicon')

# Initialize Flask app
app = Flask(__name__)

# Load pre-trained RoBERTa model and tokenizer
MODEL = "cardiffnlp/twitter-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL)

# Initialize NLTK Sentiment Analyzer
sia = SentimentIntensityAnalyzer()

# Define a function for RoBERTa sentiment analysis
def polarity_scores_roberta(text):
    encoded_text = tokenizer(text, return_tensors='pt')
    output = model(**encoded_text)
    scores = output[0][0].detach().numpy()
    scores = softmax(scores)
    return {
        'roberta_neg': scores[0],
        'roberta_neu': scores[1],
        'roberta_pos': scores[2],
    }

@app.route('/analyze', methods=['POST'])
def analyze_reviews():
    reviews = request.json.get('reviews', [])
    results = []

    for review in reviews:
        text = review.get('Text', '')
        vader_scores = sia.polarity_scores(text)
        roberta_scores = polarity_scores_roberta(text)

        # Convert numpy types to Python types
        result = {
            "Id": review.get("Id"),
            "InvestorId": review.get("InvestorId"),
            "PitcherId": review.get("PitcherId"),
            "ProfileName": review.get("ProfileName"),
            "HelpfulnessNumerator": review.get("HelpfulnessNumerator"),
            "HelpfulnessDenominator": review.get("HelpfulnessDenominator"),
            "Score": review.get("Score"),
            "Time": review.get("Time"),
            "Summary": review.get("Summary"),
            "Text": review.get("Text"),
            "vader_neg": float(vader_scores["neg"]),
            "vader_neu": float(vader_scores["neu"]),
            "vader_pos": float(vader_scores["pos"]),
            "vader_compound": float(vader_scores["compound"]),
            "roberta_neg": float(roberta_scores["roberta_neg"]),
            "roberta_neu": float(roberta_scores["roberta_neu"]),
            "roberta_pos": float(roberta_scores["roberta_pos"]),
        }
        results.append(result)

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
