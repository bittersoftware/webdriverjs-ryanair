const airports = require("../data/airports");
const parameters = require("../config/testSettings");

/**
 * Get airport data to be used to search flights based on airport code. Ex: "DUB"
 * @param {string} airportCode
 * @returns {{country: string, airport: string}} airport info
 */
function getAirportDataByCode(airportCode) {
  const { language } = parameters.parameters;

  if (airports[airportCode]) {
    const countryName = airports[airportCode].country[language] || "Unknown";
    const airportName = airports[airportCode].airport[language] || "Unknown";
    return { country: countryName, airport: airportName };
  }
  throw new Error("Airport code unknown");
}

module.exports = getAirportDataByCode;
