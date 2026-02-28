import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: UserEntity): Promise<UserEntity> {
    const saved = await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
    return new UserEntity(saved);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const found = await this.prisma.user.findUnique({ where: { id } });
    return found ? new UserEntity(found) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const found = await this.prisma.user.findUnique({ where: { email } });
    return found ? new UserEntity(found) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => new UserEntity(u));
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        updatedAt: user.updatedAt,
      },
    });
    return new UserEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
