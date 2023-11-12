const airports = require("../data/airports");

/**
 * Get airport data to be used to search flights based on airport code. Ex: "DUB"
 * TODO: Add support to different languages
 * @param {string} airportCode
 * @param {string} language="eng"
 * @returns {{country: string, airport: string}} airport info
 */
function getAirportDataByCode(airportCode, language = "eng") {
  if (airports[airportCode]) {
    const countryName = airports[airportCode].country[language] || "Unknown";
    const airportName = airports[airportCode].airport[language] || "Unknown";
    return { country: countryName, airport: airportName };
  }
  throw new Error("Airport code unknown");
}

module.exports = getAirportDataByCode;
