const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class ChooseFare extends BasePage {
  constructor() {
    super();
    // this.checkInBagFares = By.css("td[data-ref='benefit-bags'] icon[iconid='glyphs/tick']");
    this.checkInBagFares = By.css("td[data-ref='benefit-bags']");
    this.fares = By.css("tr.fare-table__benefit-row");
    this.checkIcon = By.css("icon.fare-table__benefit-icon");
  }

  async selectCheckInBagFareByIndex(index) {
    const faresElements = await this.findElementsByLocator(this.fares);
    let checkInFaresElements;

    for (let i = 0; i < faresElements.length; i += 1) {
      try {
        const checkInBagElement = await faresElements[i].findElement(
          this.checkInBagFares
        );

        if (checkInBagElement) {
          checkInFaresElements = await faresElements[i].findElements(
            this.checkIcon
          );
          break;
        }
      } catch (NoSuchElementError) {
        console.error("bla");
      }
    }

    if (checkInFaresElements) {
      const checkInBagFareElement = checkInFaresElements[index];
      await this.scrollToElement(checkInBagFareElement);
      await checkInBagFareElement.click();
    } else {
      throw new Error("Fare not found");
    }
  }
}

module.exports = new ChooseFare();
