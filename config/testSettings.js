module.exports = {
  parameters: {
    baseUrl: process.env.RYANAIR_URL || "https://www.ryanair.com/ie/en",
    browser: process.env.WEBDRIVER || "firefox", // "chrome" or "firefox"
    language: "eng",
  },
};
