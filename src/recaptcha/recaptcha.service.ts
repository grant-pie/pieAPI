// src/recaptcha/recaptcha.service.ts
import { Injectable } from '@nestjs/common';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

@Injectable()
export class RecaptchaService {
  private client: RecaptchaEnterpriseServiceClient;
  private projectId: string = 'PieAPI';
  private siteKey: string = 'YOUR_SITE_KEY';

  constructor() {
    this.client = new RecaptchaEnterpriseServiceClient();
  }

  async verifyToken(token: string, action: string = 'submit'): Promise<boolean> {
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