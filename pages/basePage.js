const webdriver = require("selenium-webdriver");
// By used in jsdoc
// eslint-disable-next-line no-unused-vars
const { WebElement, By } = require("selenium-webdriver");
const parameters = require("../config/testSettings");

const driver = new webdriver.Builder()
  .forBrowser(parameters.parameters.browser)
  .build();
driver.manage().window().maximize();

class BasePage {
  constructor() {
    global.driver = driver;
    this.driver = driver;
    this.#setDefaultImplicitTimeout();
  }

  /**
   * Go to url
   * @param {string} theURL
   * @returns {undefined}
   */
  async goToUrl(theURL) {
    await this.driver.get(theURL);
  }

  /**
   * Sets implicit timeout for the driver to 10 seconds
   */
  #setDefaultImplicitTimeout = async () => {
    await this.driver.manage().setTimeouts({ implicit: 10000 });
  };

  /**
   * Finds WebElement by locator
   * @param {By} locator
   * @returns {WebElement}
   */
  async findElementByLocator(locator) {
    return this.driver.findElement(locator);
  }

  /**
   * Finds WebElements by locator
   * @param {By} locator
   * @returns {WebElement[]}
   */
  async findElementsByLocator(locator) {
    return this.driver.findElements(locator);
  }

  /**
   * Waits for WebElement is located
   * @param {By} locator
   * @param {number} time in seconds. Defaults to 10
   * @returns {WebElement}
   */
  async waitForElementIsLocated(locator, time = 10) {
    await this.driver.wait(
      webdriver.until.elementLocated(locator),
      time * 1000
    );
  }

  /**
   * Waits for WebElement is enabled
   * @param {By} locator
   * @param {number} time in seconds. Defaults to 10
   * @returns {WebElement}
   */
  async waitForElementIsEnabled(element, time = 10) {
    await this.driver.wait(
      webdriver.until.elementIsEnabled(element),
      time * 1000
    );
  }

  /**
   * Fetches WebElement.
   * Returns WebElement if locator is already a WebElement
   * Find WebElement if locator is a By locator
   * @param {By|WebElement} locator
   * @returns {WebElement}
   */
  #elementFetcher = async (locator) => {
    const element =
      (await locator) instanceof WebElement
        ? locator
        : this.findElementByLocator(locator);

    return element;
  };

  /**
   * Waits for element to be visible for the given time
   * @param {By|WebElement} locator
   * @param {number} time time delay value in seconds, 30.
   */
  async waitForElementIsVisible(locator, time = 30) {
    await this.driver.wait(
      webdriver.until.elementIsVisible(
        await this.#elementFetcher(locator),
        time * 1000
      )
    );
  }

  /**
   * Set implicit timeout for the driver
   * @param {number} time delay value in seconds
   */
  #setImplicitTimeout = async (time) => {
    await this.driver.manage().setTimeouts({ implicit: time * 1000 });
  };

  /**
   * Clicks on the WebElement
   * @param {By|WebElement} locator
   * @param {number} time Delay value in seconds . Default value is 20 seconds
   */
  async clickByLocator(locator, time = 20) {
    await this.#setImplicitTimeout(time);
    const element = await this.#elementFetcher(locator);

    try {
      await element.click();
    } catch (e) {
      // If direct click fails, execute a click using JavaScript
      await this.driver.executeScript(`(arguments[0]).click();`, element);
    }

    await this.#setDefaultImplicitTimeout();
  }

  /**
   * Retry click the button if element is stale
   * @param {By} locator
   * @param {number} retries defaults to 5
   * @returns {undefined}
   */
  async clickByLocatorWithRetry(locator, retries = 5) {
    for (let i = 0; i < retries; i += 1) {
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

  /**
   * Gets element text
   * @param {By|WebElement} locator
   * @param {number} time Delay value in seconds . Default value is 20 seconds
   * @returns {string} text value of the element
   */
  async getText(locator, time = 20) {
    await this.#setImplicitTimeout(time);
    const element = await this.#elementFetcher(locator);

    await this.#setDefaultImplicitTimeout();
    return element.getText();
  }

  /**
   * Scroll to WebElement
   * @param {WebElement} element
   * @param {number} wait time in seconds
   * @returns {undefined}
   */
  async scrollToElement(element, wait = 1) {
    this.driver.executeScript("arguments[0].scrollIntoView(true);", element);
    await this.driver.sleep(wait * 1000);
  }

  /**
   * Scrolls to the top of the page and wait
   * @param {number} wait time in seconds
   * @returns {undefined}
   */
  async scrollToTopOfPage(wait = 1) {
    await this.driver.executeScript(
      "window.scrollTo(document.body.scrollHeight, 0)"
    );
    await this.driver.sleep(wait * 1000);
  }

  /**
   * Scrolls to bottom of the page and wait
   * @param {number} wait time in seconds
   * @returns {undefined}
   */
  async scrollToBottomOfPage(wait = 1) {
    this.driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    await this.driver.sleep(wait * 1000);
  }

  /**
   * Close web browser for driver instance
   * @returns {undefined}
   */
  async closeBrowser() {
    await this.driver.quit();
  }
}

module.exports = BasePage;
