# Playwright Tests for Cypress Real World App

This repository contains Playwright tests for the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app).

## Prerequisites

Before running the Playwright tests, make sure you have completed the following steps:

1. Install and set up the Cypress Real World App by following their [tutorial](https://github.com/cypress-io/cypress-realworld-app#getting-started).
2. Ensure you can run the Cypress Real World App successfully.

## Setup

To set up this project and run the Playwright tests, follow these steps:

1. Install Node.js (version 14 or later) and yarn if you haven't already.

2. Clone this repository:
   ```
   git clone <your-repository-url>
   cd <your-repository-name>
   ```

3. Install dependencies using yarn:
   ```
   yarn install
   ```

4. Install Playwright browsers:
   ```
   npx playwright install
   ```

## Running Tests

To run the Playwright tests:

```
yarn playwright test
```

This command will execute all Playwright tests in the project.

To run tests in a specific browser:

```
yarn playwright test --project=chromium
yarn playwright test --project=firefox
yarn playwright test --project=webkit
```

To run tests in debug mode:

```
yarn playwright test --debug
```

## Test Reports

After running the tests, you can view the HTML report:

```
yarn playwright show-report
```

## Contributing

If you'd like to contribute to this project, please fork the repository and submit a pull request.

## Issues

If you encounter any issues or have suggestions, please [open an issue](https://github.com/<your-username>/<your-repository-name>/issues) on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
