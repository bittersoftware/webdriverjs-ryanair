const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");
const getAirportDataByCode = require("../utils/getAirportData");
const formatDate = require("../utils/formatDate");

class HomePage extends BasePage {
  constructor() {
    super();

    this.elements = {
      oneWayRadioLoc: By.xpath(
        "//ry-radio-button[@data-ref='flight-search-trip-type__one-way-trip']"
      ),
      returnTripRadioLoc: By.id("ry-radio-button--1"),
      fromInputLoc: By.xpath("//fsw-input-button[@uniqueid='departure']"),
      toInputLoc: By.xpath("//fsw-input-button[@uniqueid='destination']"),
      countryNamesLoc: By.css("div.countries__country"),
      airportNameLoc: By.css("span[data-id='{airportCode}']"),
      datesFromInputLoc: By.css("fsw-input-button[uniqueid$='dates-from']"),
      dateInputLoc: By.css("div[data-id='{date}'"),
      passengersInputLoc: By.css("ry-input-button[uniqueid='passengers']"),
      currentAdultPaxTextLoc: By.xpath(
        "//ry-counter[@data-ref='passengers-picker__adults'] //div[@data-ref='counter.counter__value']"
      ),
      currentChildrenPaxTextLoc: By.xpath(
        "//ry-counter[@data-ref='passengers-picker__children'] //div[@data-ref='counter.counter__value']"
      ),
      incrementAdultPaxLoc: By.xpath(
        "//ry-counter[@data-ref='passengers-picker__adults'] //div[@data-ref='counter.counter__increment']"
      ),
      incrementChildrenPaxLoc: By.xpath(
        "//ry-counter[@data-ref='passengers-picker__children'] //div[@data-ref='counter.counter__increment']"
      ),
      decrementChildrenPaxLoc: By.xpath(
        "//ry-counter[@data-ref='passengers-picker__children'] //div[@data-ref='counter.counter__decrement']"
      ),
      decrementAdultPaxLoc: By.xpath(
        "//ry-counter[@data-ref='passengers-picker__adults'] //div[@data-ref='counter.counter__decrement']"
      ),
      doneButtonLoc: By.css("button.passengers__confirm-button"),
      searchButtonLoc: By.css("button.flight-search-widget__start-search-cta"),
    };
  }

  /**
   * Selects One Way trip radio button
   * @returns {undefined}
   */
  async selectOneWayTrip() {
    await this.clickByLocator(this.elements.oneWayRadioLoc);
  }

  /**
   * Selects Return trip radio button
   * @returns {undefined}
   */
  async selectReturnTrip() {
    await this.clickByLocator(this.to);
    await this.clickByLocator(this.elements.returnTripRadioLoc);
  }

  /**
   * Selects airport by airport Code
   * Clicks in From input field and selects the airport
   * @param {string} airportCode Three letters code Ex: DUB
   * @returns {undefined}
   */
  async selectDeparture(airportCode) {
    await this.clickByLocator(this.elements.fromInputLoc);
    await this.#selectAirport(airportCode);
  }

  /**
   * Selects destination airport by airport Code
   * Destination dialog opens automatically
   * No need to click in To input field
   * @param {string} airportCode Three letters code Ex: DUB
   * @returns {undefined}
   */
  async selectDestination(airportCode) {
    await this.#selectAirport(airportCode);
  }

  /**
   * Select airport in two steps
   * 1st: Select airport country
   * 2nd: Select airport name
   * Relies in external data (utils/getAirportData) to get Airport info
   * @param {string} airportCode
   * @returns {undefined}
   */
  async #selectAirport(airportCode) {
    await this.waitForElementIsLocated(this.elements.countryNamesLoc);
    // Get airport data to match airport code with airport name
    const airportData = getAirportDataByCode(airportCode);
    const countryElement = await this.#findCountryElement(airportData.country);

    // 1st Step: select airport country
    if (countryElement) {
      await countryElement.click();
    } else {
      throw new Error("Country not found");
    }

