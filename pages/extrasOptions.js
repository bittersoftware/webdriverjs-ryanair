const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class ExtrasPage extends BasePage {
  constructor() {
    super();

    this.elements = {
      continueAirportAndTripLoc: By.css("button.airport-and-flight__cta"),
      continueTransportLoc: By.css("button.transport__cta"),
    };
  }

  /**
   * Selects Continue Button in 1/2 Extras options
   * 1: Airport And Trip option
   * @returns {undefined}
   */
  async selectContinueForAirportAndTrip() {
    this.scrollToBottomOfPage();
    await this.waitForElementIsLocated(this.elements.continueAirportAndTripLoc);
    await this.clickByLocatorWithRetry(this.elements.continueAirportAndTripLoc);
  }

  /**
   * Selects Continue Button in 2/2 Extras options
   * 1: Airport And Transport option
   * @returns {undefined}
   */
  async selectContinueForTransport() {
    this.scrollToBottomOfPage();
    await this.waitForElementIsLocated(this.elements.continueTransportLoc);
    await this.clickByLocatorWithRetry(this.elements.continueTransportLoc);
  }
}

module.exports = new ExtrasPage();
