// utils/generateInvoice.js
const PDFDocument = require("pdfkit");

function generateInvoice(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      /* ===============================
         HEADER (BRANDING)
      ================================ */
      doc
        .fontSize(26)
        .fillColor("#1a1a1a")
        .text("PrimeShop", { align: "left" });

      doc
        .fontSize(12)
        .fillColor("#555")
        .text("Premium Online Shopping", { align: "left" });

      doc.moveDown(0.5);

      doc
        .moveTo(40, doc.y)
        .lineTo(555, doc.y)
        .strokeColor("#e0e0e0")
        .stroke();

      doc.moveDown();

      /* ===============================
         INVOICE INFO
      ================================ */
      doc.fontSize(14).fillColor("#000").text("INVOICE", { align: "right" });
      doc.moveDown(0.5);

      doc.fontSize(11).fillColor("#333");

      doc.text(`Invoice No: ${order.invoiceNumber}`, { align: "right" });
      doc.text(
        `Date: ${new Date(order.createdAt).toLocaleString()}`,
        { align: "right" }
      );
      doc.text(`Email: ${order.email}`, { align: "right" });

      doc.moveDown(1.5);

      /* ===============================
         TABLE HEADER
      ================================ */
      const tableTop = doc.y;
      const col1 = 50;
      const col2 = 260;
      const col3 = 350;
      const col4 = 430;

      doc
        .fontSize(12)
        .fillColor("#ffffff")
        .rect(40, tableTop - 5, 515, 25)
        .fill("#1f2937");

      doc.fillColor("#ffffff");
      doc.text("Product", col1, tableTop);
      doc.text("Qty", col2, tableTop);
      doc.text("Price", col3, tableTop);
      doc.text("Total", col4, tableTop);

      doc.moveDown();

      /* ===============================
         TABLE ROWS
      ================================ */
      doc.fillColor("#000");
      let y = tableTop + 30;
      let grandTotal = 0;

      order.items.forEach((item, index) => {
        const qty = item.quantity || item.qty || item.count || 1;
        const price = Number(item.price) || 0;
        const total = qty * price;
        grandTotal += total;

        // Zebra striping
        if (index % 2 === 0) {
          doc
            .rect(40, y - 5, 515, 22)
            .fill("#f8fafc");
          doc.fillColor("#000");
        }

        doc.fontSize(11);
        doc.text(item.name || "Product", col1, y);
        doc.text(qty.toString(), col2, y);
        doc.text(`₹${price}`, col3, y);
        doc.text(`₹${total}`, col4, y);

        y += 25;
      });

      doc.moveDown(2);

      /* ===============================
         TOTAL SECTION
      ================================ */
      doc
        .moveTo(350, y)
        .lineTo(555, y)
        .strokeColor("#e5e7eb")
        .stroke();

      y += 10;

      doc.fontSize(14).fillColor("#000");
      doc.text("Grand Total:", 350, y);
      doc.text(`₹${order.total || grandTotal}`, col4, y);

      doc.moveDown(3);

      /* ===============================
         FOOTER
      ================================ */
      doc
        .fontSize(10)
        .fillColor("#555")
        .text(
          "Thank you for shopping with PrimeShop.\nThis is a system generated invoice.",
          { align: "center" }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateInvoice;
