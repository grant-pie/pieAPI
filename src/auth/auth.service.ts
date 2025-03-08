import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findOrCreateUser(userData: Partial<User>): Promise<User> {
    // First try to find by googleId if available
    let user: User | null = null;
    
    if (userData.googleId) {
      user = await this.userRepository.findOne({ where: { googleId: userData.googleId } });
    }
    
    // If not found by googleId, try by email
    if (!user && userData.email) {
      user = await this.userRepository.findOne({ where: { email: userData.email } });
      
      // If user exists but doesn't have googleId, update it
      if (user && userData.googleId && !user.googleId) {
        user.googleId = userData.googleId;
        user = await this.userRepository.save(user);
      }
    }
    
    // If user doesn't exist at all, create a new one
    if (!user) {
      user = this.userRepository.create(userData);
      user = await this.userRepository.save(user);
    }
    
    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  generateJwtToken(user: User): string {
    const payload = {
      email: user.email,
      sub: user.id,
    };
    return this.jwtService.sign(payload);
  }
}