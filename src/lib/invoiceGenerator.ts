import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InvoiceData {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: any;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  trackingNumber?: string;
  storeName: string;
}

export const generateInvoice = (data: InvoiceData) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 105, 20, { align: "center" });

  // Store Info
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(data.storeName, 20, 35);
  doc.setFontSize(10);
  doc.text("WWE Marketplace", 20, 42);
  doc.text("www.wwe-marketplace.com", 20, 48);

  // Invoice Details
  doc.setFontSize(10);
  doc.text(`Invoice #: ${data.orderId}`, 140, 35);
  doc.text(`Date: ${data.orderDate}`, 140, 42);
  if (data.trackingNumber) {
    doc.text(`Tracking: ${data.trackingNumber}`, 140, 48);
  }

  // Customer Info
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 20, 65);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(data.customerName, 20, 72);
  doc.text(data.customerEmail, 20, 78);

  // Shipping Address
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Ship To:", 120, 65);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const address = data.shippingAddress;
  doc.text(address.street || "", 120, 72);
  doc.text(
    `${address.city || ""}, ${address.state || ""} ${address.zipCode || ""}`,
    120,
    78
  );
  doc.text(address.country || "", 120, 84);

  // Products Table
  const tableData = data.products.map((product) => [
    product.name,
    product.quantity.toString(),
    `R${product.price.toFixed(2)}`,
    `R${(product.price * product.quantity).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 95,
    head: [["Product", "Quantity", "Unit Price", "Total"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    foot: [["", "", "Total:", `R${data.total.toFixed(2)}`]],
  });

  // Footer
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text("Thank you for your business!", 105, finalY + 20, {
    align: "center",
  });
  doc.text(
    "For questions about this invoice, please contact support@wwe-marketplace.com",
    105,
    finalY + 27,
    { align: "center" }
  );

  // Save
  doc.save(`invoice-${data.orderId}.pdf`);
};
