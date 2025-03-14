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
    
    const messageIn = mailerDto.message;
    const userTo = mailerDto.email;
    const userFrom = process.env.SOUTHERN_CARTOGRAPHER_EMAIL || '';
    const userSubject = 'Confirmation: Your message has been sent';
    const userName = mailerDto.name;
    const userText = `
    Hi ${userName},:\n\n
    Thank you for reaching out. We will get back to you shortly:\n\n.
    The Southern Cartographer
    `;

    const adminTo = process.env.SOUTHERN_CARTOGRAPHER_EMAIL || '';
    const adminFrom = adminTo;
    const adminSubject = `New message from ${userName}`;
    const adminText = `You have received a new message from ${userName} (${userTo}):\n\n${messageIn}`;

    try {
        // Commented out reCAPTCHA verification
        /*
        const isValidToken = await this.recaptchaService.verify(
            mailerDto.recaptchaToken
        );
        
        if (!isValidToken) {
            throw new UnauthorizedException('reCAPTCHA verification failed. Please try again.');
        }*/

        // Send emails with client IP
        const adminMailResponse = await this.mailerService.sendMail(
            adminTo, 
            adminFrom, 
            adminSubject, 
            adminText, 
        );
        
        const userMailResponse = await this.mailerService.sendMail(
            userTo, 
            userFrom, 
            userSubject, 
            userText, 
        );
   
        return { 
            success: true, 
            message: 'Email sent successfully', 
            data: { adminMailResponse, userMailResponse }
        };
    } catch (error) {
        if (error instanceof UnauthorizedException) {
            throw error;
        }
        
        console.error('Error sending email:', error);
        throw new HttpException(
            'Failed to send email. Please try again later.',
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
    
}