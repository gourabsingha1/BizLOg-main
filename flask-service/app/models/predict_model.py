from app.utils.file_io import load_model, load_vectorizer

def predict(text):
    model = load_model("path/to/model.pkl")
    vectorizer = load_vectorizer("path/to/vectorizer.pkl")
    tfidf = vectorizer.transform([text])
    return model.predict(tfidf)[0] + 1  # Convert 0-4 to 1-5
