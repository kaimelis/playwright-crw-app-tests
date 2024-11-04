import { test, expect, type Page } from '@playwright/test';
import { getRandomUser } from './utils/dbUtils';
import { LoginPage } from './pages/LoginPage';
import dotenv from 'dotenv';
dotenv.config();

const TEST_PASSWORD = process.env.PASSWORD;
const INCORRECT_PASSWORD = 'incorrect_password';
const SHORT_PASSWORD = '123';

if (!TEST_PASSWORD) {
  throw new Error('TEST_PASSWORD environment variable is not set');
}

let page: Page;
let loginPage: LoginPage;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  loginPage = new LoginPage(page);
});

test.afterEach(async () => {
  await page.close();
});

test('should fail login with incorrect password', async () => {
  const user = await getRandomUser();

  await loginPage.navigate();
  await loginPage.login(user.username, INCORRECT_PASSWORD);

  // Assert that we're still on the login page
  await expect(loginPage.isOnPage(process.env.LOGIN_PATH || '')).toBeTruthy();

  // Check for an error message
  const errorMessage = await loginPage.getErrorMessage();
  await expect(errorMessage).toBeVisible();
});

test('should fail login with non-existent username', async () => {
  const nonExistentUsername = 'nonexistent_user_' + Date.now();

  await loginPage.navigate();
  await loginPage.login(nonExistentUsername, TEST_PASSWORD);

  // Assert that we're still on the login page
  await expect(loginPage.isOnPage(process.env.LOGIN_PATH || '')).toBeTruthy();

  // Check for an error message
  const errorMessage = await loginPage.getErrorMessage();
  await expect(errorMessage).toBeVisible();
});

test('should fail login with empty username', async () => {
  await loginPage.navigate();

   await loginPage.fillUsername('');
   await loginPage.fillPassword(TEST_PASSWORD);
   
   await loginPage.fillPassword(TEST_PASSWORD);
 
   await expect(loginPage.isOnPage(process.env.LOGIN_PATH || '')).toBeTruthy();
 
   const errorMessage = await loginPage.getValidationError('Username is required');
   await expect(errorMessage).toBeVisible();
});

test('should fail login with short password', async () => {
  const user = await getRandomUser();

  await loginPage.navigate();

  await loginPage.fillUsername(user.username);
  await loginPage.fillPassword(SHORT_PASSWORD);
  
  await loginPage.fillUsername(user.username);

  await expect(loginPage.isOnPage(process.env.LOGIN_PATH || '')).toBeTruthy();

  const errorMessage = await loginPage.getValidationError('Password must contain at least 4 characters');
  await expect(errorMessage).toBeVisible();
});