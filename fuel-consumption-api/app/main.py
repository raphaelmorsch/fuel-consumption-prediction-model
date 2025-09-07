from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI()
model = joblib.load("app/model_random_forest.joblib")

class Trip(BaseModel):
    num_cars: int
    load_weight_kg: float
    route_distance_km: float
    avg_speed_kmh: float
    elevation_gain_m: float
    ambient_temp_c: float
    rain_mm: float
    wind_kmh: float

@app.post("/predict")
def predict(trip: Trip):
    df = pd.DataFrame([trip.dict()])
    pred = model.predict(df)[0]
    return {
        "predicted_l_per_100km": pred,
        "estimated_total_l": pred * df["route_distance_km"][0] / 100
    }

@app.get("/health")
def health():
    return {"status": "healthy"}
