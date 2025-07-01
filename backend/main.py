from fastapi import FastAPI, HTTPException, Query
from pydantic import ValidationError
from fastapi.middleware.cors import CORSMiddleware
from transformers import FeatureImputer, FeatureEncoder 
from enums import SexEnum, PClassEnum
from typing import Optional
from models import FilteredSurvivorsResponse, PredictionInput
import pandas as pd
from data import get_filtered_survivors
import pickle

app = FastAPI()
titanic_data = pd.read_csv("data/data.csv")

model = None

def load_model():
    global model
    if model is None:
        print("Loading model...")
        with open("model.pkl", "rb") as f:
            model= pickle.load(f)
        print("Model loaded!")
    return model


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://localhost:3000",
        "https://titanic-eda.vercel.app",
        "https://api.ryushinwells.com",
        "https://titanic-eda-ryus-projects-33e7a349.vercel.app",
        "https://titanic-eda-git-master-ryus-projects-33e7a349.vercel.app"
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/predict")
def predict(data: PredictionInput):
    model = load_model()
    df = pd.DataFrame([data.model_dump()])
    prediction = model.predict_proba(df)[:, 1]
    return {"survival_chance": round(prediction[0] * 100, 2)}


@app.get("/api/survivors")
def filtered_survival_stats(
    sex: Optional[SexEnum] = Query(None ,description="Filter by passenger sex"),
    p_class: Optional[PClassEnum] = Query(None, description="Filter by passenger class")
    ) -> FilteredSurvivorsResponse:

    filters = {}
    if sex is not None:
        filters["Sex"] = sex.value
    if p_class is not None:
        filters["Pclass"] = int(p_class.value)

    survival_data = get_filtered_survivors(titanic_data=titanic_data, filters=filters)
    try: 
        response = FilteredSurvivorsResponse(
            total_passengers=survival_data.get("total_passengers", 0),
            survivor_count=survival_data.get("survivor_count", 0),
            survival_rate=survival_data.get("survival_rate", 0.0),
            filters_applied=survival_data.get("filters_applied", {})
            )
    except ValidationError:
        raise HTTPException(status_code=500, detail="interval server error")

    return response


if __name__ == "__main__":
    pass
