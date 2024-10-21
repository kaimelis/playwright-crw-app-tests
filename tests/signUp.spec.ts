import { test, expect,  type Page  } from '@playwright/test';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config();

const BASE_URL = process.env.BASE_URL;
const SIGN_UP_PATH = process.env.SIGN_UP_PATH;
const SIGN_IN_PATH = process.env.LOGIN_PATH;
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
    password: faker.internet.password({ length: 12, memorable: true })
  };
}

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto(`${BASE_URL}/signup`);
});

test.afterEach(async () => {
  await page.close();
});

test('should create a user and login successfully', async () => {
  // Generate a dynamic username
  const username = `testuser_${Date.now()}`;
  const user = createRandomUser();
  // Sign Up
  await page.getByRole('textbox', { name: 'First Name' }).fill(user.firstName);
  await page.getByRole('textbox', { name: 'Last Name' }).fill(user.lastName);
  await page.getByRole('textbox', { name: 'Username' }).fill(user.username);

  await page.locator('#password').fill(TEST_PASSWORD);
  await page.locator('input[name="confirmPassword"]').fill(TEST_PASSWORD);

  await page.getByRole('button', { name: 'SIGN UP' }).click();

  // Tikrinam, kad po SIGN UP button atsidarytu Sign In puslapis 
  await expect(page).toHaveURL(`${BASE_URL}/${SIGN_IN_PATH}`);

  // Einam i sign in puslapi
  await page.goto(`${BASE_URL}/${SIGN_IN_PATH}`);

  await page.getByRole('textbox', { name: 'Username' }).fill(user.username);
  await page.locator('#password').fill(TEST_PASSWORD);
  await page.getByRole('button', { name: 'SIGN IN' }).click();

  await expect(page).toHaveURL(`${BASE_URL}`);
  const logoutButton = await page.getByRole('button', { name: 'Logout' });
  await expect(logoutButton).toBeVisible();
});


