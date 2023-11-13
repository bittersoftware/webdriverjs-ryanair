module.exports = {
  default: {
    parallel: 2,
    paths: [".features/*.feature"],
    import: [".utils/*.js", ".pages/*.js"],
  },
};
