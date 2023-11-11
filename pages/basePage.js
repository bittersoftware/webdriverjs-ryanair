const webdriver = require("selenium-webdriver");

const driver = new webdriver.Builder().forBrowser("chrome").build();
driver.manage().setTimeouts({ implicit: 10000 });
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
    await this.driver.wait(webdriver.until.elementIsVisible(element), 10000);
  }

  async waitForElementIsEnabled(element) {
    await this.driver.wait(webdriver.until.elementIsEnabled(element), 10000);
  }

  async waitForElementIsStaleness(element) {
    await this.driver.wait(webdriver.until.stalenessOf(element), 10000);
  }

  async waitForElementIsNotVisible(element) {
    await this.driver.wait(webdriver.until.elementIsNotVisible(element), 10000);
  }

  async clickElementWithWait(locator) {
    for (let i = 0; i < 5; i += 1) {
      try {
        const dateElement = await this.findElementByLocator(locator);
        await dateElement.click();
        return;
      } catch (StaleElementReferenceError) {
        console.info(`Element not found in try ${i}: ${locator}`);
      }
    }
    throw new Error(`Element not found for ${locator}`);
  }

  async clickElementWithJavaScriptExec(element) {
    await this.driver.executeScript("arguments[0].click();", element);
  }

  async scrollToElement(element) {
    this.driver.executeScript("arguments[0].scrollIntoView(true);", element);
    await this.driver.sleep(1000);
  }

  async scrollToBottom() {
    this.driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    await this.driver.sleep(1000);
  }

  async waitForPageToLoad(timeOutInSeconds) {
    const startTime = Date.now();
    let documentReadyState;

    while (
      documentReadyState !== "complete" &&
      Date.now() - startTime < timeOutInSeconds * 1000
    ) {
      try {
        documentReadyState = await driver.executeScript(
          "return document.readyState"
        );

        // Wait for a short interval before checking again
        this.driver.sleep(500);
      } catch (error) {
        throw new Error(
          `Error while waiting for page to load: ${error.message}`
        );
      }
    }

    if (documentReadyState !== "complete") {
      throw new Error(
        `Timeout waiting for page to load within ${timeOutInSeconds} seconds`
      );
    }
  }

  async closeBrowser() {
    await this.driver.quit();
  }
}

module.exports = BasePage;
