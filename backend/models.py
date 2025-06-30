from pydantic import BaseModel
from typing import Optional
from enums import PClassEnum, SexEnum

class FilteredSurvivorsResponse(BaseModel):
    total_passengers: int
    survivor_count: int
    survival_rate: float
    filters_applied: Optional[dict] = {}


class PredictionInput(BaseModel):
    Pclass: PClassEnum
    Sex: SexEnum
    Age: int
    Fare: float