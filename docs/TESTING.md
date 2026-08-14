# SparkCrew Testing Strategy

Do not claim planned behavior is verified. The current scaffold checks only routing, health contracts, rendering, and the Browser runtime foundation.

The backend baseline is Django 6 on Python 3.12+. Dependency verification should confirm the resolved Django, Django REST Framework, django-cors-headers, and Daphne versions before regression testing.

## Scaffold checks

```bash
python -m pip install -r backend/requirements.txt
python backend/manage.py check
python backend/manage.py test core agent
python -c "from playwright.async_api import async_playwright"
playwright install chromium

cd frontend
npm run lint
npm run build
npm run test:visual
```

Verify both backend runners independently. For each runner, request `/core/health/`, `/agent/health/`, `/agent/openapi.json`, and `/admin/`:

```bash
cd backend
python manage.py runserver 127.0.0.1:8000
uvicorn config.asgi:application --host 127.0.0.1 --port 8000
```

Expected statuses are 200 for health/OpenAPI and either 200 or a normal authentication redirect for Admin. `/api/health/` is intentionally absent.

Frontend Playwright starts the integrated backend and Next.js, checks `/` and `/console`, asserts both health payloads, and captures screenshots. UI changes should additionally be reviewed for console errors, failed network requests, responsive overflow, and light/dark behavior.

Python Playwright package import and Chromium installation are separate checks. When the environment supports it, launch Chromium headlessly and close it without network access. This proves only the runtime dependency, not Browser Computer Use features.

Future Topic/Thread, file/RAG, authorization, task, artifact, and browser-session features require tests for personal/team isolation, permission scope, explicit indexing, task/execution separation, concurrency without GIL assumptions, and task-scoped runtime cleanup when implemented.
