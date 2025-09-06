# Fuel Efficiency Frontend (React)

This repository contains a small React single-page app to test inference against the Fuel Efficiency model.

## How to build locally

1. `npm install`
2. `npm run start` (dev)

## How to build image and deploy to OpenShift

1. Build image locally or via OpenShift build pipeline. Example (local docker build):
   ```bash
   docker build -t registry.example.com/myproject/fuel-frontend:0.1 .
   docker push registry.example.com/myproject/fuel-frontend:0.1
   ```
2. Edit `openshift/deployment.yaml` and replace `REPLACE_WITH_IMAGE` with your image reference.
3. Apply to OpenShift:
   ```bash
   oc apply -f openshift/deployment.yaml
   ```

## Configuration
- The app reads `REACT_APP_INFERENCE_URL` at build time. If you set it as an env var in the Deployment, the built JS won't pick it up automatically — prefer to set the URL in the source before building or use a relative `/api` path with a proxy route.
