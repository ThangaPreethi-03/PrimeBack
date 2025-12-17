const nodemailer = require("nodemailer");
const fs = require("fs");

module.exports = async function sendEmail(to, subject, html, attachments = []) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    console.log("MAIL_USER =", process.env.MAIL_USER);
console.log("MAIL_PASS =", process.env.MAIL_PASS ? "OK" : "MISSING");

  });

  await transporter.sendMail({
    from: `"PrimeShop" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
    attachments
  });

  console.log("📧 Email sent successfully to:", to);   // <--- MUST PRINT
};
