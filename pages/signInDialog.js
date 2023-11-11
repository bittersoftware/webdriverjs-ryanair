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
    const signInDialogEl = await this.findElementByLocator(
      this.elements.signInDialogLoc
    );
    await this.waitForElementIsVisible(signInDialogEl);
    return this.findElementByLocator(this.elements.signInDialogLoc);
  }
}

module.exports = new SignInDialogPage();
