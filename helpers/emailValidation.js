function isValidEmail(email) {
    // Regular expression to validate the email pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Test the email against the pattern
    return emailPattern.test(email);
}

module.exports = { isValidEmail }