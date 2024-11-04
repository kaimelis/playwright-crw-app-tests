import { test as base, expect, type Page } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { getRandomUser } from './utils/dbUtils';
import dotenv from 'dotenv';

dotenv.config();

const TEST_PASSWORD = process.env.PASSWORD;

if (!TEST_PASSWORD) {
  throw new Error('TEST_PASSWORD environment variable is not set');
}

type TestFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
};

const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

test.describe('Homepage Tests', () => {
  let loggedInUser: Awaited<ReturnType<typeof getRandomUser>>;

  // Use serial mode to ensure tests run in order after login
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ loginPage, homePage }) => {
    // Only login if we haven't logged in yet
    if (!loggedInUser) {
      loggedInUser = await getRandomUser();
      await loginPage.navigate();
      await loginPage.login(loggedInUser.username, TEST_PASSWORD);
      await homePage.waitForPageLoad();
    }
  });

  test('should display correct username', async ({ homePage }) => {
    const usernameElement = homePage.getUserName();
    await expect(usernameElement).toBeVisible();
    await expect(usernameElement).toHaveText(`@${loggedInUser.username}`);

    const userFullNameElement = homePage.getUserFullName();
    await expect(userFullNameElement).toBeVisible();
    await expect(userFullNameElement).toHaveText(loggedInUser.firstName + " " + loggedInUser.lastName[0]);

    const balanceElement = homePage.getAccountBalance();
    await expect(balanceElement).toBeVisible();

    const dollarAmount = loggedInUser.balance / 100;
    const formattedBalance = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(dollarAmount);

    await expect(balanceElement).toHaveText(formattedBalance);
  });
});