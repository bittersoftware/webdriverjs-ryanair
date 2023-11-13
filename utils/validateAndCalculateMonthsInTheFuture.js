function validateAndCalculateMonthsInFuture(inputDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate < today) {
    return { valid: false, monthsInFuture: null };
  }

  // Calculate the difference in months
  const inputYear = inputDate.getFullYear();
  const inputMonth = inputDate.getMonth();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();

  const yearDifference = inputYear - todayYear;
  const monthDifference = inputMonth - todayMonth;

  const monthsInFuture = yearDifference * 12 + monthDifference;

  return { valid: true, monthsInFuture };
}

module.exports = validateAndCalculateMonthsInFuture;
