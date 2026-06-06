import joblib
import numpy as np
from lime.lime_text import LimeTextExplainer

class XAIService:
    def __init__(self, model_path='backend/linear_svm_model.pkl', vectorizer_path='backend/tfidf_vectorizer.pkl'):
        # Load models once during initialization
        self.model = joblib.load(model_path)
        self.vectorizer = joblib.load(vectorizer_path)
        self.explainer = LimeTextExplainer(class_names=['Ham', 'Spam'])

    def _predict_proba_wrapper(self, texts):
        features = self.vectorizer.transform(texts)
        decision = self.model.decision_function(features)
        if decision.ndim > 1:
            decision = decision[:, 1]
        probs = 1 / (1 + np.exp(-decision))
        n_samples = len(texts)
        prob_matrix = np.zeros((n_samples, 2))
        prob_matrix[:, 1] = probs
        prob_matrix[:, 0] = 1 - probs
        return prob_matrix

    def get_local_explanation(self, text):
        """Generates LIME explanation for a single prediction."""
        exp = self.explainer.explain_instance(text, self._predict_proba_wrapper, num_features=5)
        return [[str(word), float(score)] for word, score in exp.as_list()]

    def get_global_importance(self):
        """Placeholder for future SHAP global feature importance integration."""
        return {"message": "SHAP global explainer is currently under development."}