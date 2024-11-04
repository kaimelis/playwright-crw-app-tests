import { test, expect, type Page } from '@playwright/test';
import { getRandomUser } from './utils/dbUtils';
import { LoginPage } from './pages/LoginPage';
import dotenv from 'dotenv';
dotenv.config();

const TEST_PASSWORD = process.env.PASSWORD;

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

test('should login successfully with database user credentials', async () => {
  const user = await getRandomUser();
  
  await loginPage.navigate();
  await loginPage.login(user.username, TEST_PASSWORD);

  // Assert successful login
  await expect(page).toHaveURL(`${process.env.BASE_URL}`);
  
  const logoutButton = await page.getByRole('button', { name: 'Logout' });
  await expect(logoutButton).toBeVisible();
});
/*
test('should fail login with incorrect password', async () => {
  const user = await getRandomUser();
  const incorrectPassword = 'incorrect_password';

  await loginPage.navigate();
  await loginPage.login(user.username, incorrectPassword);

  // Assert that we're still on the login page
  await expect(page).toHaveURL(`${process.env.BASE_URL}/${process.env.LOGIN_PATH}`);

  // Check for an error message
  const errorMessage = await loginPage.getErrorMessage();
  await expect(errorMessage).toBeVisible();
});

test('should fail login with non-existent username', async () => {
  const nonExistentUsername = 'nonexistent_user_' + Date.now();

  await loginPage.navigate();
  await loginPage.login(nonExistentUsername, TEST_PASSWORD);

  // Assert that we're still on the login page
  await expect(page).toHaveURL(`${process.env.BASE_URL}/${process.env.LOGIN_PATH}`);

  // Check for an error message
  const errorMessage = await loginPage.getErrorMessage();
  await expect(errorMessage).toBeVisible();
});
*/