const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class ChooseFare extends BasePage {
  constructor() {
    super();
    this.bla = By.xpath("//td[@data-ref='benefit-bags']/following-sibling::td");
    this.fares = By.css("th.fare-table__fare-column");
  }

  async selectCheckInBagFareByIndex(index) {
    const faresElements = await this.findElementsByLocator(this.bla);

    const faresIndexWithCheckInBag = [];

    for (let i = 0; i < faresElements.length; i += 1) {
      if ((await faresElements[i].getAttribute("aria-label")) === "Included") {
        faresIndexWithCheckInBag.push(i);
      }
    }

    const faresColumns = await this.findElementsByLocator(this.fares);
    faresColumns[faresIndexWithCheckInBag[index]].click();
  }
}

module.exports = new ChooseFare();
