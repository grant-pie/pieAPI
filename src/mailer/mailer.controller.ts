// src/mail/mail.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { RecaptchaService } from '../recaptcha/recaptcha.service';

class ContactDto {
  name: string;
  email: string;
  message: string;
  recaptchaToken: string;
}

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly recaptchaService: RecaptchaService,
  ) {}

  @Post('send')
  async sendEmail(@Body() contactDto: ContactDto) {
    // Verify reCAPTCHA token
    const isValidRecaptcha = await this.recaptchaService.verifyToken(
      contactDto.recaptchaToken,
      'submit'
    );

    if (!isValidRecaptcha) {
      throw new HttpException(
        'reCAPTCHA verification failed. Please try again.',
        HttpStatus.BAD_REQUEST
      );
    }

    // Send the email
    const result = await this.mailerService.sendContactEmail(
      contactDto.name,
      contactDto.email,
      contactDto.message
    );

    if (!result) {
      throw new HttpException(
        'Failed to send email. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return { success: true, message: 'Email sent successfully' };
  }
}