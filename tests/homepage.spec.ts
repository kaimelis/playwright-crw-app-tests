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

  test.beforeEach(async ({ page, loginPage, homePage }) => {
    loggedInUser = await getRandomUser();
    await loginPage.navigate();
    await page.waitForLoadState('networkidle');
    await loginPage.login(loggedInUser.username, TEST_PASSWORD);

    await page.waitForNavigation();
    await homePage.waitForPageLoad();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(process.env.BASE_URL);
    await expect(homePage.getUserName()).toBeVisible();
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

  test('should verify side navigation functionality', async ({ page, homePage }) => {
    // Define navigation items and their expected URLs
    const navigationItems = [
      { dataTest: 'sidenav-home', expectedUrl: '/' },
      { dataTest: 'sidenav-user-settings', expectedUrl: '/user/settings' },
      { dataTest: 'sidenav-bankaccounts', expectedUrl: '/bankaccounts' },
      { dataTest: 'sidenav-notifications', expectedUrl: '/notifications' }
    ];

    // Check if all navigation buttons are visible
    for (const item of navigationItems) {
      const navButton = page.locator(`[data-test="${item.dataTest}"]`);
      await expect(navButton).toBeVisible();
    }

    // Test each navigation item
    for (const item of navigationItems) {
      // Click the navigation item
      await page.locator(`[data-test="${item.dataTest}"]`).click();
      
      // Wait for navigation to complete
      await page.waitForLoadState('networkidle');
      
      // Verify URL
      const expectedFullUrl = `${process.env.BASE_URL}${item.expectedUrl}`;
      await expect(page).toHaveURL(expectedFullUrl);
    }

    // Test logout button separately since it has different behavior
    const logoutButton = page.locator('[data-test="sidenav-signout"]');
    await expect(logoutButton).toBeVisible();
    
    await logoutButton.click();
    await page.waitForLoadState('networkidle');
    
    // After logout, should redirect to signin page
    await expect(page).toHaveURL(`${process.env.BASE_URL}/signin`);
  });
});