import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e', // Directory where your test files are located
  fullyParallel: true, // Run tests in parallel
  forbidOnly: !!process.env.CI, // Disallow .only in CI
  retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined, // Limit workers in CI
  reporter: 'html', // Report results as HTML
  use: {
    baseURL: 'http://localhost:4174', // Your SvelteKit preview server URL
    trace: 'on-first-retry', // Capture trace on first retry
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  /* webServer: {
    command: 'npm run preview', // Command to start your SvelteKit app for testing
    url: 'http://localhost:4174',
    reuseExistingServer: !process.env.CI,
  }, */
});
