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

  // Default family Seats
  console.info("Use default rows");
  return [18, 33];
}

module.exports = getFamilyRows;
