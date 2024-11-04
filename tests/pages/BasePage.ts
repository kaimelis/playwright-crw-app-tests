import { Page } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string) {
    await this.page.goto(`${process.env.BASE_URL}/${path}`);
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async fillInput(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  async clickButton(selector: string) {
    await this.page.getByRole('button', { name: selector }).click();
  }

  async getErrorMessage(text: string) {
    return this.page.getByText(text);
  }

  async isOnPage(path: string) {
    return await this.page.url() === `${process.env.BASE_URL}/${path}`;
  }
}