const fs = require("node:fs");
const PDFDocument = require("pdfkit");

const createInvoice = (dataCallback, endCallback, order) => {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, order);
  generateBody(doc, order);
  generateFooter(doc);
  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  doc.end();
};

function generateHeader(doc) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Aech Computer.", 110, 57)
    .fontSize(10)
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("Coimbatore, 6100025", 200, 80, { align: "right" })
    .moveDown();
}

function generateFooter(doc) {
  doc.fontSize(10).text("Thank You shop with us again", 50, 750, {
    align: "center",
    width: 500,
  });
}
function generateCustomerInformation(doc, order) {
  const address = order.address;

  doc
    .text(`Order Number: ${order.orderNumber}`, 50, 100)
    .text(
      `Order Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      50,
      115
    )
    .text(`Total Price: ${formatCurrency(order.totalPrice)}`, 50, 130)
    .text(`Name: ${address.name}`, 300, 100)
    .text(
      `Address: ${address.houseNo}, ${address.city}, ${address.state}, ${address.pincode}`,
      300,
      115
    )
    .text(`Phone: ${address.phone}`, 300, 130)
    .moveDown();
}

function generateBody(doc, order) {
  generateHr(doc, 90);

  doc.fontSize(15).text("Invoice", 210, 170);

  doc.font("Helvetica-Bold").fontSize(14).text("Product", 50, 240);
  doc.text("Quantity", 250, 240);
  doc.text("Price", 350, 240, { width: 100, align: "right" });

  doc.moveDown();
  generateHr(doc, 260);

  order.products.forEach((product, i) => {
    doc.fontSize(10).text(product.product.productName, 50,260+((i+1)*20));
    doc.text(product.quantity.toString(), 250, 260+((i+1)*20));
    doc.text(
      formatCurrency(product.product.price * product.quantity),
      350,
      260+((i+1)*20),
      { width: 100, align: "right" }
    );

    if (i !== order.products.length - 1) {
      doc.moveDown();
    }
  });

  generateHr(doc, doc.y);
  doc.moveDown();

  doc
    .fontSize(14)
    .text(`Total Price: ${formatCurrency(order.totalPrice)}`, 350, doc.y);
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(amount) {
  return "" + amount.toLocaleString("en-IN");
}

module.exports = createInvoice;
