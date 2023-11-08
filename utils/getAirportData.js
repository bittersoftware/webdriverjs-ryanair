const airports = require('../data/airports');

function getAirportDataByCode(airportCode) {
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

module.exports = getAirportDataByCode;
