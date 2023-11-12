const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");
const getFamilyRows = require("../utils/getFamilyRows");

class SelectSeatsPage extends BasePage {
  constructor() {
    super();

    this.familyRows = undefined;

    this.elements = {
      seatPopUpButtonLoc: By.css("button.seats-modal__cta"),
      seatPopUpTextLoc: By.css("div.seats-modal__body"),
      seatLoc: By.css("*[id='seat-XXL']"),
      rowLengthLoc: By.xpath("//*[contains(@id,'seat-ROW')]"),
      continueButtonLoc: By.css(
        "button[data-ref='seats-action__button-continue']"
      ),
      unavailableSeatClass: "seatmap__seat--unavailable",
    };
  }

  /**
   * Get family rows from family dialog text
   * Updates familyRows property with fetched data
   * @returns {undefined}
   */
  async #updateFamilyRows() {
    await this.waitForElementIsVisible(this.elements.seatPopUpTextLoc);
    const fullText = await this.getText(this.elements.seatPopUpButtonLoc);
    this.familyRows = await getFamilyRows(fullText);
  }

  /**
   * Dismisses family warning dialog before selecting seats
   * @returns {undefined}
   */
  async dismissFamilyWarningDialog() {
    // wait for family dialog to appear after animation
    await this.driver.sleep(2000);
    await this.#updateFamilyRows();
    await this.clickByLocator(this.elements.seatPopUpButtonLoc);
  }

  /**
   * Clicks in Continue button
   * @returns {undefined}
   */
  async clickContinueButton() {
    await this.clickByLocator(this.elements.continueButtonLoc);
  }

  /**
   * Selects empty seats next to each other for given number of pax
   * Considers consecutive seats only seats in the same side of the plane
   * So if pax number is bigger then consecutive rows, it won't match the criteria
   * TODO: Change code to consider consecutive seats from both sides if no children in pax
   * @param {any} paxNumber
   * @returns {any}
   */
  async findFirstAvailableSeats(paxNumber) {
    // Uses dynamic locator based on familyRows to look for seats in that range
    const firstFamilyRowLoc = By.xpath(
      this.elements.rowLengthLoc.value.replace("ROW", this.familyRows[0])
    );
    await this.waitForElementIsVisible(firstFamilyRowLoc);

    // Get how many seats there are per row
    const seatsPerRow = (await this.findElementsByLocator(firstFamilyRowLoc))
      .length;
    // Get seats configuration based on number of seats per row
    const seatsIdPerRow = SelectSeatsPage.#getSeatsConfig(seatsPerRow);

    // Check if there are enough consecutive seats for pax
    // Considers symmetric seats disposition for each side
    if (paxNumber > seatsPerRow / 2) {
      throw new Error(
        `This airplane does not have consecutive seats for ${paxNumber} pax`
      );
    }

    let leftSeats;
    let rightSeats;

    // For each row in family rows, look for empty consecutive seats
    // in each side of the airplane
    for (let row = this.familyRows[0]; row <= this.familyRows[1]; row++) {
      leftSeats = seatsIdPerRow[0].split("");
      rightSeats = seatsIdPerRow[1].split("");

      // if empty consecutive seats found int the row in left side, select them
      if (
        await this.#findConsecutiveFreeSeatsInRow(row, paxNumber, leftSeats)
      ) {
        for (let seat = 0; seat < leftSeats.length; seat++) {
          await this.#selectSeat(row, leftSeats[seat]);
        }
        break;
      }

      // if empty consecutive seats found int the row in right side, select them
      if (
        await this.#findConsecutiveFreeSeatsInRow(row, paxNumber, rightSeats)
      ) {
        for (let seat = 0; seat < rightSeats.length; seat++) {
          await this.#selectSeat(row, rightSeats[seat]);
        }
        break;
      }
    }
  }

  /**
   * Selects seat per row number and seat letter. Ex: 18E
   * @param {number} row
   * @param {string} seat
   * @returns {undefined}
   */
  async #selectSeat(row, seat) {
    // Uses dynamic locators to find seat WebElement
    const seatLoc = By.css(
      this.elements.seatLoc.value.replace("XX", row).replace("L", seat)
    );

    await this.clickByLocator(seatLoc);
  }

  /**
   * Finds consecutive free seats in given row
   * Increment availableSeats counter every time an empty seat is found in the row
   * If a busy seat is found, returns false
   * If array of empty consecutive seats matches the freeSeats, return true
   * TODO: This logic needs to be improved for other amount of pax
   * TODO: If there is only 1 or 2 pax, we don't need to skip row if first seat is busy
   * TODO: It would require to see if freeSeats required are smaller than seats per row side
   * @param {number} row
   * @param {number} freeSeats
   * @param {string} seatsIds
   * @returns {boolean}
   */
  async #findConsecutiveFreeSeatsInRow(row, freeSeats, seatsIds) {
    let availableSeats = 0;
    let seatLoc;
    let seatEl;

    for (let seat = 0; seat < seatsIds.length; seat++) {
      // Uses dynamic locators to find seat WebElement
      seatLoc = By.css(
        this.elements.seatLoc.value
          .replace("XX", row)
          .replace("L", seatsIds[seat])
      );
      seatEl = await this.findElementByLocator(seatLoc);

      // Checks if seat is available
      if (
        (await seatEl.getAttribute("class")).includes(
          this.elements.unavailableSeatClass
        )
      ) {
        return false;
      }

      // If available, increment free seats
      availableSeats++;

      // If available consecutive seats matches freeSeats amount, return true
      if (availableSeats === freeSeats) {
        return true;
      }
    }

    return availableSeats === freeSeats;
  }

  /**
   * Airplane seats configurations based on number of seats per row
   * @param {number} seatsPerRow
   * @returns {string[]} each element with seats configuration for left and right sides
   */
  static #getSeatsConfig(seatsPerRow) {
    const seatsConfig = {
      4: ["AB", "EF"],
      6: ["ABC", "DEF"],
    };

    return seatsConfig[seatsPerRow];
  }
}

module.exports = new SelectSeatsPage();
