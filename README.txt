# RHEL AI / OpenShift AI — Quick Win Demo
## Fuel Efficiency Prediction (Car Carrier Trucks)

### Contents
- `sample_trips.csv` — synthetic historical trips dataset
- `fuel_efficiency_quickwin_demo.ipynb` — training & inference notebook (use in OpenShift AI)
- `kserve-inferenceservice.yaml` — template to serve the model via KServe (Sklearn server)
- `sample_request.json` — example payload for inference

### How to Use in OpenShift AI (Jupyter)
1. Upload all files to your Jupyter workbench.
2. Open `fuel_efficiency_quickwin_demo.ipynb` and **Run All**.
3. The notebook will save `model_random_forest.joblib` in the working directory.
4. Copy the model file to an object storage or PVC mounted at `pvc://models/fuel-efficiency-rf` (adjust YAML if needed).
5. Apply `kserve-inferenceservice.yaml` in your project/namespace:
   ```bash
   oc apply -f kserve-inferenceservice.yaml
   ```
6. Send a prediction:
   ```bash
   curl -X POST \
  -H 'content-type: application/json' \
  https://<inferenceservice-url>/v1/models/fuel-efficiency-rf:predict \
  -d @sample_request.json
   ```

### Notes
- This is a **baseline** model intended for quick ROI. Replace synthetic data with your telemetry.
- Start with these features and iterate: add tire pressure, axle loads, trailer type, precise elevation profiles, etc.
- For production: register the model in MLflow, automate training with KFP, monitor drift, and enable canary rollouts.
