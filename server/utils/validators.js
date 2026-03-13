const validateAadhaar = (number) => /^\d{12}$/.test(number);
const validatePAN = (number) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(number);

module.exports = { validateAadhaar, validatePAN };