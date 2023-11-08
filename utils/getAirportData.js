const airports = require('../data/airports');

function getAirportDataByCode(airportCode) {
    // TODO: create lang settings
    let language = "eng";

    if (airports[airportCode]) {
        const countryName = airports[airportCode].country[language] || 'Unknown';
        const airportName = airports[airportCode].airport[language] || 'Unknown';
        return { country: countryName, airport: airportName };
    } else {
        throw new Error('Airport code unknown');
    }
}

module.exports = getAirportDataByCode;
