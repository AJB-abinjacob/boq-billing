import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate PDF for a bill
 * @param {Object} bill - The bill object containing all bill details
 * @returns {jsPDF} - The generated PDF document
 */
export const generateBillPDF = (bill) => {
  const doc = new jsPDF();
  
  // Add company logo and header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('BOQ Billing', 14, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('123 Business Park, Suite 101', 14, 25);
  doc.text('Bangalore, Karnataka 560001', 14, 30);
  doc.text('GSTIN: 29ABCDE1234F1Z5', 14, 35);
  
  // Add bill information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Bill #${bill.billNumber}`, 150, 20, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${formatDate(bill.date)}`, 150, 25, { align: 'right' });
  doc.text(`Due Date: ${formatDate(bill.dueDate)}`, 150, 30, { align: 'right' });
  doc.text(`Status: ${bill.status}`, 150, 35, { align: 'right' });
  
  // Add customer information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 14, 50);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(bill.customerName, 14, 55);
  doc.text(bill.customerAddress, 14, 60);
  doc.text(`Email: ${bill.customerEmail}`, 14, 65);
  doc.text(`Phone: ${bill.customerPhone}`, 14, 70);
  
  // Add bill items table
  const tableColumn = ["Item", "Qty", "Rate", "Amount", "GST %", "GST Amt", "Total"];
  const tableRows = [];
  
  bill.items.forEach(item => {
    const itemData = [
      item.name,
      `${item.quantity} ${item.unit}`,
      `₹${item.rate.toLocaleString()}`,
      `₹${item.amount.toLocaleString()}`,
      `${item.gst}%`,
      `₹${item.gstAmount.toLocaleString()}`,
      `₹${item.total.toLocaleString()}`
    ];
    tableRows.push(itemData);
  });
  
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 80,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    margin: { top: 80 }
  });
  
  // Add bill summary
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.text('Subtotal:', 130, finalY);
  doc.text(`₹${bill.subtotal.toLocaleString()}`, 175, finalY, { align: 'right' });
  
  doc.text('GST:', 130, finalY + 5);
  doc.text(`₹${bill.gstTotal.toLocaleString()}`, 175, finalY + 5, { align: 'right' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total:', 130, finalY + 15);
  doc.text(`₹${bill.grandTotal.toLocaleString()}`, 175, finalY + 15, { align: 'right' });
  
  // Add notes
  if (bill.notes) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 14, finalY + 30);
    doc.setFont('helvetica', 'normal');
    doc.text(bill.notes, 14, finalY + 35);
  }
  
  // Add footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your business!', 105, pageHeight - 20, { align: 'center' });
  doc.text('For any queries, please contact support@boqbilling.com', 105, pageHeight - 15, { align: 'center' });
  
  return doc;
};

/**
 * Export bill as PDF
 * @param {Object} bill - The bill object containing all bill details
 */
export const exportBillAsPDF = (bill) => {
  const doc = generateBillPDF(bill);
  doc.save(`Bill-${bill.billNumber}.pdf`);
};

/**
 * Export bills data as CSV
 * @param {Array} bills - Array of bill objects
 */
export const exportBillsAsCSV = (bills) => {
  // Create CSV content
  let csvContent = "Bill Number,Customer Name,Date,Amount,Status\n";
  
  bills.forEach(bill => {
    csvContent += `${bill.id},${bill.customerName},${bill.date},${bill.amount},${bill.status}\n`;
  });
  
  // Create and download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'bills.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Format date string to a readable format
 * @param {string} dateString - Date string in ISO format
 * @returns {string} - Formatted date string
 */
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};