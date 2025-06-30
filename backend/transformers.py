from sklearn.base import BaseEstimator, TransformerMixin 
import pandas as pd
from sklearn.preprocessing import OneHotEncoder

class FeatureImputer(BaseEstimator, TransformerMixin):

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X["Age"] = X["Age"].fillna(X["Age"].mean())
        X["Fare"] = X["Fare"].fillna(X["Fare"].mean())
        return X


class FeatureEncoder(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.encoder = OneHotEncoder(drop=None, sparse_output=False, handle_unknown="ignore")

    def fit(self, X, y=None):
        self.encoder.fit(X[["Sex"]])
        self.feature_names = self.encoder.get_feature_names_out(["Sex"])
        return self

    def transform(self, X):
        X = X.copy()
        encoded = self.encoder.transform(X[["Sex"]])
        encoded_df = pd.DataFrame(encoded, columns=self.feature_names, index=X.index)
        X = pd.concat([X.drop(columns=["Sex"]), encoded_df], axis=1)
        return X