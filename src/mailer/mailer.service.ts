import { Injectable, BadRequestException } from '@nestjs/common';
import { Resend } from 'resend';
import { MailerDto } from './mailer.dto';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailerService {
  private resend: Resend;
  private fromEmail: string;
  private adminEmail: string;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY || '');
    this.fromEmail = process.env.FROM_EMAIL || '';
    this.adminEmail = process.env.ADMIN_EMAIL || this.fromEmail;

    if (!this.fromEmail) {
      throw new Error('FROM_EMAIL');
    }
  }


  async sendMail(mailerDto: MailerDto) {
    const { name, email, message} = mailerDto;

    // Email sending logic remains unchanged
    const adminSubject = `New message from ${name}`;
    const adminText = `You have received a new message from ${name} (${email}):\n\n${message}`;
    const userSubject = 'Confirmation: Your message has been sent';
    const userHtml = `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <p>Hi ${name},</p>
          <p>Thank you for reaching out. We will get back to you shortly.</p>
          <footer style="text-align: center;">
            <img src="https://grant-pie.github.io/southern-cartographer/assets/images/logo.png" alt="Company Logo" style="max-width: 100px;"/>
          </footer>
        </body>
      </html>
    `;

    try {
      const adminResponse = await this.resend.emails.send({ from: this.fromEmail, to: this.adminEmail, subject: adminSubject, text: adminText });
      const userResponse = await this.resend.emails.send({ from: this.fromEmail, to: email, subject: userSubject, html: userHtml });
      return { adminResponse, userResponse };
    } catch (error) {
      console.error('Error sending emails:', error);
      throw new Error('Failed to send emails');
    }
  }
}
