### Ryanair - Anonymous user flight search CUJ with Webdriver js

Hey there, I am Thiago Bittencourt and here you will find some information about this project.

## Tooling

This project implements an automation of a use case for searching a flight as anonymous user inside Ryanair webpage.

For that we use Selenium with [WebDriverJS](https://www.selenium.dev/selenium/docs/api/javascript/index.html) for web automation, [CucumberJS](https://cucumber.io/docs/installation/javascript/) for BDD and [AllureJS](https://github.com/allure-framework/allure-js) for reporting.

## Setup

Clone the repository and install dependencies.

```
npm install
```

Test Setup can be found in `config/testSettings.js`.

Define `baseUrl` and `browser` either by setting environment variables or using default

| env var     |                        value                        |
| ----------- | :-------------------------------------------------: |
| RYANAIR_URL |         url for the environemtn to be tests         |
| WEBDRIVER   | target webdriver to run test: "chrome" or "firefox" |

Test settings parameters and default values:

```
baseUrl: process.env.RYANAIR_URL || "https://www.ryanair.com/ie/en",
browser: process.env.WEBDRIVER || "chrome", // "chrome" or "firefox"
language: "eng",
```

## Run tests

It will use `cucumber-js` to run the tests

```
npm test
```

## Generate Reports

### Alure Reports

After test run is finished, test result will be stored in `allure-results` directory.
Generate allure reports using `allure-cli`. This will create/update `allure-report` directory with the html report.

```
npx allure generate allure-results --clean -o allure-report
```

Access `allure-report` directory, serve the report with `http-serve` and open the local server url.

```
cd allure-report
npx http-server
```

### CucumberJS Reports

CucumberJS also provides reports.

1. Setup environment variable: export CUCUMBER_PUBLISH_ENABLED=true
2. Access [Cucumber Reports](https://reports.cucumber.io/)
3. Login with GitHub
4. Create a collection
5. Get the `CUCUMBER_PUBLISH_TOKEN` provided in the webpage
6. Create a `CUCUMBER_PUBLISH_TOKEN` virtual environment with given token as value.
7. All tests run will be automatically published

See example [here](https://reports.cucumber.io/reports/3b1fd8aa-6fb2-451c-9be5-68e901dfea2e)

## Framework Structure

- `config`: configuration files for cucumberJS, Allure reports and test settings.
- `data:` Dataset to be used by the page objects. In this case it has the airport names. This would come from a data base or similar.
- `features`: feature files for the test cases in BDD.
  - `stepsDefinition`: implementation of BDD steps
  - `support`: parameter types for cucumber js
- `pages`: Page objects. Locators defined in `this.elements` and methods for actions in each page
  - `basePage`: Base methods to interact with driver
- `utils`: helper functions to manipulate data

## Disclaimer

- This code was developed and tested in macOS Ventura 13.6 (Darwin) in which is more stable. I also ran in Ubuntu 22.04 LTS after wrapping up everything, but it was not as stable as in macOS. Unfortunately I did not have time to fix and make it all compatible.
- I have marked the places I would like to improve the solution with `TODO:` comments.
