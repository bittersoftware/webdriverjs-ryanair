const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class ExtrasPage extends BasePage {
  constructor() {
    super();
    this.continueAirportAndTripLoc = By.css("button.airport-and-flight__cta");
    this.continueTransportLoc = By.css("button.transport__cta");
  }

  async selectContinueForAirportAndTrip() {
    this.scrollToBottomOfPage();
    await this.waitForElementIsLocated(this.continueAirportAndTripLoc);
    await this.clickByLocatorWithRetry(this.continueAirportAndTripLoc);
  }

  async selectContinueForTransport() {
    this.scrollToBottomOfPage();
    await this.waitForElementIsLocated(this.continueTransportLoc);
    await this.clickByLocatorWithRetry(this.continueTransportLoc);
  }
}

module.exports = new ExtrasPage();
