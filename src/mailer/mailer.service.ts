// mailer.service.ts
import { Injectable } from '@nestjs/common';
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
    // Initialize Resend with your API key
    this.resend = new Resend(process.env.RESEND_API_KEY || '');
    
    // Retrieve the "from" email and admin email from environment variables.
    this.fromEmail = process.env.FROM_EMAIL || '';
    this.adminEmail = process.env.ADMIN_EMAIL || this.fromEmail; // Fallback to FROM_EMAIL if ADMIN_EMAIL isn't set

    if (!this.fromEmail) {
      throw new Error('FROM_EMAIL is not set in the environment variables');
    }
  }

  async sendMail(mailerDto: MailerDto) {
    const { name, email, message } = mailerDto;

    // Construct the admin notification email (plain text)
    const adminSubject = `New message from ${name}`;
    const adminText = `You have received a new message from ${name} (${email}):\n\n${message}`;

    // Construct the user confirmation email in HTML format with a footer
    const userSubject = 'Confirmation: Your message has been sent';
    const userHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
          <div style="padding: 20px;">
            <p>Hi ${name},</p>
            <p>Thank you for reaching out. Your message has been sent successfully. We will get back to you shortly.</p>
            <p>Best regards,<br>The Southern Cartograper</p>
          </div>
          <footer style="background-color: #f1f1f1; padding: 10px; text-align: center;">
            <img src="https://grant-pie.github.io/southern-cartographer/assets/images/logo.png" alt="Company Logo" style="max-width: 100px;"/>
          </footer>
        </body>
      </html>
    `;

    try {
      // Send email to the admin
      const adminResponse = await this.resend.emails.send({
        from: this.fromEmail,
        to: this.adminEmail, // Admin's email address
        subject: adminSubject,
        text: adminText,
      });

      // Send confirmation email to the user using HTML content
      const userResponse = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: userSubject,
        html: userHtml,
      });

      return { adminResponse, userResponse };
    } catch (error) {
      console.error('Error sending emails:', error);
      throw new Error('Failed to send emails');
    }
  }
}
