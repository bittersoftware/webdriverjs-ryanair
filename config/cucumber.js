module.exports = {
  default: {
    parallel: 2,
    format: ["html:cucumber-report.html"],
    paths: [".features/*.feature"],
    import: [".utils/*.js", ".pages/*.js"],
  },
};
