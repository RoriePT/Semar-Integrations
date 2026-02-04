import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as puppeteer from 'puppeteer';
import { Payin } from 'src/payin/entities/payin.entity';
import { EmailService } from 'src/services/email/email.service';
import {
  amountToRupeesWords,
  getExtractedRecieptDetails,
} from 'src/utils/utils';
import { Repository } from 'typeorm';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Payin)
    private readonly payinRepository: Repository<Payin>,
    private readonly emailService: EmailService,
  ) {}
  // Template
  private renderTemplate(data: any): string {
    const amount = Number(data?.transactionDetails?.amount || 0);
    const tax = Number(data?.transactionDetails?.tax || 0);
    const total = amount + tax;

    return `<html>
  <head>
    <title>Receipt</title>
    <style>
      body {
        font-family: "Arial", sans-serif;
        padding: 20px;
        width: 210mm;
        min-height: 297mm;
        box-sizing: border-box;
        background: white;
        margin-inline: auto;
      }
      img {
        width: 100%;
      }
      h1, h2, h3, h4, h5, h6, p {
        margin: 0;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .header h1 {
        font-size: 48px;
      }
      .user_and_vendor_details {
        display: flex;
        justify-content: space-between;
        margin-top: 80px;
      }
      .transaction_order_details {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
      }
      th {
        background-color: rgba(0, 0, 0, 0.4);
      }
      th, td {
        border: 1px solid black;
        padding: 8px;
      }
    </style>
  </head>

  <body>
    <div style="margin-top: 20px">
      <div class="header">
        <div style="max-width: 200px">
          <img src="https://mobimerch.in/wp-content/uploads/2021/01/logo-final.webp" />
        </div>
        <div style="text-align: center">
          <h3>Tax Invoice/Bill of Supply/Cash Memo</h3>
          <p>(Original for Recipient)</p>
        </div>
      </div>
      <div class="user_and_vendor_details">
        <div>
          <h3>Merchant Details</h3>
          <div>Name: ${data?.merchantData?.name || ''}</div>
          <div>Phone: ${data?.merchantData?.phone || ''}</div>
          <div>Business Name: ${data?.merchantData?.businessName || ''}</div>
          <div>Business URL: ${data?.merchantData?.businessUrl || ''}</div>
        </div>
        <div style="text-align: right">
          <h3>User Details</h3>
          <div>Name: ${data?.userData?.name || ''}</div>
          <div>Email: ${data?.userData?.email || ''}</div>
          <div>Phone: ${data?.userData?.phone || ''}</div>
          <div>Payment Mode: ${data?.userData?.paymentMode || ''}</div>
        </div>
      </div>
      <div class="transaction_order_details">
        <div>
          <div><span style="font-weight: bold">GST No:</span> ${data?.merchantDetails?.gst || 'N/A'}</div>
          <div><span style="font-weight: bold">Order No:</span> ${data?.transactionDetails?.orderId || ''}</div>
          <div><span style="font-weight: bold">Order Date:</span> ${data?.transactionDetails?.orderDate || ''}</div>
        </div>
        <div style="text-align: right; max-width: 300px">
          <div><span style="font-weight: bold">Shipping Address</span></div>
          <div>${data?.userData?.name || ''}</div>
          <div>B-423, Main Road, Patel Nagar</div>
          <div>New Delhi</div>
        </div>
      </div>
      <div style="width: 100%; margin-top: 30px">
        <table style="width: 100%; border: 1px solid black; border-collapse: collapse">
          <thead>
            <tr>
              <th>Sr. no.</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Tax Amount</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                This is the receipt of the payment you have made to merchant - ${data?.merchantData?.name || ''} on ${data?.merchantData?.businessUrl || ''}
              </td>
              <td>₹${amount}</td>
              <td>₹${tax}</td>
              <td>₹${total}</td>
            </tr>
            <tr>
              <td colspan="3">Total:</td>
              <td>₹${tax}</td>
              <td>₹${total}</td>
            </tr>
            <tr style="font-weight: 700">
              <td colspan="5">Total Amount in words: ${amountToRupeesWords(total) || 'Zero'}</td>
            </tr>
          </tbody>
        </table>
        <div
          style="
            width: 100%;
            text-align: right;
            border: 1px solid black;
            border-top: none;
            padding: 10px;
            box-sizing: border-box;
            margin-top: 0;
          "
        >
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
            <div>Authorized Signatory</div>
            <img src="https://kingsgate-assets.s3.ap-southeast-1.amazonaws.com/kg_sign_33txbtrtimfnjmuti" alt="Authorized Signature" style="width: 120px; height: auto;" />
          </div>
        </div>
        <table
          style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-top: 30px; font-size: 12px"
        >
          <tbody>
            <tr>
              <td>Transaction Id: <br />${data?.transactionDetails?.transactionId || ''}</td>
              <td>Date & Time: ${data?.transactionDetails?.orderDate || ''}</td>
              <td>Invoice Value: ₹${total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </body>
</html>`;
  }

  async createReceipt({ orderId }: { orderId: string }) {
    const payinOrderDetails = await this.payinRepository.findOne({
      where: { systemOrderId: orderId },
      relations: ['merchant', 'user'],
    });

    if (!payinOrderDetails)
      throw new NotFoundException('Order details not found.');

    const data = getExtractedRecieptDetails({
      user: payinOrderDetails.user,
      merchant: payinOrderDetails.merchant,
      payin: payinOrderDetails,
    });

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    const htmlContent = this.renderTemplate(data);
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    await page.addStyleTag({
      content: `
        @page { size: A4; margin: 2cm; }
        body { font-family: 'Arial', sans-serif; }
      `,
    });
    const uint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
    });
    const pdfBuffer = Buffer.from(uint8Array);

    return pdfBuffer;
  }

  async createAndMailReceipt(systemOrderId, userEmail) {
    if (!userEmail || !systemOrderId) return;

    const receipt = await this.createReceipt({ orderId: systemOrderId });

    this.emailService.send({
      subject: 'Payment Receipt',
      text: 'Your payment receipt is ready to view or download',
      receiver: userEmail,
      attachment: receipt,
    });
  }
}
