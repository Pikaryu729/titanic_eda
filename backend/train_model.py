import pickle
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV
from transformers import FeatureImputer, FeatureEncoder
from sklearn.preprocessing import StandardScaler
import pandas as pd


def train():
    def drop_features(df: pd.DataFrame):
        return df.drop(columns=["PassengerId", "Name", "SibSp", "Parch", "Ticket", "Cabin", "Embarked"])

    data = pd.read_csv("data/data.csv")
    
    data = drop_features(data)

    X = data.drop("Survived", axis=1)
    y = data["Survived"].to_numpy()

    pipeline = Pipeline([
        ("Feature Imputer", FeatureImputer()),
        ("Feature Encoder", FeatureEncoder()),
        ("Scaler", StandardScaler()),
        ("Classifier", LogisticRegression(solver="liblinear")),
    ])

    param_grid = {
        "Classifier__C": [0.1, 1.0, 10],
        "Classifier__penalty": ["l1", "l2"],
        "Scaler__with_mean": [True, False],
    }

    cv_pipeline = GridSearchCV(
        pipeline,
        param_grid,
        cv=5,
        scoring="accuracy",
        n_jobs=-1,
    )

    model = cv_pipeline.fit(X, y)


    with open("model.pkl", "wb") as f:
        pickle.dump(model, f)

if __name__ == "__main__":
    train()