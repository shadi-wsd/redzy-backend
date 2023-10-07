const crypto = require('crypto');

// Generate a random salt for password hashing
async function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
  }

// Hash the password using SHA-256 and the salt
async function hashPassword(password, salt) {
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    return hash.digest('hex');
}

async function generateSecurePassword(password){
      // hashing password::begin
      const salt = await generateSalt()
      const hashedPassword = await hashPassword(password, salt)
      // hashing password::end

      return {hashedPassword, salt}
}


module.exports = { hashPassword, generateSecurePassword, generateSalt }