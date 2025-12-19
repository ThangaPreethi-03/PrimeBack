const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, html, pdfBuffer = null) {
  try {
    await sgMail.send({
      to,
from: {
  email: process.env.EMAIL_FROM,
  name: "PrimeShop"
},

      subject,
      html,
      attachments: pdfBuffer
        ? [
            {
              content: pdfBuffer.toString("base64"),
              filename: "PrimeShop_Invoice.pdf",
              type: "application/pdf",
              disposition: "attachment",
            },
          ]
        : [],
    });

    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Email failed:", err.response?.body || err.message);
  }
}

module.exports = sendEmail;
