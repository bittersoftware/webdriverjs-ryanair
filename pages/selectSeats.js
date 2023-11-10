const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

class SelectSeatsPage extends BasePage {
  constructor() {
    super();
    this.seatPopUpButtonLoc = By.css("button.seats-modal__cta");
    this.seatPopUpTextLoc = By.css("div.seats-modal__body");
    this.seatLoc = By.css("*[id='seat-XXL']");
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
    // wait for airplane seats animation before proceed
    // avoids intermittent ElementClickInterceptedError when selecting seats
    await this.driver.sleep(2000);
  }

  async clickContinueButton() {
    await this.clickElementWithWait(this.continueButtonLoc);
  }

  async findFirstAvailableSeats(paxNumber) {
    const firstFamilyRowLoc = By.xpath(
      this.rowLengthLoc.value.replace("ROW", this.familyRows[0])
    );
    await this.waitForElementIsLocated(firstFamilyRowLoc);
    const seatsPerRow = (await this.findElementsByLocator(firstFamilyRowLoc))
      .length;
    const seatsIdPerRow = SelectSeatsPage.#getSeatsConfig(seatsPerRow);

    let leftSeats;
    let rightSeats;

    for (let row = this.familyRows[0]; row <= this.familyRows[1]; row++) {
      leftSeats = seatsIdPerRow[0].split("");
      rightSeats = seatsIdPerRow[1].split("");

      if (await this.findConsecutiveFreeSeatsInRow(row, paxNumber, leftSeats)) {
        for (let seat = 0; seat < leftSeats.length; seat++) {
          await this.selectSeat(row, leftSeats[seat]);
        }
        break;
      }

      if (
        await this.findConsecutiveFreeSeatsInRow(row, paxNumber, rightSeats)
      ) {
        for (let seat = 0; seat < rightSeats.length; seat++) {
          await this.selectSeat(row, rightSeats[seat]);
        }
        break;
      }
    }
  }

  async selectSeat(row, seat) {
    const seatLoc = By.css(
      this.seatLoc.value.replace("XX", row).replace("L", seat)
    );

    await this.clickByLocator(seatLoc);
  }

  async findConsecutiveFreeSeatsInRow(row, freeSeats, seatsIds) {
    const availableSeats = [];
    let seatLoc;
    let seatEl;

    for (let seat = 0; seat < seatsIds.length; seat++) {
      seatLoc = By.css(
        this.seatLoc.value.replace("XX", row).replace("L", seatsIds[seat])
      );
      seatEl = await this.findElementByLocator(seatLoc);

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
