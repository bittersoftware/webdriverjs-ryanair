module.exports = {
  default: {
    parallel: 0,
    format: ["progress-bar", "./config/reporter.js"],
    formatOptions: { colorsEnabled: true },
    paths: ["./features/*.feature"],
    import: ["./utils/*.js", "./pages/*.js"],
    require: [
      "./features/stepDefinitions/*",
      "./features/support/*",
      "./utils/*.js",
      "./pages/*.js",
    ],
  },
};
