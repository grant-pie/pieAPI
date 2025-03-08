import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resend } from 'resend';
import * as sanitizeHtml from 'sanitize-html';
import * as validator from 'validator';
import * as dotenv from 'dotenv';
import { Email } from '../email/email.entity';

dotenv.config();

@Injectable()
export class MailerService {
  private resend: Resend;

  constructor(
    @InjectRepository(Email)
    private emailRepository: Repository<Email>
  ) {
    this.resend = new Resend(process.env.RESEND_API_KEY || '');
  }

  private sanitizeInput(input: string): string {
    return sanitizeHtml(input, {
      allowedTags: [], 
      allowedAttributes: {},
    }).trim();
  }

  private isValidEmail(email: string): boolean {
    return validator.isEmail(email);
  }

  async sendMail(senderIp: string, to: string, from: string, subject: string, text: string, serviceId: number) {
    // Validate and sanitize inputs
    if (!this.isValidEmail(to) || !this.isValidEmail(from)) {
      throw new BadRequestException('Invalid email format');
    }

    const sanitizedSubject = this.sanitizeInput(subject);
    const sanitizedText = this.sanitizeInput(text);

    try {
      // Send email via Resend
      const response = await this.resend.emails.send({
        from: from.trim(),
        to: to.trim(),
        subject: sanitizedSubject,
        text: sanitizedText,
      });

      // Create and save email record to database
      const emailRecord = this.emailRepository.create({
        senderIp: senderIp,
        recipient: to.trim(),
        sender: from.trim(),
        subject: sanitizedSubject,
        body: sanitizedText,
        serviceId: serviceId
      });

      try {
        const savedRecord = await this.emailRepository.save(emailRecord);
        console.log('Email record saved successfully:', savedRecord);
        return { response, emailRecord: savedRecord };
      } catch (dbError) {
        console.error('Error saving email record to database:', dbError);
        throw new Error(`Failed to save email record: ${dbError.message}`);
      }
    } catch (error) {
      console.error('Comprehensive error sending emails:', error);
      throw new Error(`Failed to send emails: ${error.message}`);
    }
  }
}