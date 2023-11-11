const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class FastTrackPage extends BasePage {
  constructor() {
    super();
    this.noThanksLoc = By.css(
      "button.enhanced-takeover-beta__product-dismiss-cta"
    );
  }

  async selectNoThanks() {
    await this.clickByLocator(this.noThanksLoc);
    // await this.driver.sleep(5);
  }
}

module.exports = new FastTrackPage();
