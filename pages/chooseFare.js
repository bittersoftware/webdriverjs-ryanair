const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class ChooseFare extends BasePage {
  constructor() {
    super();
    this.checkIn20KgLuggage = By.xpath(
      "//td[@data-ref='benefit-bags']/following-sibling::td"
    );
    this.fares = By.css("th.fare-table__fare-column");
  }

  async selectCheckInBagFareByIndex(weight, index) {
    // Luggage type:
    let luggageLocator;

    if (weight === 20) {
      luggageLocator = this.checkIn20KgLuggage;
    } else {
      throw new Error(`Implement locator for luggage type: ${weight}`);
    }

    const faresElements = await this.findElementsByLocator(luggageLocator);
    const faresIndexWithCheckInBag = [];

    for (let i = 0; i < faresElements.length; i += 1) {
      if ((await faresElements[i].getAttribute("aria-label")) === "Included") {
        faresIndexWithCheckInBag.push(i);
      }
    }

    const faresColumns = await this.findElementsByLocator(this.fares);
    await faresColumns[faresIndexWithCheckInBag[index]].click();
  }
}

module.exports = new ChooseFare();
