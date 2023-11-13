/**
 * Returns list of numbers for initial and final rows for family
 * Expected text format:
 * "When selecting your seats please seat children next to adults.
 * Choose seats marked 'included' for adults and children under 12.
 * Family seats are available in rows 18-33"
 * @param {string} fullText
 * @returns {number[]} fist and last family rows
 */
async function getFamilyRows(fullText) {
  // Looks for family rows range. Ex: 18-33
  const regex = /(\d+)-(\d+)/;
  const match = fullText.match(regex);

  if (match) {
    const firstRow = parseInt(match[1], 10);
    const lastRow = parseInt(match[2], 10);
    console.info(`Found first row: ${firstRow}`);
    console.info(`Found last row: ${lastRow}`);
    return [firstRow, lastRow];
  }

  // Default family seats if not match
  console.info("Use default rows");
  return [18, 33];
}

module.exports = getFamilyRows;
