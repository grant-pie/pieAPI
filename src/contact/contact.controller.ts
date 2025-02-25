import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from './contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async handleContactForm(@Body() contactDto: ContactDto) {
    try {
      await this.contactService.sendEmail(contactDto);
      return { message: 'Message sent successfully' };
    } catch (error) {
      return { message: 'Failed to send message', error };
    }
  }
}
