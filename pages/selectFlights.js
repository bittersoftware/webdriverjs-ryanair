const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class SelectFlights extends BasePage {
  constructor() {
    super();
    this.selectBtnLocator = By.css("button.flight-card-summary__select-btn");
  }

  async selectFlightByIndex(index) {
    const flights = await this.findElementsByLocator(this.selectBtnLocator);
    await flights[index].click();
  }
}

module.exports = new SelectFlights();
