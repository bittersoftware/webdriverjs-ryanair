const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class NavBarPage extends BasePage {
  constructor() {
    super();

    this.elements = {
      totalPriceLoc: By.css("ry-basket-total"),
    };
  }

  /**
   * Gets total price text
   * @returns {string}
   */
  async getTotalPriceText() {
    const totalPriceEl = await this.findElementByLocator(
      this.elements.totalPriceLoc
    );
    const totalText = await totalPriceEl.getText();
    return totalText;
  }

  /**
   * Description
   * @param {any} initialPrice
   * @returns {any}
   */
  async waitForPriceToUpdate(initialPrice) {
    let currentPrice;

    for (let i = 0; i < 5; i++) {
      currentPrice = await this.getTotalPriceText();

      if (currentPrice !== initialPrice) {
        return;
      }
      await this.driver.sleep(1000);
    }

    throw new Error(`Text never changed: ${initialPrice}`);
  }
}

module.exports = new NavBarPage();
