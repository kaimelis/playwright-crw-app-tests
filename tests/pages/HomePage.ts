import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private selectors = {
    userName: '[data-test="sidenav-username"]',
    userFullName: '[data-test="sidenav-user-full-name"]',
    accountBalance: '[data-test="sidenav-user-balance"]',
    // Add navigation selectors
    homeNav: '[data-test="sidenav-home"]',
    userSettingsNav: '[data-test="sidenav-user-settings"]',
    bankAccountsNav: '[data-test="sidenav-bankaccounts"]',
    notificationsNav: '[data-test="sidenav-notifications"]',
    signOutNav: '[data-test="sidenav-signout"]'
  };

  constructor(page: Page) {
    super(page);
  }

  getUserName(): Locator {
    return this.page.locator(this.selectors.userName);
  }

  getUserFullName(): Locator {
    return this.page.locator(this.selectors.userFullName);
  }

  getAccountBalance(): Locator {
    return this.page.locator(this.selectors.accountBalance);
  }

  // Navigation methods
  getHomeNav(): Locator {
    return this.page.locator(this.selectors.homeNav);
  }

  getUserSettingsNav(): Locator {
    return this.page.locator(this.selectors.userSettingsNav);
  }

  getBankAccountsNav(): Locator {
    return this.page.locator(this.selectors.bankAccountsNav);
  }

  getNotificationsNav(): Locator {
    return this.page.locator(this.selectors.notificationsNav);
  }

  getSignOutNav(): Locator {
    return this.page.locator(this.selectors.signOutNav);
  }

  async navigate() {
    await this.page.goto(process.env.BASE_URL || 'http://localhost:3000');
  }

  async clickTab(tabName: 'everyone' | 'friends' | 'mine') {
    const tabMap = {
      everyone: 'EVERYONE',
      friends: 'FRIENDS',
      mine: 'MINE'
    };
    await this.page.getByRole('button', { name: tabMap[tabName] }).click();
  }

  // Transaction Methods
  getFirstTransaction() {
    const container = this.page.locator('[data-testid="transaction-item"]').first();
    
    return {
      getContainer: () => container,
      getUserAvatar: () => container.locator('[data-testid="user-avatar"]'),
      getAmount: () => container.locator('[data-testid="transaction-amount"]'),
      getDescription: () => container.locator('[data-testid="transaction-description"]')
    };
  }
}