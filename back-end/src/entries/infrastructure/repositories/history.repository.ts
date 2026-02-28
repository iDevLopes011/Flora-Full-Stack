import { Injectable } from '@nestjs/common';
import { IHistoryRepository } from '../../domain/interfaces/history.repository.interface';
import { HistoryEntity } from '../../domain/entities/history.entity';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class HistoryRepository implements IHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(history: HistoryEntity): Promise<HistoryEntity> {
    const saved = await this.prisma.history.create({
      data: {
        id: history.id,
        userId: history.userId,
        word: history.word,
        viewedAt: history.viewedAt,
      },
    });
    return new HistoryEntity(saved);
  }

  async findAllByUser(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.history.count({ where: { userId } }),
      this.prisma.history.findMany({
        where: { userId },
        orderBy: { viewedAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: data.map((h) => new HistoryEntity(h)),
      total,
    };
  }
}
