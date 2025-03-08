// src/auth/auth.controller.ts
import { Controller, Get, Req, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';

// Add interface to extend Express Request
interface RequestWithUser extends Request {
  user?: User;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Initiates the Google OAuth flow
    // Implementation handled by Passport
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    // Check if user exists in the request
    if (!req.user) {
      throw new UnauthorizedException('Authentication failed');
    }
    
    const user = req.user;
    const token = this.authService.generateJwtToken(user);
    
    // Determine where to redirect after successful login
    const clientUrl = this.configService.get<string>('CLIENT_URL', 'http://localhost:3000');
    const redirectUrl = `${clientUrl}?token=${token}`;
    
    res.redirect(redirectUrl);
  }

  // Example of a protected route that requires authentication
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
}