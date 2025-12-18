const nodemailer = require("nodemailer");

console.log("📌 EMAIL_USER:", process.env.EMAIL_USER);
console.log("📌 EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

async function sendEmail(to, subject, html) {
  console.log("📨 sendEmail called");
  console.log("➡️ To:", to);
  console.log("➡️ Subject:", subject);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ EMAIL_USER / EMAIL_PASS missing");
    return;
  }

  try {
    console.log("⏳ Sending email...");

    const info = await transporter.sendMail({
      from: `"PrimeShop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully");
    console.log("📬 Message ID:", info.messageId);
    console.log("📨 Accepted:", info.accepted);
    console.log("📨 Rejected:", info.rejected);
  } catch (err) {
    console.error("❌ Email failed");
    console.error("🧨 Error message:", err.message);
    console.error("🧨 Error code:", err.code);
  }
}

module.exports = sendEmail;