    // 2nd Step: select airport name using dynamic locator
    // Replace airport code by string from test step to find locator
    this.elements.airportNameLoc = By.css(`span[data-id='${airportCode}']`);
    const airportElement = await this.findElementByLocator(
      this.elements.airportNameLoc
    );
    // Scroll to element in case is not visible in initial state of the list
    this.scrollToElement(airportElement);
    await this.clickByLocator(this.elements.airportNameLoc);
  }

  /**
   * Iterate over countries list until match target country for the airport
   * @param {string} country Ex: Ireland
   * @returns {WebElement} For target country
   */
  async #findCountryElement(country) {
    const countries = await this.findElementsByLocator(
      this.elements.countryNamesLoc
    );

    for (let i = 0; i < countries.length; i += 1) {
      const countryName = await countries[i].getText();

      if (countryName === country) {
        return countries[i];
      }
    }

    throw new Error(`Airport not found for ${country}`);
  }

  /**
   * Clicks on target date if visible in calendar initial state
   * TODO: Improve logic to click in dates that are further in the future
   * TODO: Use Date object to find how many months in the future
   * TODO: Use number of months to change calendar pagination
   * @param {Date} date
   * @returns {undefined}
   */
  async selectDate(date) {
    // Formats Date object to return string in format YYYY-MM-DD
    const formattedDate = formatDate(date);
    // Update locator to use formatted date to dynamically find dates
    this.elements.dateInputLoc = By.css(
      `div.datepicker__calendars div[data-id='${formattedDate}']`
    );

    await this.scrollToTopOfPage();
    await this.waitForElementIsLocated(this.elements.dateInputLoc);
    const dateElement = await this.findElementByLocator(
      this.elements.dateInputLoc
    );
    await this.waitForElementIsEnabled(dateElement);
    this.driver.actions().move(dateElement);
    await this.clickByLocator(this.elements.dateInputLoc);
  }

  /**
   * Select number of adult pax by incrementing or decrementing
   * @param {number} passengersNumber
   * @returns {undefined}
   */
  async selectNumberOfAdults(passengersNumber) {
    await this.#selectNumberOfPax(
      passengersNumber,
      this.elements.currentAdultPaxTextLoc,
      this.elements.incrementAdultPaxLoc,
      this.elements.decrementAdultPaxLoc
    );
  }

  /**
   * Select number of children pax by incrementing or decrementing
   * @param {number} passengersNumber
   * @returns {undefined}
   */
  async selectNumberOfChildren(passengersNumber) {
    await this.#selectNumberOfPax(
      passengersNumber,
      this.elements.currentChildrenPaxTextLoc,
      this.elements.incrementChildrenPaxLoc,
      this.elements.decrementAdultPaxLoc
    );
  }

  /**
   * Inner method to calculate how many times we need to increase
   * or decrease the number of passengers to match the target
   * @param {number} paxNumber
   * @param {WebElement} currentPaxLocator
   * @param {WebElement} incrementLocator
   * @param {WebElement} decrementLocator
   * @returns {undefined}
   */
  async #selectNumberOfPax(
    paxNumber,
    currentPaxLocator,
    incrementLocator,
    decrementLocator
  ) {
    // Scroll and click in passengers picker field
    await this.scrollToElement(
      await this.findElementByLocator(this.elements.passengersInputLoc)
    );
    await this.clickByLocator(this.elements.passengersInputLoc);
    await this.waitForElementIsLocated(currentPaxLocator);

    // store current number of passengers
    const currentPaxElement = await this.findElementByLocator(
      currentPaxLocator
    );
    const currentPaxCount = await currentPaxElement.getText();

    // get the difference
    const difference = paxNumber - Number(currentPaxCount);

    // increment or decrement to match target
    if (difference > 0) {
      await this.waitForElementIsLocated(incrementLocator);
      for (let i = 0; i < difference; i += 1) {
        await this.clickByLocator(incrementLocator);
      }
    } else if (difference < 0) {
      await this.waitForElementIsLocated(decrementLocator);
      for (let i = 0; i < Math.abs(difference); i += 1) {
        await this.clickByLocator(decrementLocator);
      }
    }
  }

  /**
   * Select Done button in passengers picker to close dialog
   * @returns {undefined}
   */
  async selectDone() {
    await this.scrollToElement(
      await this.findElementByLocator(this.elements.doneButtonLoc)
    );
    await this.clickByLocator(this.elements.doneButtonLoc);
  }

  /**
   * Selects Search button to start flights search
   * @returns {undefined}
   */
  async selectSearch() {
    await this.scrollToElement(
      await this.findElementByLocator(this.elements.searchButtonLoc)
    );
    await this.clickByLocator(this.elements.searchButtonLoc);
  }
}

module.exports = new HomePage();
