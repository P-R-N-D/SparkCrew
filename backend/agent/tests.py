from django.test import SimpleTestCase

from agent.fastapi.routes.health import health


class HealthTests(SimpleTestCase):
    async def test_health(self):
        response = await health()

        self.assertEqual(response["service"], "sparkcrew-agent")
        self.assertEqual(response["backend"], "fastapi")
