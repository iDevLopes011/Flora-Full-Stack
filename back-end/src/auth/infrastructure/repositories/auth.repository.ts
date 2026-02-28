import { Injectable } from '@nestjs/common';
import { IAuthRepository } from 'src/auth/domain/interfaces/auth.repository.interface';
import { AuthEntity } from 'src/auth/domain/entities/auth.entity';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(auth: AuthEntity): Promise<AuthEntity> {
    const saved = await this.prisma.auth.create({
      data: {
        id: auth.id,
        userId: auth.userId,
        email: auth.email,
        password: auth.password,
        refreshToken: auth.refreshToken,
        isActive: auth.isActive,
        createdAt: auth.createdAt,
        updatedAt: auth.updatedAt,
      },
    });

    return new AuthEntity(saved);
  }

  async findByEmail(email: string): Promise<AuthEntity | null> {
    const found = await this.prisma.auth.findUnique({
      where: { email },
    });

    return found ? new AuthEntity(found) : null;
  }

  async findById(id: string): Promise<AuthEntity | null> {
    const found = await this.prisma.auth.findUnique({
      where: { id },
    });

    return found ? new AuthEntity(found) : null;
  }

  async findByUserId(userId: string): Promise<AuthEntity | null> {
    const found = await this.prisma.auth.findUnique({
      where: { userId },
    });

    return found ? new AuthEntity(found) : null;
  }

  async update(auth: AuthEntity): Promise<AuthEntity> {
    const updated = await this.prisma.auth.update({
      where: { id: auth.id },
      data: {
        email: auth.email,
        password: auth.password,
        refreshToken: auth.refreshToken,
        isActive: auth.isActive,
        updatedAt: auth.updatedAt,
      },
    });

    return new AuthEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.auth.delete({
      where: { id },
    });
  }
}
