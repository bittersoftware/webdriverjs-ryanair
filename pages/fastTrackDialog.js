const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class FastTrackPage extends BasePage {
  constructor() {
    super();

    this.elements = {
      noThanksLoc: By.css("button.enhanced-takeover-beta__product-dismiss-cta"),
    };
  }

  /**
   * Select "No, Thanks" option in Fast Track Dialog
   * @returns {undefined}
   */
  async selectNoThanks() {
    await this.clickByLocator(this.elements.noThanksLoc);
  }
}

module.exports = new FastTrackPage();
