const webdriver = require("selenium-webdriver");
const { WebElement, By } = require("selenium-webdriver");

const driver = new webdriver.Builder().forBrowser("chrome").build();
// driver.manage().setTimeouts({ implicit: 10000 });
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
   * Set implicit timeout for the driver to 20 seconds
   */
  #setDefaultImplicitTimeout = async () => {
    await this.driver.manage().setTimeouts({ implicit: 20000 });
  };

  /**
   * Find WebElement by locator
   * @param {By} locator
   * @returns {WebElement}
   */
  async findElementByLocator(locator) {
    return this.driver.findElement(locator);
  }

  /**
   * Find WebElements by locator
   * @param {By} locator
   * @returns {WebElement[]}
   */
  async findElementsByLocator(locator) {
    return this.driver.findElements(locator);
  }

  // async clickByLocator(locator) {
  //   await this.driver.findElement(locator).click();
  // }

  // async retryClickByLocator(locator) {
  //   await this.driver.findElement(locator).click();
  // }

  async waitForElementIsLocated(locator, time = 10000) {
    await this.driver.wait(webdriver.until.elementLocated(locator), time);
  }

  // async waitForElementIsVisible(element, time = 10000) {
  //   await this.driver.wait(webdriver.until.elementIsVisible(element), time);
  // }

  async waitForElementIsEnabled(element, time = 1000) {
    await this.driver.wait(webdriver.until.elementIsEnabled(element), time);
  }

  /**
   * Fetch WebElement.
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
   * This method waits for element to be visible for the given time
   *
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
   * This method will set implicit timeout for the driver
   *
   * @param {number} time delay value in seconds
   */
  #setImplicitTimeout = async (time) => {
    await this.driver.manage().setTimeouts({ implicit: time * 1000 });
  };

  /**
   * To click on the web element
   *
   * @param {By|WebElement} locator
   * @param {number} time Delay value in seconds . Default value is 20 seconds
   */
  async clickByLocator(locator, time = 20) {
    // Set an implicit timeout for the action
    await this.#setImplicitTimeout(time);

    // Fetch the element using the provided locator
    const element = await this.#elementFetcher(locator);

    try {
      // Attempt to directly click the element
      await element.click();
    } catch (e) {
      // If direct click fails, execute a click using JavaScript
      await this.driver.executeScript(`(arguments[0]).click();`, element);
    }

    // Reset the implicit timeout to the default value
    await this.#setDefaultImplicitTimeout();
  }

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
   * This method returns element text
   *
   * @param {*} locator Object, i.e.  { xpath: "//*[@id='Any']" } or WebElement
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
   * @returns {undefined}
   */
  async scrollToElement(element, wait = 1000) {
    this.driver.executeScript("arguments[0].scrollIntoView(true);", element);
    await this.driver.sleep(wait);
  }

  /**
   * Scroll to bottom of the page
   * @param {number} wait=1000
   * @returns {undefined}
   */
  async scrollToBottom(wait = 1000) {
    this.driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    await this.driver.sleep(wait);
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
