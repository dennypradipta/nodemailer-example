const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

// Load env from .env files
dotenv.config();

console.log(process.env.EMAIL_TO);

// sendMail is a function to send email
// email: email address to send to
// subject: subject of the email
// htmlContent: html content of the email
async function sendMail({ email, subject, htmlContent }) {
  try {
    // Create a transporter object
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 25,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      secure: process.env.SMTP_SECURE === "true" || false,
      tls: {
        rejectUnauthorized:
          process.env.EMAIL_TLS_REJECT_UNAUTHORIZED === "true" || false,
      },
    });

    // Verify if it's working
    const verifiedInfo = await transport.verify();
    console.log(`Is SMTP available?: ${verifiedInfo}`);

    // Proceed to send the email
    const sentInfo = await transport.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      htmlContent,
    });
    console.log(`SMTP report: ${JSON.stringify(sentInfo)}`);

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

(async function () {
  console.info("Sending email...");
  await sendMail({
    email: process.env.EMAIL_TO,
    subject: "Test Email Subject",
    htmlContent: "<b>Test message</b>",
  });
})({});
