const crypto = require("crypto");
const { sendEmail } = require("./sendEmail");
const { OtpMessageTemplate } = require("../instance");

async function generateOTP() {
    const length = process.env.OPT_Length;
    const otp = crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length)).toString();
    return otp;
}

async function sendOtpEmail({ email, username, otp }) {
    await sendEmail({
        to: email,
        subject: "Email Virfication",
        text: `Hi ${username}, Please Verify your email`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
        <title>Your One-Time Password (OTP)</title>
        <style>
            body {
            font-family: Arial, sans-serif;
            text-align: center;
            }

            .logo {
            display: block;
            margin: 0;
            }

            .logo-container{
                display: flex;
                justify-content: left;
                width: 100%;
            }
        </style>
        </head>
        <body>
        <div class="logo-container">
            <img class="logo" src="https://th.bing.com/th?id=OSK.787ae1fb98e4139c8d6d884fae702503&w=117&h=82&c=7&o=6&pid=SANGAM" alt="Your Company Logo">
        </div>

        <h2>Your OTP</h2>

        <p>Dear ${username},</p>

        <p>Thank you for using our services. We're excited to assist you!</p>

        <p>Here is your One-Time Password (OTP):</p>

        <h1>${otp}</h1>

        <p>Please use this OTP for verification purposes and ensure that you do not share it with anyone. If you didn't request this OTP, please disregard this email.</p>

        <p>If you have any questions or need further assistance, feel free to reach out to our support team at <a href="www.thumbtack.com"> www.thumbtack.com </a>. </p>

        <p>Best regards,<br>
        Thumbtack Team</p>
            <div class="logo-container">
                <img class="logo" src="https://th.bing.com/th?id=OSK.787ae1fb98e4139c8d6d884fae702503&w=117&h=82&c=7&o=6&pid=SANGAM" alt="Your Company Logo">
            </div>
        </body>
        </html>
`
    })
}

async function sendPassportEmail({ email, username, passportNumber }) {
    await sendEmail({
        to: email,
        subject: "Authentication Passport",
        text: `Hi Mr. ${username}, This is your Super admin passport please don't share this passport with anyone and keep it safe`,
        html: `
        <p>Hi Mr. ${username}, This is your passport please don't share this passport with anyone and keep it safe</p>
        <h1>your passport code is ${passportNumber} </h1>
        `
    })
}
module.exports = { generateOTP, sendOtpEmail, sendPassportEmail }