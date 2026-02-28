import { Module } from '@nestjs/common';
import { EntriesController } from './presentation/entries.controller';
import { EntriesService } from './application/services/entries.service';
import { FreeDictionaryProvider } from './infrastructure/providers/free-dictionary.provider';
import { HistoryRepository } from './infrastructure/repositories/history.repository';
import { FavoriteRepository } from './infrastructure/repositories/favorite.repository';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EntriesController],
  providers: [
    EntriesService,
    {
      provide: 'IDictionaryProvider',
      useClass: FreeDictionaryProvider,
    },
    {
      provide: 'IHistoryRepository',
      useClass: HistoryRepository,
    },
    {
      provide: 'IFavoriteRepository',
      useClass: FavoriteRepository,
    },
  ],
  exports: ['IHistoryRepository', 'IFavoriteRepository'],
})
export class EntriesModule {}
