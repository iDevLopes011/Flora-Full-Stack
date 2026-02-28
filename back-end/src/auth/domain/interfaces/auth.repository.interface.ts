import { AuthEntity } from '../entities/auth.entity';

export interface IAuthRepository {
  save(auth: AuthEntity): Promise<AuthEntity>;
  findByEmail(email: string): Promise<AuthEntity | null>;
  findById(id: string): Promise<AuthEntity | null>;
  findByUserId(userId: string): Promise<AuthEntity | null>;
  update(auth: AuthEntity): Promise<AuthEntity>;
  delete(id: string): Promise<void>;
}
