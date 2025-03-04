import { Controller, Post, Body, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from 'src/mailer/mailer.service';
import { SouthernCartographerDto } from './southern-cartographer.dto';
import RecaptchaService from 'src/recaptcha/recaptcha.service';
import * as dotenv from 'dotenv';

@Controller('southern-cartographer')
export class SouthernCartographerController {
    constructor(
        private readonly mailerService: MailerService,
        private readonly recaptchaService: RecaptchaService,
      ) {}
    
      @Post('mail/send')
      async sendMail(@Body() southernCartographerDto: SouthernCartographerDto) {
        //to
        //from
        //subject
        //message

        const messageIn = southernCartographerDto.message;
        const userTo = southernCartographerDto.email;
        const userFrom = process.env.SOUTHERN_CARTOGRAPHER_EMAIL || '';
        const userSubject = 'Confirmation: Your message has been sent';
        const userName = southernCartographerDto.name;
        const userText = `
        Hi ${userName},:\n\n
        Thank you for reaching out. We will get back to you shortly:\n\n.
        The Southern Cartographer
        `;;
        

        const adminTo = process.env.SOUTHERN_CARTOGRAPHER_EMAIL || '';
        const adminFrom = adminTo;
        const adminSubject = `New message from ${userName}`;
        const adminText = `You have received a new message from ${userName} (${userTo}):\n\n${messageIn}`;
    
        try {
          // Verify the reCAPTCHA token first
    
          const isValidToken = await this.recaptchaService.verify(
            southernCartographerDto.recaptchaToken
          );
          
          if (!isValidToken) {
            throw new UnauthorizedException('reCAPTCHA verification failed. Please try again.');
          }
          
          // If verification passed, proceed with sending the email
          const adminMailResponse = await this.mailerService.sendMail(adminTo, adminFrom, adminSubject, adminText);
          const userMailResponse = await this.mailerService.sendMail(userTo, userFrom, userSubject, userText);
       
   
          return { success: true, message: 'Email sent successfully', data : {adminMailResponse, userMailResponse}};
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