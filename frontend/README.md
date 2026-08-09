# SparkCrew Frontend

The initial SparkCrew frontend scaffold uses Next.js App Router, React, TypeScript, Tailwind CSS, axios, SweetAlert2, and Playwright.

The project direction for the frontend includes personal AI conversations, team topics and threads, files/artifacts, AI task status, shared document/data/media views, and browser-based Computer Use surfaces. These features are not all implemented by the current scaffold.

## Local development

```bash
cd frontend
npm install
npm run build
npm run test:visual
npm run dev -- --hostname 127.0.0.1 --port 3000
```

The frontend calls the Django backend through `/api`. During local development, `next.config.ts` rewrites `/api/*` to `http://127.0.0.1:8000/api/*`.

The current home page displays the `GET /api/health/` response. axios performs the request, and SweetAlert2 is shown when a retry cannot reach the backend.

No Docker, Nginx, K8s, or Helm configuration is part of this initial scaffold.
