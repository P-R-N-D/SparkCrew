"""Single ASGI composition root for Django and the agent FastAPI app."""

import os
from django.core.asgi import get_asgi_application
from fastapi import FastAPI

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

# Initialize Django before importing application modules that may use its registry.
django_application = get_asgi_application()

from agent.fastapi.app import application as agent_application  # noqa: E402

application = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
application.mount("/agent", agent_application)
application.mount("/", django_application)
