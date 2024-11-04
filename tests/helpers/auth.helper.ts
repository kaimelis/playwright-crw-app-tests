import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { getRandomUser } from '../utils/dbUtils';
import dotenv from 'dotenv';

dotenv.config();
const TEST_PASSWORD = process.env.PASSWORD;

if (!TEST_PASSWORD) {
  throw new Error('TEST_PASSWORD environment variable is not set');
}

export async function loginWithRandomUser(page: Page) {
  const password: string = TEST_PASSWORD;
  const loginPage = new LoginPage(page);
  const user = await getRandomUser();
  await loginPage.navigate();
  await loginPage.login(user.username, password);
  
  return user;
}