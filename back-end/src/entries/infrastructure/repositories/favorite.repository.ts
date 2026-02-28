import { Injectable } from '@nestjs/common';
import { IFavoriteRepository } from '../../domain/interfaces/favorite.repository.interface';
import { FavoriteEntity } from '../../domain/entities/favorite.entity';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class FavoriteRepository implements IFavoriteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(favorite: FavoriteEntity): Promise<FavoriteEntity> {
    const saved = await this.prisma.favorite.upsert({
      where: {
        userId_word: { userId: favorite.userId, word: favorite.word },
      },
      update: {
        isActive: true,
      },
      create: {
        id: favorite.id,
        userId: favorite.userId,
        word: favorite.word,
        isActive: favorite.isActive,
        addedAt: favorite.addedAt,
      },
    });
    return new FavoriteEntity(saved);
  }

  async findByUserAndWord(
    userId: string,
    word: string,
  ): Promise<FavoriteEntity | null> {
    const found = await this.prisma.favorite.findFirst({
      where: {
        userId,
        word,
        isActive: true,
      },
    });
    return found ? new FavoriteEntity(found) : null;
  }

  async delete(userId: string, word: string): Promise<void> {
    await this.prisma.favorite.update({
      where: {
        userId_word: { userId, word },
      },
      data: {
        isActive: false,
      },
    });
  }

  async findAllByUser(userId: string): Promise<FavoriteEntity[]> {
    throw new Error(
      'Paginator requires limit and page now, implemented in UsersService.',
    );
  }

  async findAllByUserPaginated(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.favorite.count({ where: { userId, isActive: true } }),
      this.prisma.favorite.findMany({
        where: { userId, isActive: true },
        orderBy: { addedAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: data.map((f) => new FavoriteEntity(f)),
      total,
    };
  }
}
