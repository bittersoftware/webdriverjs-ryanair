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
    try {
      await this.waitForElementIsLocated(this.smallBagLoc);
      const smallBagEl = this.findElementByLocator(this.smallBagLoc);
      this.driver.actions().move(smallBagEl);
      await this.clickElementWithWait(this.smallBagLoc);
    } catch (TimeoutError) {
      console.info("Bags already included");
    }
  }

  async selectCheckInBagsForAll(weight) {
    await this.driver.sleep(3000);
    const checkInBagTableEl = await this.findElementByLocator(
      this.checkInBagTableLoc
    );

    await this.waitForElementIsVisible(checkInBagTableEl);
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
    await this.driver.sleep(3000);
    await this.waitForPageToLoad(5);

    const continueButtonEl = await this.findElementByLocator(
      this.continueButtonLoc
    );
    this.driver.actions().move(continueButtonEl);

    await this.waitForElementIsEnabled(
      await this.findElementByLocator(this.continueButtonLoc)
    );

    await this.clickByLocator(this.continueButtonLoc);
  }
}

module.exports = new BagsSelectionPage();
