const {
  defineParameterType,
  setDefaultTimeout,
} = require("@cucumber/cucumber");
const { Given, When, Then, AfterAll } = require("@cucumber/cucumber");
const { assert } = require("chai");
const cookiesPage = require("../../pages/cookiesDialog");
const HomePage = require("../../pages/homePage");
const SelectFlights = require("../../pages/selectFlights");
const ChooseFare = require("../../pages/chooseFare");
const PassengerDetails = require("../../pages/passengerDetails");
const SelectSeatsPage = require("../../pages/selectSeats");
const FastTrackPage = require("../../pages/fastTrackDialog");
const BagsSelectionPage = require("../../pages/bagsSelection");
const ExtrasPage = require("../../pages/extrasOptions");
const SignInDialogPage = require("../../pages/signInDialog");

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
    // Gets first flight in the list
    await SelectFlights.selectFlightByIndex(0);

    // Choose "BASIC" fare
    await ChooseFare.selectFareByName("BASIC");

    // Switch to Regular
    await ChooseFare.selectSwitchToRegular();

    // Fill passenger detail with random data
    await PassengerDetails.selectLoginLater();
    await PassengerDetails.fillPassengerDetails();
    await PassengerDetails.selectContinue();

    // Look for 3 consecutive empty seats
    await SelectSeatsPage.dismissFamilyWarningDialog();
    await SelectSeatsPage.findFirstAvailableSeats(3);
    await SelectSeatsPage.clickContinueButton();

    // Dismiss Fast Track Dialog
    await FastTrackPage.selectNoThanks();

    // Select bags. Adds 20Kg bags for all pax
    await BagsSelectionPage.selectSmallBag();
    await BagsSelectionPage.selectCheckInBagsForAll(weight);
    await BagsSelectionPage.selectContinue();

    // Skip Extras
    await ExtrasPage.selectContinueForAirportAndTrip();
    await ExtrasPage.selectContinueForTransport();
  }
);

Then("login popup shows up", async () => {
  // Assert Sign In Dialog WebElement was found
  const signInDialogEl = await SignInDialogPage.getSignInDialogEl();
  assert.exists(signInDialogEl, "Sign In Dialog WebElement not Found");
});

AfterAll(async () => {
  // await driver.quit();
});
