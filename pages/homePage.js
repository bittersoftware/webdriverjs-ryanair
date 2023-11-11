const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");
const getAirportDataByCode = require("../utils/getAirportData");
const formatDate = require("../utils/formatDate");

class HomePage extends BasePage {
  constructor() {
    super();
    this.elements = {
      bla: 1,
    };
    this.oneWay = By.xpath(
      "//ry-radio-button[@data-ref='flight-search-trip-type__one-way-trip']"
    );
    this.returnTrip = By.id("ry-radio-button--1");
    this.from = By.xpath("//fsw-input-button[@uniqueid='departure']");
    this.to = By.xpath("//fsw-input-button[@uniqueid='destination']");
    this.country_names = By.css("div.countries__country");
    this.airport_name = By.css("span[data-id='{airportCode}']");
    this.datesFrom = By.css("fsw-input-button[uniqueid$='dates-from']");
    this.date = By.css("div[data-id='{date}'");
    this.currentAdultPassengers = By.xpath(
      "//ry-counter[@data-ref='passengers-picker__adults'] //div[@data-ref='counter.counter__value']"
    );
    this.currentChildrenPassengers = By.xpath(
      "//ry-counter[@data-ref='passengers-picker__children'] //div[@data-ref='counter.counter__value']"
    );
    this.incrementAdultPassenger = By.xpath(
      "//ry-counter[@data-ref='passengers-picker__adults'] //div[@data-ref='counter.counter__increment']"
    );
    this.incrementChildrenPassenger = By.xpath(
      "//ry-counter[@data-ref='passengers-picker__children'] //div[@data-ref='counter.counter__increment']"
    );
    this.decrementChildrenPassenger = By.xpath(
      "//ry-counter[@data-ref='passengers-picker__children'] //div[@data-ref='counter.counter__decrement']"
    );
    this.decrementAdultPassenger = By.xpath(
      "//ry-counter[@data-ref='passengers-picker__adults'] //div[@data-ref='counter.counter__decrement']"
    );
    this.doneButton = By.css("button.passengers__confirm-button");
    this.searchButton = By.css("button.flight-search-widget__start-search-cta");
  }

  async enterUrl(theURL) {
    await this.goToUrl(theURL);
  }

  async acceptCookies() {
    await this.clickByCss(this.agree_locator);
  }

  async selectOneWayTrip() {
    await this.clickByLocator(this.oneWay);
  }

  async selectReturnTrip() {
    await this.clickByLocator(this.to);
    await this.clickByLocator(this.returnTrip);
  }

  async selectDeparture(airportCode) {
    await this.clickByLocator(this.from);
    await this.selectAirport(airportCode);
  }

  async selectDestination(airportCode) {
    await this.selectAirport(airportCode);
  }

  async selectAirport(airportCode) {
    await this.waitForElementIsLocated(this.country_names);
    const airportData = getAirportDataByCode(airportCode);
    const countryElement = await this.#findCountryElement(airportData.country);

    if (countryElement) {
      await countryElement.click();
    } else {
      throw new Error("Country not found");
    }

    this.airport_name = By.css(`span[data-id='${airportCode}']`);
    const airportElement = await this.findElementByLocator(this.airport_name);
    this.scrollToElement(airportElement);
    await this.clickByLocator(this.airport_name);
  }

  async #findCountryElement(country) {
    const countries = await this.findElementsByLocator(this.country_names);

    for (let i = 0; i < countries.length; i += 1) {
      const countryName = await countries[i].getText();

      if (countryName === country) {
        return countries[i];
      }
    }

    throw new Error(`Airport not found for ${country}`);
  }

  async selectDate(date) {
    // TODO: while logic to press right up to the test date
    const formattedDate = formatDate(date);
    this.date = By.css(
      `div.datepicker__calendars div[data-id='${formattedDate}']`
    );

    await this.waitForElementIsLocated(this.date);
    const dateElement = await this.findElementByLocator(this.date);
    await this.waitForElementIsEnabled(dateElement);
    this.driver.actions().move(dateElement);
    await this.clickByLocator(this.date);
  }

  async selectNumberOfAdults(passengersNumber) {
    await this.selectNumberOfPax(
      passengersNumber,
      this.currentAdultPassengers,
      this.incrementAdultPassenger,
      this.decrementAdultPassenger
    );
  }

  async selectNumberOfChildren(passengersNumber) {
    await this.selectNumberOfPax(
      passengersNumber,
      this.currentChildrenPassengers,
      this.incrementChildrenPassenger,
      this.decrementChildrenPassenger
    );
  }

  async selectNumberOfPax(
    paxNumber,
    currentPaxLocator,
    incrementLocator,
    decrementLocator
  ) {
    await this.waitForElementIsLocated(currentPaxLocator);

    const currentPaxElement = await this.findElementByLocator(
      currentPaxLocator
    );

    const currentPaxCount = await currentPaxElement.getText();

    const difference = paxNumber - Number(currentPaxCount);

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

  async selectDone() {
    await this.scrollToElement(
      await this.findElementByLocator(this.doneButton)
    );
    await this.clickByLocator(this.doneButton);
  }

  async selectSearch() {
    await this.scrollToElement(
      await this.findElementByLocator(this.searchButton)
    );
    await this.clickByLocator(this.searchButton);
  }
}

module.exports = new HomePage();
