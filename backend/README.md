# SparkCrew Backend

The initial SparkCrew backend scaffold uses Django, Django REST Framework, Django Admin, Django ORM, and django-cors-headers.

The backend direction is to keep Django as the primary control plane for users, permissions, topic/thread context, files, knowledge scope, task state, and admin workflows. Long-running AI work and Browser/Terminal/Workspace execution should run outside normal request handling. FastAPI or another runtime service may be considered later only when a separate execution/streaming service is justified.

## Local development

```bash
python -m pip install -r backend/requirements.txt
python backend/manage.py check
python backend/manage.py runserver 127.0.0.1:8000
```

## Optional local admin setup

Django Admin is available at `http://127.0.0.1:8000/admin/`. To sign in locally, initialize Django built-in auth/admin tables and create a local superuser:

```bash
python backend/manage.py migrate
python backend/manage.py createsuperuser
python backend/manage.py runserver 127.0.0.1:8000
```

- `backend/db.sqlite3` is a local development artifact and must not be committed.
- This uses Django built-in migrations only; no custom domain migrations are added in this scaffold.

## Endpoints

- Health API: `GET http://127.0.0.1:8000/api/health/`
- Django Admin: `http://127.0.0.1:8000/admin/`

This scaffold intentionally does not add custom domain models, custom migrations, SQL, production deployment settings, Docker, Nginx, K8s, or Helm.
