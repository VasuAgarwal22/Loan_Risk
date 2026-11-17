import os
import joblib
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from data.generate_and_clean_data import generate_synthetic_data

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILE = os.path.join(BASE_DIR, 'models', 'model.joblib')
DATA_FILE = os.path.join(BASE_DIR, 'data', 'synthetic_loan_data.csv')

def evaluate_model():
    if not os.path.exists(MODEL_FILE):
        print("Model file not found. Please run train.py first.")
        return

    pipeline = joblib.load(MODEL_FILE)

    if not os.path.exists(DATA_FILE):
        df = generate_synthetic_data(2000, random_state=99)
    else:
        df = pd.read_csv(DATA_FILE).sample(n=2000, random_state=99)

    X = df.drop(columns=['default'])
    y = df['default']

    y_pred = pipeline.predict(X)
    y_prob = pipeline.predict_proba(X)[:, 1]

    print("\n" + "=" * 50)
    print("MODEL EVALUATION REPORT")
    print("=" * 50)
    print("\nConfusion Matrix:")
    print(confusion_matrix(y, y_pred))
    print(f"\nROC-AUC Score: {roc_auc_score(y, y_prob):.4f}")
    print("\nDetailed Classification Report:")
    print(classification_report(y, y_pred))

if __name__ == '__main__':
    evaluate_model()
