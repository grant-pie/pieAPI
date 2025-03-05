import { Controller, Post, Body, UnauthorizedException, HttpException, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { MailerService } from 'src/mailer/mailer.service';
import { ServicesService } from '../services.service';
import { SouthernCartographerDto } from './southern-cartographer.dto';
import RecaptchaService from 'src/recaptcha/recaptcha.service';
import * as dotenv from 'dotenv';

@Controller('southern-cartographer')
export class SouthernCartographerController {
    constructor(
        private readonly mailerService: MailerService,
        private readonly recaptchaService: RecaptchaService,
        private readonly servicesService: ServicesService
    ) {}
    
    @Post('mail/send')
    async sendMail(
        @Body() southernCartographerDto: SouthernCartographerDto,
        @Req() request: Request
    ) {
        const messageIn = southernCartographerDto.message;
        const userTo = southernCartographerDto.email;
        const userFrom = process.env.SOUTHERN_CARTOGRAPHER_EMAIL || '';
        const userSubject = 'Confirmation: Your message has been sent';
        const userName = southernCartographerDto.name;
        const userText = `
        Hi ${userName},:\n\n
        Thank you for reaching out. We will get back to you shortly:\n\n.
        The Southern Cartographer
        `;

        const adminTo = process.env.SOUTHERN_CARTOGRAPHER_EMAIL || '';
        const adminFrom = adminTo;
        const adminSubject = `New message from ${userName}`;
        const adminText = `You have received a new message from ${userName} (${userTo}):\n\n${messageIn}`;

        // Get the client's IP address
        const clientIp = this.getClientIp(request);

        try {
            // Commented out reCAPTCHA verification
 
            const isValidToken = await this.recaptchaService.verify(
                southernCartographerDto.recaptchaToken
            );
            
            if (!isValidToken) {
                throw new UnauthorizedException('reCAPTCHA verification failed. Please try again.');
            }

            // Get service id by service name
            const serviceName = 'Southern Cartographer';
            const serviceId = await this.servicesService.getServiceIdByName(serviceName);

            // Send emails with client IP
            const adminMailResponse = await this.mailerService.sendMail(
                clientIp, 
                adminTo, 
                adminFrom, 
                adminSubject, 
                adminText, 
                serviceId
            );
            
            const userMailResponse = await this.mailerService.sendMail(
                clientIp, 
                userTo, 
                userFrom, 
                userSubject, 
                userText, 
                serviceId
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

    // Helper method to get client IP address
    private getClientIp(request: Request): string {
        // Check for forwarded IP (useful if behind a proxy)
        const forwardedFor = request.headers['x-forwarded-for'];
        if (forwardedFor) {
            // If multiple IPs, take the first one
            return Array.isArray(forwardedFor) 
                ? forwardedFor[0].toString().split(',')[0].trim()
                : forwardedFor.split(',')[0].trim();
        }

        // Fallback to connection remote address
        return request.socket.remoteAddress || '127.0.0.1';
    }
}