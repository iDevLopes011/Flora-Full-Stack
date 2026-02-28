import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordProvider } from 'src/auth/domain/interfaces/password.provider.interface';

@Injectable()
export class PasswordProvider implements IPasswordProvider {
  async hash(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
