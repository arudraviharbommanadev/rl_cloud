# RL Control UI (React)

A React dashboard for all backend endpoints in this project.

## Covered endpoints

- Node gateway:
  - `POST /api/decide`
- FastAPI engine:
  - `GET /health`
  - `POST /decide`

## Run

```bash
cd frontend-react
npm install
npm run dev
```

By default, the UI uses Vite proxy paths:

- `/node-api` -> `http://localhost:3000`
- `/py-api` -> `http://localhost:5000`

If needed, override with env vars from `.env.example`.
