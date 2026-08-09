# SparkCrew Testing Strategy

This document describes the testing strategy for the current scaffold and for SparkCrew collaboration features as they are implemented. It is a planning and review guide, not a test implementation file.

Do not claim a planned feature is verified when the corresponding code or runtime does not exist.

## Initial scaffold checks

For the current runnable scaffold, use these checks when the relevant area changes:

- Backend dependency and Django check:

  ```bash
  python -m pip install -r backend/requirements.txt
  python backend/manage.py check
  ```

- Backend health endpoint verification:

  ```bash
  python backend/manage.py runserver 127.0.0.1:8000
  curl http://127.0.0.1:8000/api/health/
  ```

- Frontend dependency, build, and visual smoke testing:

  ```bash
  cd frontend
  npm install
  npm run build
  npx playwright install chromium
  npm run test:visual
  ```

Backend changes must at least run Django checks. UI/web design changes must include Playwright-based visual testing.

## Document-only change verification

For documentation-only updates, verify:

- File existence for every expected document.
- Link/path consistency for changed references.
- Stale project-name and stale architecture wording in the changed documentation scope.
- No secrets, credentials, or realistic secret examples are present.
- The changed files are limited to the requested documentation scope.
- Planned and implemented features remain clearly distinguished.

Useful checks include:

```bash
git diff --check
rg -n "Vericus|evidence-driven workspace|case workspace|evidence timeline" \
  README.md AGENTS.md CLAUDE.md docs frontend/README.md backend/README.md skills/README.md \
  .github/copilot-instructions.md .cursor/rules/vericus.mdc \
  --glob '!TESTING.md'
```

The `.cursor/rules/vericus.mdc` path may retain its historical filename until a separate rename is explicitly requested; its contents should still describe SparkCrew.

## Topic/Thread and context testing

When Topic/Thread features are implemented, verify:

- Personal AI context is not visible in team contexts without explicit sharing.
- Team AI receives only the Topic/Thread history, files, and knowledge permitted by the current access scope.
- Topic/Thread navigation preserves the correct context.
- Multiple topics do not leak messages, files, task state, or retrieval results into each other.
- Rich AI responses remain usable without turning every background event into a chat message.

## File, artifact, and RAG testing

When file and RAG features are implemented, verify:

- Upload, download, and preview permissions.
- Personal versus team file visibility.
- File upload does not automatically create team-wide or organization-wide knowledge.
- Explicit knowledge-indexing actions preserve source and scope metadata.
- Generated artifacts remain traceable to their source task/context.
- Runtime-local temporary files do not become persistent shared files unless explicitly published.

## Background task testing

When AI task execution is implemented, verify:

- A task can continue without blocking normal conversation.
- Task status transitions are observable and consistent.
- Cancellation and failure do not corrupt conversation or persistent files.
- Task outputs return as explicit messages, files, artifacts, or task results.
- State-changing or high-impact actions stop for approval when the workflow requires it.

## Browser Computer Use testing

Browser behavior and browser-based Computer Use should use Playwright for deterministic interaction and verification whenever possible.

Verify:

- Browser sessions start and stop cleanly.
- The session is associated with the correct task/context.
- Allowed viewers cannot access sessions from another context.
- AI actions operate on the intended page and browser state.
- User/AI control handoff is exclusive and visible when that feature is implemented.
- Screenshots are generated and directly reviewed for UI changes.
- Browser console errors and failed network/resource requests are checked when relevant.

Full desktop/OS streaming and control are outside the current testing scope unless that project boundary is explicitly changed.

## Shared result/view testing

When document, media, chart/table, notebook/HTML, or live-browser presentation is implemented, verify:

- The correct artifact or live session is shown.
- Presentation state such as document page, slide, media position, or chart state stays consistent where synchronization is intended.
- Closing the shared view does not delete the underlying artifact.
- Desktop and mobile layouts remain usable without unintended horizontal scrolling or clipping.
- Light and dark mode are verified when both modes are supported.

## API testing

API changes should use Django/DRF tests and Postman/Newman verification when the API workflow is in scope.

Check:

- Normal requests
- Missing required values
- Invalid input formats
- Authentication and authorization errors
- Missing resources
- Boundary values
- Expected HTTP status codes
- Required response fields and types
- Error response format
- State changes and regression risk

Do not send state-changing production requests unless explicitly approved. Do not place real secrets in Postman collections or environment examples.

## Free-threading compatibility testing

SparkCrew should be written so correctness does not rely on the GIL.

When a suitable free-threaded Python environment and dependency set are available:

- Run the relevant backend test suite with the GIL disabled.
- Run the same critical tests with a GIL-enabled runtime as a compatibility baseline.
- Exercise concurrent access to shared application paths instead of assuming the GIL serializes them.
- Verify native and third-party dependencies do not silently require incompatible thread-safety assumptions.
- Record whether free-threaded execution was actually tested; do not infer support from static review alone.

## Forbidden-change verification

Verify that the change set does not include unapproved:

- DB migration files or migration instructions.
- ORM/schema implementation or custom Django models.
- SQL implementation.
- `.env` files.
- Secrets, credentials, or realistic secret examples.
- FastAPI, SQLAlchemy, Alembic, Prisma, Docker, Nginx, K8s, Helm, production deployment manifests, or CI workflow files.
- Package or lockfile changes.
- Generated test artifacts.

FastAPI and SQLAlchemy are not part of the current backend stack. A separate execution/streaming service may be considered later only after its responsibility is explicitly approved.
