// @ts-check
const { defineConfig, devices } = require('@playwright/test');

// Si defines BASE_URL (p. ej. el sitio publicado) no se levanta servidor local.
const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';
const useLocal = !process.env.BASE_URL;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: useLocal ? 2_000 : 5_000 },
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // El sitio carga fuentes, jQuery y FontAwesome de CDN: no los necesitamos para probar.
  },
  webServer: useLocal ? { command: 'node server.js', url: BASE_URL, reuseExistingServer: true } : undefined,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
