from transformers import pipeline

# Load the RoBERTa sentiment analysis pipeline
roberta_pipeline = pipeline("sentiment-analysis")

def analyze_sentiment(text):
    """Analyze sentiment using RoBERTa and return a score between 0 and 1."""
    result = roberta_pipeline(text)
    label = result[0]['label']
    score = result[0]['score']
    
    # Convert to normalized score (0 for negative, 1 for positive)
    if label == "NEGATIVE":
        return 1 - score
    return score
