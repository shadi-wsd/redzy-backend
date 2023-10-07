function isValidPhone(phoneNumber) {
    const phoneRegex = /^\+\d{1,3} \d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phoneNumber);
}

module.exports = {isValidPhone}