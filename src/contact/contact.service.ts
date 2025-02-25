import { Injectable } from '@nestjs/common';
import { ContactDto } from './contact.dto';

@Injectable()
export class ContactService {
  async sendEmail(contactDto: ContactDto) {
    // Here, we will later add the logic to send an email
    return { message: 'Your message has been received!', data: contactDto };
  }
}
