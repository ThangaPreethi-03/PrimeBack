// utils/sendEmail.js
const sgMail = require("@sendgrid/mail");

console.log("📌 SENDGRID KEY exists:", !!process.env.SENDGRID_API_KEY);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, html) {
  console.log("📨 sendEmail called");
  console.log("➡️ To:", to);
  console.log("➡️ Subject:", subject);

  try {
    await sgMail.send({
      to,
      from: process.env.EMAIL_FROM,
      subject,
      html,
    });

    console.log("✅ Email sent successfully via SendGrid");
  } catch (err) {
    console.error("❌ SendGrid email failed");
    console.error(err.response?.body || err.message);
  }
}

module.exports = sendEmail;
