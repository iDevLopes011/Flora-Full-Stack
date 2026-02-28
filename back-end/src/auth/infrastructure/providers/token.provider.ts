import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenProvider } from 'src/auth/domain/interfaces/token.provider.interface';

@Injectable()
export class TokenProvider implements ITokenProvider {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  generateRefreshToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  validateAccessToken(token: string): { userId: string; email: string } | null {
    try {
      const payload = this.jwtService.verify(token);
      return { userId: payload.sub, email: payload.email };
    } catch {
      return null;
    }
  }

  validateRefreshToken(token: string): { userId: string } | null {
    try {
      const payload = this.jwtService.verify(token);
      return { userId: payload.sub };
    } catch {
      return null;
    }
  }
}
