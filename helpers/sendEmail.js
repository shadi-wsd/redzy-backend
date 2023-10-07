const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.alnadadubai.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: 'wsd@alnadadubai.com',
    pass: 'wsd!@*115'
  }
});

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail({to, subject, text, html}) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"WSD" <wsd@alnadadubai.com>', // sender address
    to: `${to}`, // list of receivers
    subject: `${subject}`, // Subject line
    text: `${text}`, // plain text body
    html: `${html}`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}

module.exports = { sendEmail }