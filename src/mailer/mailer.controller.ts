// src/mailer/mailer.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerDto } from './mailer.dto';
import { RecaptchaService } from '../recaptcha/recaptcha.service'; // Adjust the path as needed

@Controller('mail')
export class MailerController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly recaptchaService: RecaptchaService,
  ) {}

  @Post('send')
  async sendMail(@Body() mailerDto: MailerDto) {
    // Verify the reCAPTCHA token first
    const isValidToken = await this.recaptchaService.verify(
      mailerDto.recaptchaToken,
      'submit' // You can specify an action name for your contact form
    );
    
    if (!isValidToken) {
      throw new UnauthorizedException('reCAPTCHA verification failed. Please try again.');
    }
    
    // If verification passed, proceed with sending the email
    return this.mailerService.sendMail(mailerDto);
  }
}