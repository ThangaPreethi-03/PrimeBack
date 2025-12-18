// utils/sendEmail.js
const nodemailer = require("nodemailer");
console.log("EMAIL:", process.env.EMAIL);
console.log("EMAIL_PASS:", process.env.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, html) {
  if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    console.error("❌ MAIL_USER / MAIL_PASS missing");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"PrimeShop" <${process.env.EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent to:", to);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
}

module.exports = sendEmail;
