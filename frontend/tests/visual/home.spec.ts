import { expect, test } from "@playwright/test";

test("user and console surfaces render with both backend services", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "SparkCrew" })).toBeVisible();
  await expect(page.getByText("Connected", { exact: true })).toBeVisible();
  await expect(page.getByText('"status": "ok"')).toBeVisible();
  await expect(page.getByText('"backend": "django"')).toBeVisible();
  await expect(page.getByText('"api": "drf"')).toBeVisible();
  await expect(page.getByText('"backend": "fastapi"')).toBeVisible();

  const screenshot = await page.screenshot({ fullPage: true });
  expect(screenshot.length).toBeGreaterThan(0);

  await page.goto("/console");
  await expect(page.getByRole("heading", { name: "Operations workspace" })).toBeVisible();
  expect((await page.screenshot({ fullPage: true })).length).toBeGreaterThan(0);
});
