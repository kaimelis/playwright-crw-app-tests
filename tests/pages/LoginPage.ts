import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private selectors = {
    username: 'input[name="username"]',
    password: '#password',
    signInButton: 'SIGN IN',
    errorMessage: 'Username or password is invalid',
    // Add form validation error selectors
    validationError: '.error-message', // Add the actual class/selector used for validation errors
    passwordValidationError: '[data-testid="password-error"]' // Add the actual test id or selector used
  };

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await super.navigate(process.env.LOGIN_PATH || '');
  }

  async fillUsername(username: string) {
    await this.fillInput(this.selectors.username, username);
  }

  async fillPassword(password: string) {
    await this.fillInput(this.selectors.password, password);
  }

  async clickSignIn() {
    await this.clickButton(this.selectors.signInButton);
  }

  async getErrorMessage() {
    return this.page.getByText(this.selectors.errorMessage);
  }

  // Add method for validation errors
  async getValidationError(message: string) {
    // Try different selectors that might contain the error message
    const locators = [
      this.page.getByText(message, { exact: true }),
      this.page.locator(this.selectors.validationError).filter({ hasText: message }),
      this.page.getByTestId('password-error').filter({ hasText: message }),
      // Add any other potential selectors that might contain the error
      this.page.locator('.MuiFormHelperText-root').filter({ hasText: message }) // If using Material-UI
    ];

    // Try each locator until we find one that exists
    for (const locator of locators) {
      if (await locator.count() > 0) {
        return locator;
      }
    }

    // If no matching error is found, return the first locator as fallback
    return locators[0];
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSignIn();
  }
}