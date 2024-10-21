import { test, expect,  type Page  } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const LOGIN_PATH = '/signin';
const SIGN_UP_PATH = '/signup';

test.describe('Login Page', () => {

  let page: Page;

  //Turi būti pirmas testas, nes atidaro puslapį
  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(`${BASE_URL}${LOGIN_PATH}`);
  });

  test('should have correct title and elements', async () => {
    // Puslapio titulas
    await expect(page).toHaveTitle('Cypress Real World App');

    // Patikrinti ar yra image gal geriau?
   // await expect(page.getByText('Real World App')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel('Remember me')).toBeVisible();
    await expect(page.getByRole('button', { name: 'SIGN IN' })).toBeVisible();
    await expect(page.getByText("Don't have an account? Sign Up")).toBeVisible();
  });

  test('should focus username field on page load', async () => {
    await expect(page.getByLabel('Username')).toBeFocused();
  });

  test('should have accessible form labels', async () => {
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel('Remember me')).toBeVisible();
  });

  test('should maintain form state on page reload', async () => {
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Password').fill('testpassword');
    await page.getByLabel('Remember me').check();

    await page.reload();

    await expect(page.getByLabel('Username')).toHaveValue('testuser');
    await expect(page.getByLabel('Password')).toHaveValue('testpassword');
    await expect(page.getByLabel('Remember me')).toBeChecked();
  });


  test('should be able to input username and password', async () => {
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Password').fill('testpassword');

    await expect(page.getByLabel('Username')).toHaveValue('testuser');
    await expect(page.getByLabel('Password')).toHaveValue('testpassword');
  });
/*
  test('should toggle remember me checkbox', async () => {
    const rememberMeCheckbox = page.getByLabel('Remember me');
    await expect(rememberMeCheckbox).not.toBeChecked();
    //Geriau naudoti click negu check() jei custom-styled or controlled by Javascript
    await rememberMeCheckbox.click();
    if (!(await rememberMeCheckbox.isChecked())) {
      await rememberMeCheckbox.click({ force: true });
    }
    
    if (!(await rememberMeCheckbox.isChecked())) {
      await page.evaluate(() => {
        const checkbox = document.querySelector('input[name="remember"]') as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = true;
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }

    await expect(rememberMeCheckbox).toBeChecked();
    await rememberMeCheckbox.click();
    await expect(rememberMeCheckbox).not.toBeChecked();
  });
*/
//#region Sign In Button 

  test('sign in button should have correct text', async () => {
    const signInButton = page.getByRole('button', { name: 'SIGN IN' });
    await expect(signInButton).toHaveText('Sign In');
  });

  test('should prevent form submission when fields are empty', async () => {
    const signInButton = page.getByRole('button', { name: 'SIGN IN' });
    
    // Try to click the button when fields are empty
    await signInButton.click();
    
    // Check if we're still on the login page (i.e., form submission was prevented)
    await expect(page).toHaveURL(`${BASE_URL}${LOGIN_PATH}`);

    // Fill in only the username
    await page.getByLabel('Username').fill('someuser');
    await signInButton.click();
    await expect(page).toHaveURL(`${BASE_URL}${LOGIN_PATH}`);

    // Clear username and fill in only the password
    await page.getByLabel('Username').clear();
    await page.getByLabel('Password').fill('somepassword');
    await signInButton.click();
    await expect(page).toHaveURL(`${BASE_URL}${LOGIN_PATH}`);

    // Fill in both fields
    await page.getByLabel('Username').fill('someuser');
    await signInButton.click();
  });
  //#endregion
});