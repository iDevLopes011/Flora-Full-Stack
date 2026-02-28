import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import type { IDictionaryProvider } from '../../domain/interfaces/dictionary.provider.interface';
import type { IHistoryRepository } from '../../domain/interfaces/history.repository.interface';
import type { IFavoriteRepository } from '../../domain/interfaces/favorite.repository.interface';
import { HistoryEntity } from '../../domain/entities/history.entity';
import { FavoriteEntity } from '../../domain/entities/favorite.entity';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class EntriesService {
  constructor(
    @Inject('IDictionaryProvider')
    private readonly dictionaryProvider: IDictionaryProvider,
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
    @Inject('IFavoriteRepository')
    private readonly favoriteRepository: IFavoriteRepository,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  async searchEntries(search: string, limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;

    if (!search) {
      const where = {};
      const [totalDocs, data] = await Promise.all([
        this.prisma.dictionaryWord.count({ where }),
        this.prisma.dictionaryWord.findMany({
          where,
          skip,
          take: limit,
          orderBy: { word: 'asc' },
        }),
      ]);

      const totalPages = Math.ceil(totalDocs / limit) || 1;
      return {
        results: data.map((d) => d.word),
        totalDocs,
        page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };
    }

    const q = search.toLowerCase();

    const where = {
      word: { startsWith: q },
    };

    const [totalDocs, data] = await Promise.all([
      this.prisma.dictionaryWord.count({ where }),
      this.prisma.dictionaryWord.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ word: 'asc' }],
      }),
    ]);

    const sorted = data;

    const totalPages = Math.ceil(totalDocs / limit) || 1;

    return {
      results: sorted.map((d) => d.word),
      totalDocs,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async getWordDetails(userId: string, word: string) {
    const start = performance.now();
    const cacheKey = `word:${word}`;

    const cachedDetails = await this.cacheManager.get(cacheKey);

    if (cachedDetails) {
      this.registerHistory(userId, word);
      const responseTime = Math.round(performance.now() - start);
      return {
        data: cachedDetails,
        cache: 'HIT',
        responseTime,
      };
    }

    const details = await this.dictionaryProvider.getWordDetails(word);

    await this.cacheManager.set(cacheKey, details);

    this.registerHistory(userId, word);

    const responseTime = Math.round(performance.now() - start);
    return {
      data: details,
      cache: 'MISS',
      responseTime,
    };
  }

  private async registerHistory(userId: string, word: string) {
    try {
      const history = new HistoryEntity({
        id: crypto.randomUUID(),
        userId,
        word,
        viewedAt: new Date(),
      });
      await this.historyRepository.save(history);
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }

  async favoriteWord(userId: string, word: string) {
    const existing = await this.favoriteRepository.findByUserAndWord(
      userId,
      word,
    );
    if (existing) {
      return existing;
    }

    const favorite = new FavoriteEntity({
      id: crypto.randomUUID(),
      userId,
      word,
      isActive: true,
      addedAt: new Date(),
      updatedAt: new Date(),
    });

    await this.favoriteRepository.save(favorite);
    return { success: true, word };
  }

  async unfavoriteWord(userId: string, word: string) {
    await this.favoriteRepository.delete(userId, word);
    return { success: true, word };
  }
}
