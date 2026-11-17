import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin

class FinancialFeatureEngineer(BaseEstimator, TransformerMixin):
    """
    Custom transformer to engineer financial ratios and log transformations
    consistent between training and inference pipelines.
    """
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X_df = X.copy()
        if not isinstance(X_df, pd.DataFrame):
            X_df = pd.DataFrame(X_df)

        # LTI = Loan Amount / Annual Income
        annual_income = X_df['annual_income'].replace(0, 1.0)
        X_df['loan_to_income_ratio'] = X_df['loan_amount'] / annual_income

        # DTI = [Monthly Debt + (Loan Amount / Loan Tenure)] / (Annual Income / 12)
        tenure = X_df['loan_tenure_months'].replace(0, 12.0)
        monthly_income = annual_income / 12.0
        monthly_installment = X_df['loan_amount'] / tenure
        X_df['debt_to_income_ratio'] = (X_df['monthly_debt'] + monthly_installment) / monthly_income

        # Log1p transforms for skewed monetary amounts
        X_df['log_annual_income'] = np.log1p(np.maximum(X_df['annual_income'], 0))
        X_df['log_loan_amount'] = np.log1p(np.maximum(X_df['loan_amount'], 0))
        X_df['log_savings_balance'] = np.log1p(np.maximum(X_df['savings_balance'], 0))

        return X_df
