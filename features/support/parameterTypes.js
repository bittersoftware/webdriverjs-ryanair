const { defineParameterType } = require("@cucumber/cucumber");

/**
 * Parameter type for date
 * @returns {Date} returns Date Object from string
 */
defineParameterType({
  name: "date",
  regexp: /(\d{2}\/\d{2}\/\d{4})/,
  transformer: (dateString) => new Date(dateString),
});
