/**
 * Converts Date object to string in format "YYYY-MM-DD"
 * To be used in dynamic locator to find date in calendar
 * @param {Date} date
 * @returns {string} "YYYY-MM-DD"
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

module.exports = formatDate;
