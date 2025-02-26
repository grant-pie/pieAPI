import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailerService {
  private resend: Resend;
  private fromEmail: string;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY || '');
    
    // Ensure FROM_EMAIL is defined
    this.fromEmail = process.env.FROM_EMAIL || '';
    if (!this.fromEmail) {
      throw new Error('FROM_EMAIL is not set in the environment variables');
    }
  }

  async sendEmail(to: string, subject: string, text: string) {
    try {
      const response = await this.resend.emails.send({
        from: this.fromEmail, // Now always a string
        to,
        subject,
        text,
      });
      return response;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
