// File: src/App.jsx
import React, { useState } from 'react'

// Simple, single-file React app intended to be easy to deploy on OpenShift.
// Configuration:
// - The inference endpoint is read from environment variable REACT_APP_INFERENCE_URL
// - If not set, it will POST to '/api/predict' (useful if you add an OpenShift Route + proxy)

export default function App() {
  const defaultUrl = process.env.REACT_APP_INFERENCE_URL || '/api/predict'
  const [endpoint, setEndpoint] = useState(defaultUrl)
  const [inputs, setInputs] = useState({
    num_cars: 7,
    load_weight_kg: 10150,
    route_distance_km: 680,
    avg_speed_kmh: 78,
    elevation_gain_m: 550,
    ambient_temp_c: 26,
    rain_mm: 3.0,
    wind_kmh: 12
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  function onChange(e) {
    const { name, value } = e.target
    setInputs(prev => ({ ...prev, [name]: Number(value) }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const payload = { instances: [inputs] }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`${res.status} ${res.statusText}: ${text}`)
      }

      const data = await res.json()
      // Try common response shapes: { predictions: [...] } or { instances: [...] } or raw array
      let pred = null
      if (data.predictions) pred = data.predictions[0]
      else if (data.instances) pred = data.instances[0]
      else if (Array.isArray(data)) pred = data[0]
      else pred = data

      setResult(pred)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-6">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Fuel Efficiency — Quick Demo</h1>
          <p className="text-sm text-gray-600">Predict L/100km for car-carrier trips. Endpoint: <code className="bg-gray-100 px-1 rounded">{endpoint}</code></p>
        </header>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(inputs).map(([k, v]) => (
            <label key={k} className="block">
              <span className="text-sm text-gray-700 capitalize">{k.replace(/_/g, ' ')}</span>
              <input
                name={k}
                value={v}
                onChange={onChange}
                step="any"
                className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-200 p-2"
              />
            </label>
          ))}

          <div className="col-span-full flex items-center gap-3 mt-2">
            <input
              value={endpoint}
              onChange={(e)=>setEndpoint(e.target.value)}
              className="flex-1 rounded-md border p-2"
              placeholder="Inference endpoint URL (full URL or relative path)"
            />
            <button disabled={loading} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">
              {loading ? 'Consultando...' : 'Predict'}
            </button>
            <button type="button" onClick={()=>{ setInputs({ num_cars:7, load_weight_kg:10150, route_distance_km:680, avg_speed_kmh:78, elevation_gain_m:550, ambient_temp_c:26, rain_mm:3.0, wind_kmh:12 }); setResult(null); setError(null);} } className="px-3 py-2 rounded border">Reset</button>
          </div>
        </form>

        <section className="mt-6">
          <h2 className="text-lg font-medium">Resultado</h2>
          <div className="mt-2">
            {error && <pre className="bg-red-50 text-red-700 p-3 rounded">{error}</pre>}
            {result && (
              <div className="bg-green-50 p-4 rounded">
                <div><strong>Predição (L/100km):</strong> {typeof result === 'object' ? JSON.stringify(result) : String(result)}</div>
                {/* If model returns a numeric predicted L/100km, also show estimated total liters */}
                {typeof result === 'number' && (
                  <div className="mt-1 text-sm text-gray-700">Estimativa total: <strong>{(result * inputs.route_distance_km / 100).toFixed(1)} L</strong></div>
                )}
              </div>
            )}
            {!result && !error && <div className="text-sm text-gray-500">Sem resultado — execute uma previsão.</div>}
          </div>
        </section>

        <footer className="mt-6 text-xs text-gray-400">Tip: configure REACT_APP_INFERENCE_URL at build time or use a relative path and an OpenShift Route + route-based proxy.</footer>
      </div>
    </div>
  )
}