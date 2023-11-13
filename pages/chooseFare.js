const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class ChooseFare extends BasePage {
  constructor() {
    super();

    this.elements = {
      fareColsLoc: By.css("th.fare-table__fare-column"),
      fareNamesLoc: By.css("span.fare-header__name"),
      continueButtonLoc: By.xpath("//ry-spinner[contains(text(), 'Continue')]"),
      switchToRegularButtonLoc: By.xpath(
        "//ry-spinner[contains(text(), 'Switch')]"
      ),
    };
  }

  /**
   * Clicks in the fare by the name passed as argument
   * Find fare elements. Each fare is a column in the fare table
   * It checks what column of fares contains the fare name
   * Clicks in the element index that title matches
   * fareName is the fare title. Ex: "BASIC"
   * @param {string} fareName
   * @returns {undefined}
   */
  async selectFareByName(fareName) {
    await this.waitForElementIsLocated(this.elements.fareNamesLoc);
    let fareNames = await this.findElementsByLocator(
      this.elements.fareNamesLoc
    );

    await this.scrollToElement(fareNames[0]);
    fareNames = await this.findElementsByLocator(this.elements.fareNamesLoc);

    const faresColumns = await this.findElementsByLocator(
      this.elements.fareColsLoc
    );
    await this.waitForElementIsNotStale(faresColumns[0]);

    for (let i = 0; i < fareNames.length; i++) {
      if ((await fareNames[i].getText()) === fareName) {
        await faresColumns[i].click();
        return;
      }
    }

    throw new Error(`Fare not found ${fareName}`);
  }

  /**
   * Clicks in Continue in confirm fare dialog
   * Some flights do not have basic fare available and error dialog is displayed
   * TODO: Fall back to switch to regular method if error dialog is displayed
   * @returns {undefined}
   */
  async selectContinueWithBasic() {
    const buttonContinueWithBasicEl = await this.findElementByLocator(
      this.elements.continueButtonLoc
    );
    await buttonContinueWithBasicEl.click();
  }

  /**
   * Clicks in Switch To Regular in confirm fare dialog
   * @returns {undefined}
   */
  async selectSwitchToRegular() {
    await this.waitForElementIsVisible(this.elements.switchToRegularButtonLoc);
    await this.clickByLocator(this.elements.switchToRegularButtonLoc);
  }
}

module.exports = new ChooseFare();
