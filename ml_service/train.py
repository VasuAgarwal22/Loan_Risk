import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, classification_report

from feature_engineering import FinancialFeatureEngineer
from data.generate_and_clean_data import generate_synthetic_data

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'synthetic_loan_data.csv')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
MODEL_FILE = os.path.join(MODELS_DIR, 'model.joblib')

def load_or_create_dataset():
    if not os.path.exists(DATA_FILE):
        print(f"Dataset not found at {DATA_FILE}. Generating synthetic dataset...")
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        df = generate_synthetic_data(n_samples=10000, random_state=42)
        df.to_csv(DATA_FILE, index=False)
    else:
        df = pd.read_csv(DATA_FILE)
    return df

def build_pipeline():
    numeric_features = [
        'age', 'annual_income', 'credit_score', 'loan_amount',
        'loan_tenure_months', 'existing_loans', 'monthly_debt',
        'monthly_expenses', 'employment_years', 'bank_account_age_years',
        'num_credit_cards', 'missed_payments_last_year', 'previous_defaults',
        'credit_utilization', 'savings_balance', 'transaction_frequency',
        'loan_to_income_ratio', 'debt_to_income_ratio',
        'log_annual_income', 'log_loan_amount', 'log_savings_balance'
    ]
    categorical_features = ['employment_type']

    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    preprocessor = ColumnTransformer(transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ])

    # Tuned Logistic Regression model matching project specification
    classifier = LogisticRegression(
        C=0.1,
        solver='liblinear',
        class_weight='balanced',
        max_iter=2000,
        random_state=42
    )

    pipeline = Pipeline(steps=[
        ('engineer', FinancialFeatureEngineer()),
        ('preprocessor', preprocessor),
        ('classifier', classifier)
    ])

    return pipeline

def train_and_evaluate():
    print("Loading data...")
    df = load_or_create_dataset()

    X = df.drop(columns=['default'])
    y = df['default']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Training set: {len(X_train)} samples, Test set: {len(X_test)} samples")

    pipeline = build_pipeline()

    print("Training pipeline...")
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_prob)

    print("\n" + "=" * 45)
    print("MODEL PERFORMANCE ON HELD-OUT TEST SET:")
    print("=" * 45)
    print(f"Accuracy : {acc * 100:.2f}%")
    print(f"Precision: {prec * 100:.2f}%")
    print(f"Recall   : {rec * 100:.2f}%")
    print(f"F1-Score : {f1 * 100:.2f}%")
    print(f"ROC-AUC  : {auc:.4f}")
    print("=" * 45)
    print("\nClassification Report:\n", classification_report(y_test, y_pred))

    os.makedirs(MODELS_DIR, exist_ok=True)
    joblib.dump(pipeline, MODEL_FILE)
    print(f"Trained model artifact successfully saved to: {MODEL_FILE}")

if __name__ == '__main__':
    train_and_evaluate()
