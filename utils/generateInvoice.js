const PDFDocument = require("pdfkit");

function generateInvoice(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text("PrimeShop Invoice", { align: "center" });
      doc.moveDown();

      doc.fontSize(12);
      doc.text(`Invoice Number: ${order.invoiceNumber}`);
      doc.text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`);
      doc.text(`Customer Email: ${order.email}`);
      doc.moveDown();

      doc.fontSize(14).text("Order Items", { underline: true });
      doc.moveDown(0.5);

      order.items.forEach((item, i) => {
        doc.text(
          `${i + 1}. ${item.name} | Qty: ${item.quantity} | ₹${item.price}`
        );
      });

      doc.moveDown();
      doc.fontSize(14).text(`Total Amount: ₹${order.total}`, {
        align: "right",
      });

      doc.moveDown(2);
      doc
        .fontSize(10)
        .text("Thank you for shopping with PrimeShop!", { align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateInvoice;
