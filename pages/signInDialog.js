const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class SignInDialogPage extends BasePage {
  constructor() {
    super();
    this.signInDialogLoc = By.css("div.signup-dialog");
  }

  async getSignInDialogEl() {
    const signInDialogEl = await this.findElementByLocator(
      this.signInDialogLoc
    );
    await this.waitForElementIsVisible(signInDialogEl);
    return this.findElementByLocator(this.signInDialogLoc);
  }
}

module.exports = new SignInDialogPage();
