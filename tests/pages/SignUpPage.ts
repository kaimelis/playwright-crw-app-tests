import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignUpPage extends BasePage {
  private selectors = {
    firstName: 'input[name="firstName"]',
    lastName: 'input[name="lastName"]',
    username: 'input[name="username"]',
    password: '#password',
    confirmPassword: 'input[name="confirmPassword"]',
    signUpButton: 'SIGN UP'
  };

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await super.navigate(process.env.SIGN_UP_PATH || '');
  }

  async fillFirstName(firstName: string) {
    await this.fillInput(this.selectors.firstName, firstName);
  }

  async fillLastName(lastName: string) {
    await this.fillInput(this.selectors.lastName, lastName);
  }

  async fillUsername(username: string) {
    await this.fillInput(this.selectors.username, username);
  }

  async fillPassword(password: string) {
    await this.fillInput(this.selectors.password, password);
  }

  async fillConfirmPassword(password: string) {
    await this.fillInput(this.selectors.confirmPassword, password);
  }

  async clickSignUp() {
    await this.clickButton(this.selectors.signUpButton);
  }

  async getValidationError(message: string) {

    const locators = [
      this.page.getByText(message, { exact: true }),
      this.page.locator('.error-message').filter({ hasText: message }),
      this.page.getByTestId('password-error').filter({ hasText: message }),
      this.page.locator('.MuiFormHelperText-root').filter({ hasText: message })
    ];

    for (const locator of locators) {
      if (await locator.count() > 0) {
        return locator;
      }
    }

    return locators[0];
  }

  async signUp(firstName: string, lastName: string, username: string, password: string) {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.fillConfirmPassword(password);
    await this.clickSignUp();
  }

  async fillSignUpForm(firstName: string, lastName: string, username: string, password: string) {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.fillConfirmPassword(password);
  }
}