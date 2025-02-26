import { Controller, Post, Body } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('mail')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send')
  async sendMail(@Body() body: { to: string; subject: string; text: string }) {
    return this.mailerService.sendEmail(body.to, body.subject, body.text);
  }
}
