// const accountSid = process.env.TWILIO_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const verifySid = "VA82d1f743511d6168ec37883e3b569433";
// const client = require("twilio")(accountSid, authToken);

// async function sendPhoneOtp(phone){
//     const sendingStatus = client.verify.v2
//         .services(verifySid)
//         .verifications.create({ to: phone, channel: "sms" })
//         .then((verification) => {
//             console.log(verification.status)
//             return verification.status
//         })
//         .catch((err) =>{
//             console.log(err.message);
//             return false
//         })

//         return sendingStatus
// }

// async function checkPhoneOtpTwilio({phone, otpCode}) {
//     const res = await client.verify.v2
//     .services(verifySid)
//     .verificationChecks.create({ to: phone, code: otpCode })
//     .then((verification_check) => {
//         console.log(verification_check.status)
//         return verification_check.status
//     }).catch(err => {
//         return false
//     })
//     return res
// }

// module.exports = {
//     sendPhoneOtp,
//     checkPhoneOtpTwilio
// }
