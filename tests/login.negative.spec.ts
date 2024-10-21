import { test, expect, type Page } from '@playwright/test';
import { getRandomUser } from './utils/dbUtils';
import dotenv from 'dotenv';
dotenv.config();

const TEST_PASSWORD = process.env.PASSWORD;
const INCORRECT_PASSWORD = 'incorrect_password';
const SHORT_PASSWORD = '123';

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

test('should fail login with incorrect password', async ({ page }) => {
  const user = await getRandomUser();

  await page.goto(`${process.env.BASE_URL}/${process.env.LOGIN_PATH}`);

  await page.getByRole('textbox', { name: 'Username' }).fill(user.username);
  await page.locator('#password').fill(INCORRECT_PASSWORD);

  await page.getByRole('button', { name: 'SIGN IN' }).click();

  // Assert that we're still on the login page
  await expect(page).toHaveURL(`${process.env.BASE_URL}/${process.env.LOGIN_PATH}`);

  // Check for an error message
  const errorMessage = await page.getByText('Username or password is invalid');
  await expect(errorMessage).toBeVisible();
});

test('should fail login with non-existent username', async ({ page }) => {
  const nonExistentUsername = 'nonexistent_user_' + Date.now();

  await page.goto(`${process.env.BASE_URL}/${process.env.LOGIN_PATH}`);

  await page.getByRole('textbox', { name: 'Username' }).fill(nonExistentUsername);
  await page.locator('#password').fill(TEST_PASSWORD);

  await page.getByRole('button', { name: 'SIGN IN' }).click();

  // Assert that we're still on the login page
  await expect(page).toHaveURL(`${process.env.BASE_URL}/${process.env.LOGIN_PATH}`);

  // Check for an error message
  const errorMessage = await page.getByText('Username or password is invalid');
  await expect(errorMessage).toBeVisible();
});

test('should fail login with empty username', async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}/${process.env.LOGIN_PATH}`);

  await page.locator('#password').fill(TEST_PASSWORD);

  // Assert that we're still on the login page
  await expect(page).toHaveURL(`${process.env.BASE_URL}/${process.env.LOGIN_PATH}`);

  // Check for an error message
  const errorMessage = await page.getByText('Username is required');
  await expect(errorMessage).toBeVisible();
});

test('should fail login with 3 char password', async ({ page }) => {
  const user = await getRandomUser();

  await page.goto(`${process.env.BASE_URL}/${process.env.LOGIN_PATH}`);
  await page.locator('#password').fill(SHORT_PASSWORD);
  await page.getByRole('textbox', { name: 'Username' }).fill(user.username);

  await expect(page).toHaveURL(`${process.env.BASE_URL}/${process.env.LOGIN_PATH}`);

  // Check for an error message
  const errorMessage = await page.getByText('Password must contain at least 4 characters');
  await expect(errorMessage).toBeVisible();
});