const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class BagsSelectionPage extends BasePage {
  constructor() {
    super();
    this.smallBagLoc = By.css(
      "ry-radio-circle-button[data-at='outbound-all-SBAG-add']"
    );
    this.checkInBagForAllLoc = By.css("span.add-for-all");
    this.continueButtonLoc = By.css("button[data-ref='bags-continue-button']");
    this.checkInBagTableLoc = By.css("div[data-ref='checkin-bag-expanded']");
  }

  async selectSmallBag() {
    await this.waitForElementIsLocated(this.smallBagLoc);
    const smallBagEl = this.findElementByLocator(this.smallBagLoc);
    this.driver.actions().move(smallBagEl);
    await this.clickElementWithWait(this.smallBagLoc);
  }

  async selectCheckInBagsForAll(weight) {
    const checkInBagTableEl = await this.findElementByLocator(
      this.checkInBagTableLoc
    );
    await this.scrollToElement(checkInBagTableEl);

    const selectForAllPaxEls = await this.findElementsByLocator(
      this.checkInBagForAllLoc
    );

    if (weight === 10) {
      await selectForAllPaxEls[0].click();
    } else if (weight === 20) {
      await selectForAllPaxEls[1].click();
    } else {
      throw new Error(`Weight invalid: ${weight}`);
    }
  }

  async selectContinue() {
    await this.scrollToBottom();
    await this.clickElementWithWait(this.continueButtonLoc);
  }
}

module.exports = new BagsSelectionPage();
