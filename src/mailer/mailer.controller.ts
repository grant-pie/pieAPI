import { Controller, Post, Body } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerDto } from './mailer.dto';

@Controller('mail')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send')
  async sendMail(@Body() mailerDto: MailerDto) {
    return this.mailerService.sendMail(mailerDto);
  }
}
