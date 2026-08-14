"""Lazy access to Playwright's async browser runtime."""

from playwright.async_api import PlaywrightContextManager, async_playwright


def playwright_runtime() -> PlaywrightContextManager:
    """Create a context manager without launching a browser at import time."""
    return async_playwright()
