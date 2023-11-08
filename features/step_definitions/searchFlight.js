const { Given, When, Then, AfterAll, setDefaultTimeout } = require('cucumber');
const { expect } = require('chai');
const cookiesPage = require('../../pages/cookiesPage')
const HomePage = require('../../pages/homePage')

setDefaultTimeout(60 * 1000);


const { defineParameterType } = require('cucumber');

defineParameterType({
    name: 'date',
    regexp: /(\d{2}\/\d{2}\/\d{4})/,  // Match the date pattern (e.g., "12/01/2023")
    transformer: (dateString) => new Date(dateString),  // Transform the matched string to a JavaScript Date object
});

Given('I open Ryanair webpage', { timeout: 2 * 5000 }, async function () {
    // TODO: move base url to settings
    await cookiesPage.goToUrl('https://www.ryanair.com/ie/en')
    await cookiesPage.acceptCookies();
});

Given('I search for a flight from {string} to {string} on {date} for {int} adults and {int} child', async function (departure, destination, date, adult, child) {
    // TODO: Select Flights tab
    await HomePage.selectOneWayTrip();
    await HomePage.selectDeparture(departure);
    await HomePage.selectDestination(destination);
    await HomePage.selectDate(date);
});

When('I proceed to pay with selected seats and {int}kg bags added', async function (weight) {
    console.log("Select seats")
    console.log(weight)
});

Then('login popup shows up', async function () {
    console.log("login")
});


AfterAll(async function () {

    // await driver.quit();
});
