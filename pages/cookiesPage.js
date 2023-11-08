const { Key } = require('selenium-webdriver');
var BasePage = require('./basepage');
const { By } = require('selenium-webdriver');

class CookiesPage extends BasePage {
    constructor() {
        super()
        this.popUp = By.css("div.cookie-popup-with-overlay__box");
        this.agree = By.css("button.cookie-popup-with-overlay__button");
        this.settings = By.css("button.cookie-popup-with-overlay__button-settings");
    }

    async acceptCookies() {
        const cookiePopup = this.findElementByLocator(this.popUp)
        await this.clickByLocator(this.agree);
        await this.waitForElementIsNotVisible(cookiePopup)
    }

    async selectSettings() {
        await this.clickByLocator(this.settings);
    }

}

module.exports = new CookiesPage();
