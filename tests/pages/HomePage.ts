import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private selectors = {
    logoutButton: 'Logout'
  };

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await super.navigate('');
  }

  async getLogoutButton() {
    return this.page.getByRole('button', { name: this.selectors.logoutButton });
  }

  async logout() {
    await this.clickButton(this.selectors.logoutButton);
  }
}