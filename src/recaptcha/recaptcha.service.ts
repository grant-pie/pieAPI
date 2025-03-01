// src/recaptcha/recaptcha.service.ts
import { Injectable } from '@nestjs/common';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

@Injectable()
export class RecaptchaService {
  private client: RecaptchaEnterpriseServiceClient;
  private projectId: string = process.env.RECAPTCHA_PROJECT_ID || ''; // Should come from environment variables
  private siteKey: string = process.env.RECAPTCHA_SITE_KEY || ''; // Should come from environment variables

  constructor() {
    // Initialize the client with Google credentials
    this.client = new RecaptchaEnterpriseServiceClient({
      // If using service account key, you can specify it here
      // keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }

  async verify(token: string, action: string = 'submit'): Promise<boolean> {
    // Renamed from verifyToken to verify to match what the controller expects
    try {
      const projectPath = this.client.projectPath(this.projectId);
      
      const request = {
        parent: projectPath,
        assessment: {
          event: {
            token: token,
            siteKey: this.siteKey,
          },
        },
      };

      const [assessment] = await this.client.createAssessment(request);
      
      // Check if tokenProperties exists
      if (!assessment || !assessment.tokenProperties) {
        console.error('Invalid assessment or missing token properties');
        return false;
      }
      
      // Check if the token is valid
      if (!assessment.tokenProperties.valid) {
        console.error('Invalid reCAPTCHA token');
        return false;
      }
      
      // Check if the action matches
      if (assessment.tokenProperties.action !== action) {
        console.error('reCAPTCHA action mismatch');
        return false;
      }

      // Check if riskAnalysis exists and has a score
      if (!assessment.riskAnalysis || assessment.riskAnalysis.score === undefined || assessment.riskAnalysis.score === null) {
        console.error('Missing risk analysis or score');
        return false;
      }

      // Now we can safely use the score
      const score = assessment.riskAnalysis.score;
      console.log(`reCAPTCHA score: ${score}`);
      
      // Use a default threshold of 0.5 if score is valid
      return score > 0.5;
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return false;
    }
  }
}