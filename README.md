<h1 align="center">SparkCrew</h1>

<p align="center">
  <strong>사람과 AI가 같은 맥락에서 대화하고, 작업하고, 결과를 만드는 AI 협업 프로젝트</strong><br>
  <strong>An AI collaboration project where people and AI share context, work, and produce results together</strong>
</p>

<p align="center">
  개인 AI 대화와 팀 Topic/Thread 협업을 바탕으로 파일·지식·백그라운드 작업과 Browser/Terminal/Workspace 실행을 연결하는 방향입니다.<br>
  See the Korean and English documentation for details.
</p>

<p align="center">
  <a href="docs/README.ko.md"><strong>한국어</strong></a>
  &nbsp;·&nbsp;
  <a href="docs/README.en.md"><strong>English</strong></a>
</p>

---

## Project direction

SparkCrew explores a collaboration model in which conversation is shared context rather than the only workspace.

- **Personal AI**: private AI conversations and personal topics.
- **Team topics and threads**: SNS-style posts and threaded discussion for people and shared AI participants.
- **Files and knowledge**: shared files remain separate from RAG indexing scope; upload does not automatically promote a file to team or organization knowledge.
- **Background work**: AI tasks run independently from the conversation that requested them.
- **Execution tools**: browser automation, terminal tasks, and isolated workspaces can be attached to a task when needed.
- **Shared results**: documents, images, video, charts, tables, notebook/HTML results, and live browser sessions can be presented in a shared viewing surface.

Full desktop/OS streaming and control are not part of the current project direction. Browser-based Computer Use is the primary interactive execution target.

## Current runnable scaffold

The repository currently includes an initial local application scaffold:

- Frontend: Next.js, React, TypeScript, Tailwind CSS, axios, SweetAlert2, Playwright.
- Backend: Django, Django REST Framework, Django Admin, Django ORM, django-cors-headers.
- Local integration: the Next.js dev server rewrites `/api/*` to the Django backend at `http://127.0.0.1:8000/api/*`.
- Health endpoint: `GET /api/health/` returns the Django/DRF service status.
- Admin route: Django Admin is enabled at `/admin/`.

The collaboration, RAG, agent-task, browser-runtime, terminal/workspace, and shared-result concepts above describe project direction and are not all implemented by the current scaffold.

Docker, Nginx, K8s, Helm, production deployment manifests, custom domain models, custom migrations, and SQL schema work are not part of this initial scaffold.

## Local development

```bash
# Backend
python -m pip install -r backend/requirements.txt
python backend/manage.py check
python backend/manage.py runserver 127.0.0.1:8000

# Frontend
cd frontend
npm install
npm run build
npm run test:visual
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Open `http://127.0.0.1:3000` to view the current frontend scaffold and backend health status.

### Optional Django Admin setup

Django Admin is enabled at `/admin/`. To use it locally, run Django built-in migrations and create a local superuser:

```bash
python backend/manage.py migrate
python backend/manage.py createsuperuser
```

`backend/db.sqlite3` is a local development artifact and must not be committed. This scaffold does not add custom domain migrations.

---

## Language

| Language | README |
|---|---|
| 한국어 | [docs/README.ko.md](docs/README.ko.md) |
| English | [docs/README.en.md](docs/README.en.md) |

---

## License

Source code is licensed under the PolyForm Noncommercial License 1.0.0. See the repository license file for details.
