function isValidText(value, minLength = 1) {
  return value && value.trim().length >= minLength;
}

function isValidPrice(value, minLength = 1) {
  return value && value.trim().length >= minLength;
}

// function isValidDate(value) {
//   const date = new Date(value);
//   return value && date !== 'Invalid Date';
// }

function isValidAmount(value, minLength = 1) {
  return value && value.trim().length >= minLength;
}

function isValidImageUrl(value) {
  return value && value.startsWith('http');
}

function isValidEmail(value) {
  return value && value.includes('@');
}

exports.isValidAmount = isValidAmount;
exports.isValidText = isValidText;
exports.isValidPrice = isValidPrice;
// exports.isValidDate = isValidDate;
exports.isValidImageUrl = isValidImageUrl;
exports.isValidEmail = isValidEmail;
