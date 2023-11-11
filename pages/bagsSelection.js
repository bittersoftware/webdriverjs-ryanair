const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class BagsSelectionPage extends BasePage {
  constructor() {
    super();

    this.elements = {
      smallBagLoc: By.css(
        "ry-radio-circle-button[data-at='outbound-all-SBAG-add']"
      ),
      checkInBagForAllLoc: By.css("span.add-for-all"),
      continueButtonLoc: By.css("button[data-ref='bags-continue-button']"),
      checkInBagTableLoc: By.css("div[data-ref='checkin-bag-expanded']"),
    };
  }

  /**
   * Selects small cabin bags - Under the seat
   * This option is already included in some flights
   * In this case, the radio button options is not displayed
   * If included (Element not found), skip this action
   * @returns {undefined}
   */
  async selectSmallBag() {
    try {
      await this.waitForElementIsLocated(this.elements.smallBagLoc, 3000);
      const smallBagEl = this.findElementByLocator(this.elements.smallBagLoc);
      this.driver.actions().move(smallBagEl);
      await this.clickElementWithWait(this.elements.smallBagLoc);
    } catch (TimeoutError) {
      console.info("bags already included");
    }
  }

  /**
   * Selects Check in Bags for all pax
   * There are two options: 10kg and 20kg for weight parameter
   * @param {number} weight
   * @returns {undefined}
   */
  async selectCheckInBagsForAll(weight) {
    await this.newWaitUntil(this.elements.checkInBagTableLoc);

    await this.scrollToElement(
      await this.findElementByLocator(this.elements.checkInBagTableLoc)
    );

    const selectForAllPaxEls = await this.findElementsByLocator(
      this.elements.checkInBagForAllLoc
    );

    await BagsSelectionPage.selectBagsPerWeight(weight, selectForAllPaxEls);
  }

  /**
   * Selects the correct element depending on the weight
   * Two WebElements expected for Select Bags For All Passengers
   * First one to 10kg option and second to 20kg option
   * @param {number} weight
   * @param {WebElement} selectForAllPaxEls
   * @returns {undefined}
   */
  static async selectBagsPerWeight(weight, selectForAllPaxEls) {
    if (!selectForAllPaxEls || selectForAllPaxEls.length !== 2) {
      throw new Error(`Invalid element: ${selectForAllPaxEls}`);
    }

    if (weight === 10) {
      await selectForAllPaxEls[0].click();
    } else if (weight === 20) {
      await selectForAllPaxEls[1].click();
    } else {
      throw new Error(`Weight invalid: ${weight}`);
    }
  }

  /**
   * Click on Continue button at the bottom of the page
   * Scroll to the bottom of the page before clicking
   * Although locator is found, sometimes clicking the button has no effect
   * Hard code wait so button can be clicked effectively
   * TODO: Diag button status to remove hard code sleep
   * @returns {undefined}
   */
  async selectContinue() {
    await this.scrollToBottom();
    await this.driver.sleep(3000);
    await this.newWaitUntil(this.elements.continueButtonLoc);
    await this.newClickByLocator(this.elements.continueButtonLoc);
  }
}

module.exports = new BagsSelectionPage();
