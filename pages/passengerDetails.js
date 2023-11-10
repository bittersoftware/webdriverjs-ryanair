const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");
const generateRandomString = require("../utils/generateRandomStr");

class PassengerDetails extends BasePage {
  constructor() {
    super();
    this.loginLaterLoc = By.css("button.login-touchpoint__expansion-bar");
    this.adultPaxCardLoc = By.css("div[data-ref*='pax-details__ADT']");
    this.childrenPaxCardLoc = By.css("div[data-ref*='pax-details__CHD']");
    this.dropDownTitleLoc = By.css("button.dropdown__toggle");
    this.dropDownTitleOptionsLoc = By.css(
      "ry-dropdown-item[data-ref='title-item-INDEX']"
    );
    this.paxAdtNameLoc = By.id("form.passengers.ADT-INDEX.name");
    this.paxChdNameLoc = By.id("form.passengers.CHD-INDEX.name");
    this.paxChdNameLoc = By.id("form.passengers.CHD-0.name");
    this.paxAdtLastNameLoc = By.id("form.passengers.ADT-INDEX.surname");
    this.paxChdLastNameLoc = By.id("form.passengers.CHD-INDEX.surname");
    this.continueButtonLoc = By.css("button.continue-flow__button");
  }

  async selectLoginLater() {
    const loginLaterElement = await this.findElementByLocator(
      this.loginLaterLoc
    );
    this.waitForElementIsLocated(this.loginLaterLoc);
    this.driver.actions().move(loginLaterElement);
    await loginLaterElement.click();
  }

  async fillPassengerDetails() {
    // find adult pax
    await this.waitForElementIsLocated(this.dropDownTitleLoc);
    const adultPaxElements = await this.findElementsByLocator(
      this.adultPaxCardLoc
    );

    await this.#fillPaxDetails(
      adultPaxElements,
      this.paxAdtNameLoc,
      this.paxAdtLastNameLoc,
      true
    );

    // find children pax
    const childPaxElements = await this.findElementsByLocator(
      this.childrenPaxCardLoc
    );

    await this.#fillPaxDetails(
      childPaxElements,
      this.paxChdNameLoc,
      this.paxChdLastNameLoc,
      false
    );
  }

  async #fillPaxDetails(paxCardEls, nameLoc, LastNameLoc, isAdult) {
    let paxNameLoc;
    let paxLastNameLoc;
    let paxTitleLoc;

    this.scrollToBottom();

    for (let i = 0; i < paxCardEls.length; i += 1) {
      this.driver.actions().move(paxCardEls[i]);

      paxNameLoc = By.css(nameLoc.value.replace("INDEX", i));
      paxLastNameLoc = By.css(LastNameLoc.value.replace("INDEX", i));

      await paxCardEls[i]
        .findElement(paxNameLoc)
        .sendKeys(generateRandomString(5));
      await paxCardEls[i]
        .findElement(paxLastNameLoc)
        .sendKeys(generateRandomString(10));

      if (isAdult) {
        paxTitleLoc = By.css(
          this.dropDownTitleOptionsLoc.value.replace(
            "INDEX",
            Math.floor(Math.random() * 3)
          )
        );
        await paxCardEls[i].findElement(this.dropDownTitleLoc).click();
        await this.clickElementWithWait(paxTitleLoc);
      }
    }
  }

  async selectContinue() {
    await this.driver.sleep(2000);
    const continueButtonEl = await this.findElementByLocator(
      this.continueButtonLoc
    );
    await this.scrollToElement(continueButtonEl);
    await this.clickByLocator(this.continueButtonLoc);
  }
}

module.exports = new PassengerDetails();
