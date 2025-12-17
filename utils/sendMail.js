// utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendEmail(to, subject, html) {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.error("❌ MAIL_USER / MAIL_PASS missing");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"PrimeShop" <${process.env.MAIL_USER}>`,
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
