const PDFDocument = require("pdfkit");

/**
 * Generates invoice PDF and returns it as a Buffer
 */
function generateInvoice(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      /* ---------- HEADER ---------- */
      doc
        .fontSize(20)
        .text("PrimeShop Invoice", { align: "center" })
        .moveDown();

      doc.fontSize(12);
      doc.text(`Order ID: ${order._id}`);
      doc.text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`);
      doc.text(`Customer Email: ${order.email}`);
      doc.moveDown();

      /* ---------- ITEMS ---------- */
      doc.fontSize(14).text("Order Items", { underline: true });
      doc.moveDown(0.5);

      order.items.forEach((item, index) => {
        doc
          .fontSize(12)
          .text(
            `${index + 1}. ${item.name}  |  Qty: ${item.quantity}  |  ₹${item.price}`
          );
      });

      doc.moveDown();

      /* ---------- TOTAL ---------- */
      doc.fontSize(14).text(`Total Amount: ₹${order.total}`, {
        align: "right",
      });

      doc.moveDown(2);

      /* ---------- FOOTER ---------- */
      doc
        .fontSize(10)
        .text(
          "Thank you for shopping with PrimeShop!\nFor any queries, reply to this email.",
          { align: "center" }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateInvoice;
