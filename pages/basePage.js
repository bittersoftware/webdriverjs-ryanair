var webdriver = require('selenium-webdriver');
const { By } = require('selenium-webdriver');
var driver = new webdriver.Builder().forBrowser('chrome').build();
driver.manage().setTimeouts({ implicit: (10000) });
driver.manage().window().maximize();

class BasePage {
    constructor() {
        global.driver = driver;
    }

    async goToUrl(theURL) {
        await driver.get(theURL);
    }

    findElementByLocator(locator) {
        return driver.findElement(locator);
    }

    async findElementsByLocator(locator) {
        return await driver.findElements(locator);
    }

    async clickByLocator(locator) {
        await driver.findElement(locator).click();
    }

    async waitForElementIsVisible(element) {
        await driver.wait(webdriver.until.elementIsVisible(element), 2000);
    }

    async waitForElementIsNotVisible(element) {
        await driver.wait(webdriver.until.stalenessOf(element), 5000);
    }

    async closeBrowser() {
        await driver.quit();
    }
}

module.exports = BasePage;
