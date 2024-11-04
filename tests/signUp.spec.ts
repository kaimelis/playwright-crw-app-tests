import { test, expect, type Page } from '@playwright/test';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';

dotenv.config();

const TEST_PASSWORD = process.env.PASSWORD;

if (!TEST_PASSWORD) {
  throw new Error('TEST_PASSWORD environment variable is not set');
}

function createRandomUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    firstName,
    lastName,
    username: faker.internet.userName({ firstName, lastName }),
  };
}

let page: Page;
let signUpPage: SignUpPage;
let loginPage: LoginPage;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  signUpPage = new SignUpPage(page);
  loginPage = new LoginPage(page);
});

test.afterEach(async () => {
  await page.close();
});

test('should create a user and login successfully', async () => {
  const user = createRandomUser();

  // Sign Up
  await signUpPage.navigate();
  await signUpPage.signUp(user.firstName, user.lastName, user.username, TEST_PASSWORD);

  // Check that we're redirected to the Sign In page
  await expect(page).toHaveURL(`${process.env.BASE_URL}/${process.env.LOGIN_PATH}`);

  // Sign In
  await loginPage.navigate();
  await loginPage.login(user.username, TEST_PASSWORD);

  // Check successful login
  await expect(page).toHaveURL(`${process.env.BASE_URL}`);
  const logoutButton = await page.getByRole('button', { name: 'Logout' });
  await expect(logoutButton).toBeVisible();
});

test('should fail signup with short password', async () => {
  const user = createRandomUser();
  const shortPassword = '123';

  await signUpPage.navigate();
  
  await signUpPage.fillFirstName(user.firstName);
  await signUpPage.fillLastName(user.lastName);
  await signUpPage.fillUsername(user.username);
  await signUpPage.fillPassword(shortPassword);
  
  await signUpPage.fillUsername(user.username);

  await expect(signUpPage.isOnPage(process.env.SIGN_UP_PATH || '')).toBeTruthy();

  const errorMessage = await signUpPage.getValidationError('Password must contain at least 4 characters');
  await expect(errorMessage).toBeVisible();
});