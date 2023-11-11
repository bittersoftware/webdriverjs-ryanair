const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");
const generateRandomString = require("../utils/generateRandomStr");

class PassengerDetails extends BasePage {
  constructor() {
    super();
    this.elements = {
      loginLaterLoc: By.css("button.login-touchpoint__expansion-bar"),
      adultPaxCardLoc: By.css("div[data-ref*='pax-details__ADT']"),
      childrenPaxCardLoc: By.css("div[data-ref*='pax-details__CHD']"),
      dropDownTitleLoc: By.css("button.dropdown__toggle"),
      dropDownTitleOptionsLoc: By.css(
        "ry-dropdown-item[data-ref='title-item-INDEX']"
      ),
      paxAdtNameInputLoc: By.id("form.passengers.ADT-INDEX.name"),
      paxChdNameInputLoc: By.id("form.passengers.CHD-INDEX.name"),
      paxAdtLastNameInputLoc: By.id("form.passengers.ADT-INDEX.surname"),
      paxChdLastNameInputLoc: By.id("form.passengers.CHD-INDEX.surname"),
      continueButtonLoc: By.css("button.continue-flow__button"),
    };
  }

  /**
   * Selects Login Later button after selecting fares
   * @returns {undefined}
   */
  async selectLoginLater() {
    const loginLaterElement = await this.findElementByLocator(
      this.elements.loginLaterLoc
    );
    this.waitForElementIsLocated(this.elements.loginLaterLoc);
    this.waitForElementIsVisible(loginLaterElement);
    this.driver.actions().move(loginLaterElement);
    await loginLaterElement.click();
  }

  /**
   * Fill passenger details for all passenger using random data
   * Random title for adults
   * Random Name and Surename for all pax
   * @returns {undefined}
   */
  async fillPassengerDetails() {
    this.scrollToBottomOfPage();
    // Wait for component reload.
    // They may be another component reload and filled data is lost
    await this.driver.sleep(2000);

    // find adult pax
    await this.waitForElementIsVisible(this.elements.dropDownTitleLoc);
    const adultPaxElements = await this.findElementsByLocator(
      this.elements.adultPaxCardLoc
    );

    // fill adult details
    await this.#fillPaxDetails(
      adultPaxElements,
      this.elements.paxAdtNameInputLoc,
      this.elements.paxAdtLastNameInputLoc,
      true
    );

    // find children pax
    const childPaxElements = await this.findElementsByLocator(
      this.elements.childrenPaxCardLoc
    );

    // fill children details
    await this.#fillPaxDetails(
      childPaxElements,
      this.elements.paxChdNameInputLoc,
      this.elements.paxChdLastNameInputLoc,
      false
    );
  }

  /**
   * Finds all input fields and fill them with random data
   * Uses dynamic locators depending of the element index
   * @param {WebElement} paxCardEls
   * @param {By} nameLoc
   * @param {By} LastNameLoc
   * @param {boolean} isAdult
   * @returns {undefined}
   */
  async #fillPaxDetails(paxCardEls, nameLoc, LastNameLoc, isAdult) {
    let paxNameLoc;
    let paxLastNameLoc;
    let paxTitleLoc;

    for (let i = 0; i < paxCardEls.length; i += 1) {
      this.driver.actions().move(paxCardEls[i]);

      // Dynamic locators for each WebElement
      paxNameLoc = By.css(nameLoc.value.replace("INDEX", i));
      paxLastNameLoc = By.css(LastNameLoc.value.replace("INDEX", i));

      // Fill Name and Surname with random strings
      await paxCardEls[i]
        .findElement(paxNameLoc)
        .sendKeys(generateRandomString(5));
      await paxCardEls[i]
        .findElement(paxLastNameLoc)
        .sendKeys(generateRandomString(10));

      // If adult pax, select random title
      if (isAdult) {
        paxTitleLoc = By.css(
          this.elements.dropDownTitleOptionsLoc.value.replace(
            "INDEX",
            Math.floor(Math.random() * 3)
          )
        );
        await paxCardEls[i].findElement(this.elements.dropDownTitleLoc).click();
        await this.clickByLocator(paxTitleLoc);
      }
    }
  }

  /**
   * Selects continue button after scrolling to element
   * @returns {undefined}
   */
  async selectContinue() {
    const continueButtonEl = await this.findElementByLocator(
      this.elements.continueButtonLoc
    );
    await this.scrollToElement(continueButtonEl);
    await this.clickByLocator(this.elements.continueButtonLoc);
  }
}

module.exports = new PassengerDetails();
