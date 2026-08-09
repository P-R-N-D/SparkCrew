# SparkCrew Architecture

SparkCrew is an AI collaboration project centered on personal AI conversations and team Topic/Thread collaboration. Conversation provides context, while files, knowledge, background tasks, artifacts, and execution runtimes remain separate resources.

This document describes architecture direction and current scaffold boundaries. Planned components must not be described as implemented unless the repository contains working code and verification for them.

## Current runnable scaffold

- Frontend stack: Next.js, React, TypeScript, Tailwind CSS, axios, SweetAlert2, and Playwright.
- Backend stack: Django, Django REST Framework, Django Admin, Django ORM, and django-cors-headers.
- Local integration: Next.js rewrites `/api/*` to the Django backend at `http://127.0.0.1:8000/api/*` during local development.
- Health endpoint: Django exposes `GET /api/health/` for frontend/backend connectivity checks.
- Admin route: Django Admin is enabled at `/admin/` for internal operator/admin workflows.

Django REST Framework is the current API layer and Django ORM is the primary ORM. The current scaffold does not yet implement the complete collaboration, RAG, agent runtime, Browser/Terminal/Workspace, or shared-result model described below.

FastAPI and SQLAlchemy are not part of the current backend stack. FastAPI may be considered later only as a separate execution or streaming service after explicit approval. Docker, Nginx, K8s, Helm, deployment manifests, production settings, custom domain DB models, custom migrations, SQL schema work, Alembic, and Prisma are not part of this scaffold.

## Collaboration model

The conceptual collaboration hierarchy is:

```text
Personal context
├─ Personal AI chat
├─ Personal topics
└─ Personal files/work

Team context
└─ Topic / Post
   ├─ Thread / messages
   ├─ People
   ├─ Shared AI participants
   ├─ Files
   ├─ Background tasks
   └─ Artifacts / shared views
```

A team Topic/Thread is a durable context boundary. It is not required to contain every project resource directly, but messages, files, tasks, artifacts, and knowledge references should be traceable back to the context that created or shared them.

Personal AI context remains private until the user explicitly shares content into a team context.

## Frontend surfaces

The frontend direction separates several user-facing concerns:

- **Conversation**: personal chat and team Topic/Thread discussion.
- **Files and artifacts**: uploaded files and generated results.
- **Tasks**: long-running AI work with status independent from the chat timeline.
- **Shared viewing surface**: documents, images, video, charts, tables, notebook/HTML output, and live browser sessions.
- **Browser work**: collaborative observation and, when implemented, explicit user/AI browser-control handoff.

The shared viewing surface is a presentation state over artifacts or live browser sessions, not a replacement for persistent file/artifact storage.

## Backend control plane

Django remains the default control plane.

Its direction includes:

- Authentication and users
- Team/personal authorization boundaries
- Topic/Thread context
- Messages
- File metadata and access
- Knowledge/RAG scope
- Artifact metadata
- AI task state
- Approval state when needed
- Internal admin workflows

Normal web requests should not own long-running AI or Browser/Terminal/Workspace execution.

## Realtime collaboration

Realtime transport should match the data being transferred.

- Chat messages, task state, presence-like events, approvals, and presentation state may use WebSocket or SSE depending on interaction requirements.
- Large binary files should use object/file storage rather than message transport.
- Live browser viewing/control should use a runtime-appropriate low-latency channel instead of encoding the entire feature as ordinary chat messages.

The exact transport is an implementation choice and should be introduced only when the corresponding feature is implemented.

## Agent and background execution

AI work should be modeled as task execution separate from conversational messages.

A typical conceptual flow is:

1. A user or shared AI participant receives context from a personal chat or team Topic/Thread.
2. The system resolves permitted files and RAG knowledge.
3. The AI decides whether a response can be produced directly or a background task is needed.
4. A task may use model calls, retrieval, Browser, Terminal, or Workspace tools.
5. Task status and intermediate events are published independently from the conversation.
6. Persistent outputs return as messages, artifacts, files, or task results.
7. Runtime-local state may be discarded when the task/runtime ends.

Agent orchestration frameworks such as LangGraph or DeepAgents may be used as implementation details. Product contracts should remain independent from one agent framework.

## Browser, Terminal, and Workspace runtimes

The current execution direction is:

- **Browser**: primary interactive Computer Use target; prefer Playwright/CDP for deterministic browser actions.
- **Terminal**: command execution for task-scoped automation when explicitly implemented and permitted.
- **Workspace**: isolated task working directory/runtime for files and generated outputs.

These runtimes should be task-scoped and separable from persistent collaboration data.

Full desktop/OS streaming and control are outside the current project scope.

## Files, artifacts, and RAG

Files and knowledge have different lifecycles.

```text
File upload
├─ Shared/personal file
├─ Optional current-task input
└─ Optional explicit RAG/knowledge indexing
```

Uploading a file must not automatically promote it to team-wide or organization-wide RAG knowledge.

RAG retrieval should preserve and enforce scope such as personal, current Topic/Thread, team/project, organization, or external source. Source, ownership, version/validity, and indexing status should remain traceable when implemented.

Artifacts are generated or derived outputs such as documents, charts, tables, images, HTML/notebook results, or browser snapshots. They should remain traceable to the task and context that produced them.

## Python concurrency direction

SparkCrew should be designed for free-threaded Python compatibility.

- Correctness must not depend on the GIL for synchronization.
- Avoid unprotected process-global mutable application state.
- Use explicit synchronization for unavoidable shared in-process state.
- Prefer PostgreSQL, Redis, queues, or equivalent external stores for distributed shared state.
- ASGI async I/O remains useful for I/O concurrency even with free-threaded Python.
- Native and third-party dependency compatibility must be verified before enabling GIL-free production execution.
- GIL-enabled CPython remains a compatibility and stability fallback.

Free-threading does not remove the need for process isolation, task workers, or horizontal scaling where those are operationally useful.

## Authorization and safety

Before accessing shared context or executing tools, check:

- User and AI participant authorization
- Personal versus team visibility
- File and knowledge scope
- Allowed tools and targets
- Whether an action is read-only or state-changing
- Whether explicit human approval is required
- Artifact and secret-handling requirements

Do not use root, sudo, or administrator privileges. Do not run destructive commands or persist secrets in normal project data.
