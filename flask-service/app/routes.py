from flask import Blueprint, request, jsonify
from app.models.predict_model import predict
from app.models.train_model import retrain

main = Blueprint('main', __name__)

@main.route('/predict', methods=['POST'])
def predict_endpoint():
    data = request.json
    if 'Text' not in data:
        return jsonify({"error": "Text is required"}), 400
    prediction = predict(data['Text'])
    return jsonify({"predicted_score": prediction})

@main.route('/retrain', methods=['POST'])
def retrain_endpoint():
    data = request.json
    if 'new_reviews' not in data:
        return jsonify({"error": "New reviews are required"}), 400
    retrain(data['new_reviews'])
    return jsonify({"message": "Model retrained successfully."})
