from fastapi import FastAPI, HTTPException, Query
from pydantic import ValidationError
from fastapi.middleware.cors import CORSMiddleware
from enums import SexEnum, PClassEnum
from typing import Optional
from models import FilteredSurvivorsResponse
import pandas as pd
from data import get_filtered_survivors

app = FastAPI()
titanic_data = pd.read_csv("data/data.csv")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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