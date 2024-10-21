import { test, expect, type Page } from '@playwright/test';
import { getRandomUser } from './utils/dbUtils';
import dotenv from 'dotenv';
dotenv.config();

const TEST_PASSWORD = process.env.PASSWORD;

if (!TEST_PASSWORD) {
  throw new Error('TEST_PASSWORD environment variable is not set');
}

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterEach(async () => {
  await page.close();
});

test('should login successfully with database user credentials', async ({ page }) => {
  // Get a random user from the database
  const user = await getRandomUser();

  // Navigate to the login page
  await page.goto(`${process.env.BASE_URL}/${process.env.LOGIN_PATH}`);

  // Fill in the username and password
  await page.getByRole('textbox', { name: 'Username' }).fill(user.username);
  await page.locator('#password').fill(TEST_PASSWORD);

  // Click the login button
  await page.getByRole('button', { name: 'SIGN IN' }).click();

  // Assert successful login
  // Check if we're redirected to the main page
  await expect(page).toHaveURL(`${process.env.BASE_URL}`);
  
  // Check if the Logout button is visible on the main page
  const logoutButton = await page.getByRole('button', { name: 'Logout' });
  await expect(logoutButton).toBeVisible();
});