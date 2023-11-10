const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class ExtrasPage extends BasePage {
  constructor() {
    super();
    this.continueAirportAndTripLoc = By.css("button.airport-and-flight__cta");
    this.continueTransportLoc = By.css("button.transport__cta");
  }

  async selectContinueForAirportAndTrip() {
    await this.scrollToBottom();
    await this.clickByLocator(this.continueAirportAndTripLoc);
  }

  async selectContinueForTransport() {
    await this.scrollToBottom();
    await this.clickByLocator(this.continueTransportLoc);
  }
}

module.exports = new ExtrasPage();
