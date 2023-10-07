const tokenBlacklist = new Set();

function addToBlacklist(token) {
    tokenBlacklist.add(token);
}

function isTokenBlacklisted(token) {
    return tokenBlacklist.has(token);
}

module.exports = {
    addToBlacklist,
    isTokenBlacklisted,
};