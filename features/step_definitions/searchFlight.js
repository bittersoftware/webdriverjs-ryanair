const { defineParameterType } = require("cucumber");
const { Given, When, Then, AfterAll, setDefaultTimeout } = require("cucumber");
const cookiesPage = require("../../pages/cookiesPopUp");
const HomePage = require("../../pages/homePage");
const SelectFlights = require("../../pages/selectFlights");
const ChooseFare = require("../../pages/chooseFare");
const PassengerDetails = require("../../pages/passengerDetails");

setDefaultTimeout(60 * 1000);

defineParameterType({
  name: "date",
  regexp: /(\d{2}\/\d{2}\/\d{4})/,
  transformer: (dateString) => new Date(dateString),
});

Given("I open Ryanair webpage", async () => {
  // TODO: move base url to settings
  await cookiesPage.goToUrl("https://www.ryanair.com/ie/en");
  await cookiesPage.acceptCookies();
});

Given(
  "I search for a flight from {string} to {string} on {date} for {int} adults and {int} child",
  async (departure, destination, date, adult, child) => {
    // TODO: Select Flights tab
    await HomePage.selectOneWayTrip();
    await HomePage.selectDeparture(departure);
    await HomePage.selectDestination(destination);
    await HomePage.selectDate(date);
    await HomePage.selectNumberOfAdults(adult);
    await HomePage.selectNumberOfChildren(child);
    await HomePage.selectDone();
    await HomePage.selectSearch();
  }
);

When(
  "I proceed to pay with selected seats and {int}kg bags added",
  async (weight) => {
    await SelectFlights.selectFlightByIndex(0);
    await ChooseFare.selectCheckInBagFareByIndex(weight, 0);
    await PassengerDetails.selectLoginLater();
    await PassengerDetails.fillPassengerDetails();
    await PassengerDetails.selectContinue();
  }
);

Then("login popup shows up", async () => {
  console.log("login");
});

AfterAll(async () => {
  // await driver.quit();
});
