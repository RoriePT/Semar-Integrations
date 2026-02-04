import { Injectable } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';

const SendGrid = require('@sendgrid/mail');

@Injectable()
export class EmailService {
  constructor() {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async send(mailInfo: {
    subject: string;
    text: string;
    receiver: string;
    attachment?: Buffer;
  }): Promise<void> {
    const mail: MailDataRequired = {
      from: {
        name: 'Support',
        email: 'ishikagulia.twilio@gmail.com',
      },

      to: mailInfo.receiver,
      subject: mailInfo.subject,
      text: mailInfo.text,
      html: mailInfo.text,
      attachments: mailInfo.attachment
        ? [
            {
              content: mailInfo.attachment.toString('base64'),
              filename: 'attachment.pdf',
              type: 'application/pdf',
              disposition: 'attachment',
            },
          ]
        : [],
    };

    try {
      await SendGrid.send(mail);
    } catch (error) {
      console.log({ error: error?.response?.body?.errors });
    }
  }
}
