const { Key } = require('selenium-webdriver');
var BasePage = require('./basepage');
const airports = require('../data/airports');
const { By } = require('selenium-webdriver');

class HomePage extends BasePage {
    constructor() {
        super()
        this.airports = airports;
        this.oneWay = By.xpath("//ry-radio-button[@data-ref='flight-search-trip-type__one-way-trip']");
        this.returnTrip = By.id("ry-radio-button--1");
        this.from = By.xpath("//fsw-input-button[@uniqueid='departure']");
        this.to = By.xpath("//fsw-input-button[@uniqueid='destination']");
        this.country_names = By.css("div.countries__country");
        this.airport_name = By.css("span[data-id='${airportCode}']");
        this.date = By.css("div[data-id='${date}'")
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
        await this.clickByLocator(this.returnTrip);
    }

    async selectDeparture(airportCode) {
        await this.clickByLocator(this.from);
        await this.selectAirport(airportCode);
    }

    async selectDestination(airportCode) {
        // await this.clickByLocator(this.to);
        await this.selectAirport(airportCode);
    }

    async selectAirport(airportCode) {
        await this.waitForElementIsVisible(this.findElementByLocator(this.country_names));
        let airportData = await this.getAirportDataByCode(airportCode);
        let countryElement = await this.findCountryElement(airportData.country);

        if (countryElement) {
            await countryElement.click();
        }
        else {
            throw new Error("Country not found");

        }

        this.airport_name = By.css(`span[data-id='${airportCode}']`);
        await this.clickByLocator(this.airport_name);
    }

    async getAirportDataByCode(airportCode) {
        // TODO: create lang settings
        let language = "eng";

        if (this.airports[airportCode]) {
            const countryName = this.airports[airportCode].country[language] || 'Unknown';
            const airportName = this.airports[airportCode].airport[language] || 'Unknown';
            return { country: countryName, airport: airportName };
        } else {
            throw new Error('Airport code unknown');
        }
    }

    async findCountryElement(country) {
        let countries = await this.findElementsByLocator(this.country_names);

        for (let i = 0; i < countries.length; i++) {
            let countryName = await countries[i].getText()

            console.error(countryName)
            if (countryName === country) {
                return countries[i]
            }
        }

        throw new Error(`Airport not found for ${country}`);
    }

    async selectDate(date) {
        let formattedDate = this.formatDate(date);
        this.date = By.css(`div[data-id='${formattedDate}'`);
        await this.waitForElementIsVisible(this.findElementByLocator(this.date));
        await this.clickByLocator(this.date);
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because it's zero-based
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}




module.exports = new HomePage();
