import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private selectors = {
    userName: '[data-test="sidenav-username"]',
    userFullName: '[data-test="sidenav-user-full-name"]',
    accountBalance: '[data-test="sidenav-user-balance"]',
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

  async navigate() {
    // Pass empty string for root route or just call goto with base URL
    await this.page.goto(process.env.BASE_URL || 'http://localhost:3000');
    // Or alternatively:
    // await super.navigate('');
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