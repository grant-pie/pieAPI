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

    // Construct the admin notification email
    const adminSubject = `New message from ${name}`;
    const adminText = `You have received a new message from ${name} (${email}):\n\n${message}`;

    // Construct the user confirmation email
    const userSubject = 'Confirmation: Your message has been sent';
    const userText = `Hi ${name},\n\nThank you for reaching out. Your message has been sent successfully. We will get back to you shortly.\n\nBest regards,\nYour Company Name`;

    try {
      // Send email to the admin
      const adminResponse = await this.resend.emails.send({
        from: this.fromEmail,
        to: this.adminEmail,
        subject: adminSubject,
        text: adminText,
      });
      console.log(email);
      // Send confirmation email to the user (using the email parameter from the request)
      const userResponse = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: userSubject,
        text: userText,
      });

      return { adminResponse, userResponse };
    } catch (error) {
      console.error('Error sending emails:', error);
      throw new Error('Failed to send emails');
    }
  }
}
