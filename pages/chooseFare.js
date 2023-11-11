const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class ChooseFare extends BasePage {
  constructor() {
    super();
    this.fareColsLoc = By.css("th.fare-table__fare-column");
    this.fareNamesLoc = By.css("span.fare-header__name");
    this.continueButtonLoc = By.xpath(
      "//ry-spinner[contains(text(), 'Continue')]"
    );
    this.switchToRegularButtonLoc = By.xpath(
      "//ry-spinner[contains(text(), 'Switch')]"
    );
  }

  async selectCheckInBagFareByIndex(fareName) {
    const fareNames = await this.findElementsByLocator(this.fareNamesLoc);
    const faresColumns = await this.findElementsByLocator(this.fareColsLoc);

    for (let i = 0; i < fareNames.length; i++) {
      if ((await fareNames[i].getText()) === fareName) {
        await faresColumns[i].click();
        return;
      }
    }

    throw new Error(`Fare not found ${fareName}`);
  }

  async selectContinueWithBasic() {
    const buttonContinueWithBasicEl = await this.findElementByLocator(
      this.continueSwitchButtonsLoc
    );
    await buttonContinueWithBasicEl.click();
  }

  async selectSwitchToRegular() {
    const buttonSwitchToRegularEl = await this.findElementByLocator(
      this.switchToRegularButtonLoc
    );
    await this.clickElementWithJavaScriptExec(buttonSwitchToRegularEl);
    // await this.clickElementWithWait(this.switchToRegularButtonLoc);
  }
}

module.exports = new ChooseFare();
