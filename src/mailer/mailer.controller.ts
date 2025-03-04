// src/mailer/mailer.controller.ts
//Do not use this controller it is for testing only
import { Controller, Post, Body, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerDto } from './mailer.dto';
import RecaptchaService from '../recaptcha/recaptcha.service';

@Controller('mail')
export class MailerController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly recaptchaService: RecaptchaService,
  ) {}

  @Post('send')
  async sendMail(@Body() mailerDto: MailerDto) {
    /*
    try {
      // Verify the reCAPTCHA token first
      const isValidToken = await this.recaptchaService.verify(
        mailerDto.recaptchaToken
      );
      
      if (!isValidToken) {
        throw new UnauthorizedException('reCAPTCHA verification failed. Please try again.');
      }
      
      // If verification passed, proceed with sending the email
      //const result = await this.mailerService.sendMail(mailerDto);
      return { success: true, message: 'Email sent successfully', data: {} };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      console.error('Error sending email:', error);
      throw new HttpException(
        'Failed to send email. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }*/
    return true
  }
    
}