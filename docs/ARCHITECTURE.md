# SparkCrew Architecture

SparkCrew keeps personal context private by default and separates conversation, tasks, files/artifacts, knowledge indexing, and execution runtimes.

## Implemented scaffold

The frontend is Next.js: `/` is the user surface and `/console/*` is the separate product-operations Console. It preserves React, TypeScript, Tailwind CSS, axios, SweetAlert2, and Node Playwright.

The backend baseline is Django 6 on Python 3.12+, with Django REST Framework, FastAPI, Daphne, and Uvicorn. It has one Django project (`config`) and exactly two product Django apps:

- `core`: persistent product/control-plane responsibility (users, permissions, collaboration context, files, product tasks, approvals) and DRF APIs at `/core/*`.
- `agent`: AI/RAG/LLM/orchestration/tool/runtime execution responsibility. It is a Django app sharing ORM, migrations, Admin, settings, auth, and permissions, and owns FastAPI at `/agent/*`.

No listed domain model is implemented. In particular, a future `core.Task` represents product-request state while an agent execution represents one attempt to perform it; retries must not be collapsed into the product task.

## ASGI composition

`config.asgi.application` is the single composition root. It sets Django settings and calls `get_asgi_application()` before importing the Agent FastAPI app. A parent FastAPI application then mounts Agent FastAPI at `/agent` first and Django at `/` as fallback. Thus `/core/*` and `/admin/*` reach Django, while `/agent/health/`, `/agent/docs`, and `/agent/openapi.json` reach FastAPI.

Daphne is installed first in `INSTALLED_APPS`, so `manage.py runserver` uses `ASGI_APPLICATION`; Uvicorn imports the same object directly. WSGI remains Django-only fallback, not the normal whole-backend contract.

## Runtime boundaries

`agent/rag`, `llm`, `orchestration`, `tools`, and `runtime` are package boundaries only. No embedding/chunking policy, vector store, model provider, agent framework, autonomous browser workflow, Terminal, or Workspace implementation is selected.

Frontend Node Playwright performs UI/E2E/visual/integration testing. Backend Python Playwright is the async Browser Computer Use runtime foundation under `agent/runtime/browser`; it does not launch a browser during imports. Browser binaries have a separate `playwright install chromium` lifecycle.

The intended dependency direction is Frontend → Core → Agent execution. Core remains the source of truth for authorization and persistent product state. Neither app imports the other's internal implementation in this scaffold, and correctness must not depend on the GIL or unprotected process-global mutable state.
