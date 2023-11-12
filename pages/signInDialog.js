const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class SignInDialogPage extends BasePage {
  constructor() {
    super();

    this.elements = {
      signInDialogLoc: By.css("div.signup-dialog"),
    };
  }

  /**
   * Get SignIn Dialog WebElement
   * @returns {WebElement}
   */
  async getSignInDialogEl() {
    await this.waitForElementIsVisible(this.elements.signInDialogLoc);
    await this.waitForElementIsEnabled(
      await this.findElementByLocator(this.elements.signInDialogLoc)
    );
    return this.findElementByLocator(this.elements.signInDialogLoc);
  }
}

module.exports = new SignInDialogPage();
