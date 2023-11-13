const { Given } = require("@cucumber/cucumber");
const cookiesPage = require("../../pages/cookiesDialog");
const parameters = require("../../config/testSettings");

Given("I open Ryanair webpage", async () => {
  await cookiesPage.goToUrl(parameters.parameters.baseUrl);
  await cookiesPage.acceptCookies();
});
