const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class SelectSeatsPage extends BasePage {
  constructor() {
    super();
    this.seatPopUpButtonLoc = By.css("button.seats-modal__cta");
    this.seatPopUpTextLoc = By.css("div.seats-modal__body");
    this.seatLoc = By.id("seat-XXL");
    this.rowLengthLoc = By.xpath("//*[contains(@id,'seat-ROW')]");
    this.continueButtonLoc = By.css(
      "button[data-ref='seats-action__button-continue']"
    );
    this.unavailableSeatClass = "seatmap__seat--unavailable";
    this.familyRows = undefined;
  }

  async #updateFamilyRows() {
    await this.waitForElementIsLocated(this.seatPopUpTextLoc);
    const popUpEl = await this.findElementByLocator(this.seatPopUpTextLoc);
    const fullText = await popUpEl.getText();

    const regex = /(\d+)-(\d+)/;
    const match = fullText.match(regex);

    if (match) {
      const firstRow = parseInt(match[1], 10);
      const lastRow = parseInt(match[2], 10);
      this.familyRows = [firstRow, lastRow];
    } else {
      throw new Error("No family rows found in the text.");
    }
  }

  async dismissFamilyWarningPopUp() {
    await this.#updateFamilyRows();
    await this.clickElementWithWait(this.seatPopUpButtonLoc);
  }

  async clickContinueButton() {
    await this.waitForElementIsLocated(this.continueButtonLoc);
    await this.clickByLocator(this.continueButtonLoc);
  }

  async findFirstAvailableSeats() {
    const firstFamilyRowLoc = By.xpath(
      this.rowLengthLoc.value.replace("ROW", this.familyRows[0])
    );
    await this.waitForElementIsLocated(firstFamilyRowLoc);
    const seatsPerRow = (await this.findElementsByLocator(firstFamilyRowLoc))
      .length;
    const seatsIdPerRow = SelectSeatsPage.#getSeatsConfig(seatsPerRow);
    console.error(firstFamilyRowLoc);
    console.error(`SEATS LENGTH: ${seatsPerRow}`);
    console.error(`SEATS: ${seatsIdPerRow}`);

    let leftSeats;
    let rightSeats;

    for (let i = this.familyRows[0]; i <= this.familyRows[1]; i++) {
      leftSeats = seatsIdPerRow[0].split("");
      rightSeats = seatsIdPerRow[1].split("");

      if (await this.findConsecutiveFreeSeatsInRow(i, 3, leftSeats)) {
        console.log(`found in left side row ${i}`);
        break;
      }

      if (await this.findConsecutiveFreeSeatsInRow(i, 3, rightSeats)) {
        console.log(`found in left side row ${i}`);
        break;
      }
    }
  }

  async findConsecutiveFreeSeatsInRow(row, freeSeats, seatsIds) {
    const availableSeats = [];
    let seatLoc;
    let seatEl;

    for (let seat = 0; seat < seatsIds.length; seat++) {
      seatLoc = By.id(
        this.seatLoc.value.replace("XX", row).replace("L", seatsIds[seat])
      );
      console.log(`find seat: ${seatLoc}`);
      seatEl = await this.findElementByLocator(seatLoc);
      console.log(
        (await seatEl.getAttribute("class")).includes(this.unavailableSeatClass)
      );

      if (
        (await seatEl.getAttribute("class")).includes(this.unavailableSeatClass)
      ) {
        return false;
      }

      availableSeats.push(1);

      if (availableSeats.length === freeSeats) {
        return true;
      }
    }

    return availableSeats === freeSeats;
  }

  static #getSeatsConfig(seatsPerRow) {
    const seatsConfig = {
      4: ["AB", "EF"],
      6: ["ABC", "DEF"],
    };

    return seatsConfig[seatsPerRow];
  }
}

module.exports = new SelectSeatsPage();
