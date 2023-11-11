const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class SelectFlights extends BasePage {
  constructor() {
    super();

    this.elements = {
      selectBtnLocator: By.css("button.flight-card-summary__select-btn"),
    };
  }

  /**
   * Selects flight from result list by index
   * @param {number} index
   * @returns {undefined}
   */
  async selectFlightByIndex(index) {
    const flights = await this.findElementsByLocator(
      this.elements.selectBtnLocator
    );
    await flights[index].click();
  }
}

module.exports = new SelectFlights();
