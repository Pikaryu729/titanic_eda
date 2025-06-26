from pydantic import BaseModel
from typing import Optional

class FilteredSurvivorsResponse(BaseModel):
    total_passengers: int
    survivor_count: int
    survival_rate: float
    filters_applied: Optional[dict] = {}