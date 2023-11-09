const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class CookiesPage extends BasePage {
  constructor() {
    super();
    this.popUp = By.css("div.cookie-popup-with-overlay__box");
    this.agree = By.css("button.cookie-popup-with-overlay__button");
    this.settings = By.css("button.cookie-popup-with-overlay__button-settings");
  }

  async acceptCookies() {
    await this.clickByLocator(this.agree);
  }

  async selectSettings() {
    await this.clickByLocator(this.settings);
  }
}

module.exports = new CookiesPage();
