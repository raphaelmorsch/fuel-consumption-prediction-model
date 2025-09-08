import React, { useState } from "react";

const MODEL_SERVER_URL = process.env.REACT_APP_MODEL_SERVER_URL;
const TOKEN = process.env.REACT_APP_MODEL_TOKEN;

export default function App() {
  const [form, setForm] = useState({
    num_cars: "",
    load_weight_kg: "",
    route_distance_km: "",
    avg_speed_kmh: "",
    elevation_gain_m: "",
    ambient_temp_c: "",
    rain_mm: "",
    wind_kmh: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/v2/models/model/infer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${TOKEN}`
        },
        body: JSON.stringify({
          inputs: [
            {
              name: "input",
              shape: [1, 8],
              datatype: "FP32",
              data: [Object.values(form).map(Number)]
            }
          ]
        })
      });

      const result = await response.json();
      console.log("Model result:", result);

      if (result.outputs && result.outputs[0] && result.outputs[0].data) {
        setPrediction(result.outputs[0].data[0]);
      } else {
        setPrediction(null);
        alert("Prediction not returned from server.");
      }

    } catch (error) {
        console.error("Error fetching prediction:", error);
        alert("Error fetching prediction: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="card">
        <h1>Fuel Consumption Prediction</h1>

        <form onSubmit={handleSubmit}>
          {Object.keys(form).map((key) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>
                {key.replace(/_/g, " ")}
              </label>
              <input
                type="number"
                step="any"
                id={key}
                name={key}
                value={form[key]}
                onChange={handleChange}
                className="input"
                placeholder={`Enter ${key.replace(/_/g, " ")}`}
                required
              />
            </div>
          ))}

          <button type="submit" className="btn">
            Predict
          </button>
        </form>

        {prediction !== null && (
          <div className="result">
            Predicted Consumption: {prediction.toFixed(2)} L/100km
          </div>
        )}
      </div>
    </div>
  );
}
