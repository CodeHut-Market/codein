import { NextRequest, NextResponse } from 'next/server';

// In a real implementation, you would use a PDF generation library like jsPDF or Puppeteer
// For now, we'll create a simple HTML-to-PDF or return a mock PDF

export async function GET(request: NextRequest, { params }: { params: { receiptId: string } }) {
  try {
    const { receiptId } = params;
    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'pdf';

    if (!receiptId) {
      return NextResponse.json(
        { error: 'Receipt ID is required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Validate the receipt ID exists in your database
    // 2. Fetch the subscription and payment details
    // 3. Generate a PDF using a library like jsPDF, Puppeteer, or React-PDF
    // 4. Return the PDF as a downloadable file

    // Mock receipt data (in real app, fetch from database)
    const receiptData = {
      id: receiptId,
      date: new Date().toLocaleDateString(),
      customerEmail: 'user@example.com',
      customerName: 'John Doe',
      plan: receiptId.includes('PRO') ? 'Pro' : 'Team',
      amount: receiptId.includes('PRO') ? 19 : 49,
      subscriptionId: `SUB_${receiptId.slice(-8)}`,
      paymentMethod: 'Credit Card ending in 1234',
      billingPeriod: 'Monthly',
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };

    if (format === 'json') {
      return NextResponse.json({ receipt: receiptData });
    }

    // Generate HTML receipt and convert to PDF (or return HTML for now)
    const format_type = url.searchParams.get('type') || 'pdf';
    
    if (format_type === 'html') {
      const htmlContent = generateHTMLReceipt(receiptData);
      return new NextResponse(htmlContent, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }
    
    // For PDF, we'll create a working PDF
    const pdfBuffer = generateWorkingPDF(receiptData);
    const pdfBytes = new Uint8Array(pdfBuffer);

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="CodeHut-Receipt-${receiptId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Receipt generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate receipt' },
      { status: 500 }
    );
  }
}

// Generate HTML receipt for better formatting
function generateHTMLReceipt(receiptData: any): string {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CodeHut Receipt - ${receiptData.id}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #333; margin: 0; font-size: 28px; }
    .header p { color: #666; margin: 5px 0; }
    .section { margin-bottom: 25px; }
    .section h2 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
    .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
    .info-row strong { color: #333; }
    .total-section { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .total-row { display: flex; justify-content: space-between; margin: 10px 0; font-size: 18px; }
    .footer { text-align: center; border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>CodeHut UI Library</h1>
    <p>Payment Receipt</p>
  </div>

  <div class="section">
    <h2>Receipt Details</h2>
    <div class="info-row"><span>Receipt ID:</span> <strong>${receiptData.id}</strong></div>
    <div class="info-row"><span>Date:</span> <strong>${currentDate}</strong></div>
    <div class="info-row"><span>Time:</span> <strong>${currentTime}</strong></div>
  </div>

  <div class="section">
    <h2>Customer Information</h2>
    <div class="info-row"><span>Name:</span> <strong>${receiptData.customerName}</strong></div>
    <div class="info-row"><span>Email:</span> <strong>${receiptData.customerEmail}</strong></div>
  </div>

  <div class="section">
    <h2>Subscription Details</h2>
    <div class="info-row"><span>Plan:</span> <strong>${receiptData.plan} Plan</strong></div>
    <div class="info-row"><span>Subscription ID:</span> <strong>${receiptData.subscriptionId}</strong></div>
    <div class="info-row"><span>Billing Period:</span> <strong>${receiptData.billingPeriod}</strong></div>
    <div class="info-row"><span>Payment Method:</span> <strong>${receiptData.paymentMethod}</strong></div>
    <div class="info-row"><span>Next Billing Date:</span> <strong>${receiptData.nextBilling}</strong></div>
  </div>

  <div class="total-section">
    <h2>Payment Summary</h2>
    <div class="info-row"><span>${receiptData.plan} Plan Subscription</span> <strong>$${receiptData.amount}.00</strong></div>
    <div class="info-row"><span>Tax (included)</span> <strong>$0.00</strong></div>
    <hr>
    <div class="total-row"><span><strong>Total Amount Paid</strong></span> <strong>$${receiptData.amount}.00</strong></div>
  </div>

  <div class="footer">
    <p><strong>Thank you for your subscription!</strong></p>
    <p>This receipt is for your records. Your subscription is now active.</p>
    <p>For support, please contact: <strong>marketcodehut@gmail.com</strong></p>
    <p>Visit us at: <strong>https://codehutcode.vercel.app</strong></p>
    <br>
    <small>CodeHut Inc. | Digital Receipt | Generated on ${new Date().toISOString()}</small>
  </div>
</body>
</html>`;
}

// Generate a working PDF with proper structure
function generateWorkingPDF(receiptData: any): Buffer {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  
  // Create a simpler, working PDF structure
  const content = `BT
/F1 20 Tf
50 750 Td
(CodeHut UI Library) Tj
0 -25 Td
/F1 14 Tf
(Payment Receipt) Tj

0 -40 Td
/F1 12 Tf
(Receipt Details:) Tj
0 -20 Td
/F1 10 Tf
(Receipt ID: ${receiptData.id}) Tj
0 -15 Td
(Date: ${currentDate}) Tj
0 -15 Td
(Time: ${currentTime}) Tj

0 -30 Td
/F1 12 Tf
(Customer Information:) Tj
0 -20 Td
/F1 10 Tf
(Name: ${receiptData.customerName}) Tj
0 -15 Td
(Email: ${receiptData.customerEmail}) Tj

0 -30 Td
/F1 12 Tf
(Subscription Details:) Tj
0 -20 Td
/F1 10 Tf
(Plan: ${receiptData.plan} Plan) Tj
0 -15 Td
(Subscription ID: ${receiptData.subscriptionId}) Tj
0 -15 Td
(Billing Period: ${receiptData.billingPeriod}) Tj
0 -15 Td
(Payment Method: ${receiptData.paymentMethod}) Tj
0 -15 Td
(Next Billing Date: ${receiptData.nextBilling}) Tj

0 -30 Td
/F1 12 Tf
(Payment Summary:) Tj
0 -20 Td
/F1 10 Tf
(${receiptData.plan} Plan Subscription: $${receiptData.amount}.00) Tj
0 -15 Td
(Tax \\(included\\): $0.00) Tj
0 -20 Td
/F1 12 Tf
(Total Amount Paid: $${receiptData.amount}.00) Tj

0 -40 Td
/F1 10 Tf
(Thank you for your subscription!) Tj
0 -15 Td
(This receipt is for your records.) Tj
0 -15 Td
(For support: support@codehut.com) Tj
0 -15 Td
(Visit: https://codehut.com) Tj

0 -30 Td
/F1 8 Tf
(CodeHut Inc. | Generated on ${new Date().toISOString()}) Tj
ET`;

  const contentLength = Buffer.byteLength(content, 'utf8');

  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${contentLength} >>
stream
${content}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000${(400 + contentLength).toString().padStart(3, '0')} 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${450 + contentLength}
%%EOF`;

  return Buffer.from(pdfContent, 'utf8');
}