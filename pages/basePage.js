const webdriver = require("selenium-webdriver");
const until = require("selenium-webdriver");

const driver = new webdriver.Builder().forBrowser("chrome").build();
driver.manage().setTimeouts({ implicit: 5000 });
driver.manage().window().maximize();

class BasePage {
  constructor() {
    global.driver = driver;
    this.driver = driver;
  }

  async goToUrl(theURL) {
    await this.driver.get(theURL);
  }

  async findElementByLocator(locator) {
    return this.driver.findElement(locator);
  }

  async findElementsByLocator(locator) {
    return this.driver.findElements(locator);
  }

  async clickByLocator(locator) {
    await this.driver.findElement(locator).click();
  }

  async retryClickByLocator(locator) {
    await this.driver.findElement(locator).click();
  }

  async waitForElementIsLocated(locator) {
    await this.driver.wait(webdriver.until.elementLocated(locator), 10000);
  }

  async waitForElementIsVisible(element) {
    await this.driver.wait(webdriver.until.elementIsVisible(element), 5000);
  }

  async waitForElementIsEnabled(element) {
    await this.driver.wait(webdriver.until.elementIsEnabled(element), 5000);
  }

  async waitForElementIsStaleness(element) {
    await this.driver.wait(webdriver.until.stalenessOf(element), 5000);
  }

  async waitForElementIsNotVisible(element) {
    await this.driver.wait(webdriver.until.elementIsNotVisible(element), 5000);
  }

  async clickElementWithWait(locator) {
    for (let j = 0; j < 5; j += 1) {
      try {
        const dateElement = await this.findElementByLocator(locator);
        await dateElement.click();
        return;
      } catch (StaleElementReferenceError) {
        console.error(`Element not found: ${locator}`);
      }
    }
    throw new Error(`Element not found for ${locator}`);
  }

  async scrollToElement(element) {
    // TODO: review this solution
    this.driver.executeScript("arguments[0].scrollIntoView(true);", element);
    await new Promise((r) => setTimeout(r, 1000));
  }

  async closeBrowser() {
    await this.driver.quit();
  }
}

module.exports = BasePage;
