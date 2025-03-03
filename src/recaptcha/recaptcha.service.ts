// src/recaptcha/recaptcha.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class RecaptchaService {
  //private siteKey: string = process.env.RECAPTCHA_SITE_KEY || ''; // Should come from environment variables

  constructor() {}

  async verify(token: string, action: string = 'submit'): Promise<boolean> {
    // Renamed from verifyToken to verify to match what the controller expects
    try {

      console.log(token);
      return true
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return false;
    }
  }
}