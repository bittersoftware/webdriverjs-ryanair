const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class CookiesPage extends BasePage {
  constructor() {
    super();
    this.elements = {
      popUpLoc: By.css("div.cookie-popup-with-overlay__box"),
      agreeLoc: By.css("button.cookie-popup-with-overlay__button"),
      settingsLoc: By.css("button.cookie-popup-with-overlay__button-settings"),
    };
  }

  /**
   * Clicks in Agree in Cookies Dialog
   * @returns {undefined}
   */
  async acceptCookies() {
    await this.newWaitUntil(this.elements.agreeLoc);
    await this.clickByLocator(this.elements.agreeLoc);
  }

  /**
   * Clicks in Settings in Cookies Dialog
   * @returns {undefined}
   */
  async selectSettings() {
    await this.newWaitUntil(this.elements.agreeLoc);
    await this.clickByLocator(this.elements.settingsLoc);
  }
}

module.exports = new CookiesPage();
