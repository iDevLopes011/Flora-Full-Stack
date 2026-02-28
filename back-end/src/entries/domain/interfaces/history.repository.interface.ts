import { HistoryEntity } from '../entities/history.entity';

export interface IHistoryRepository {
  save(history: HistoryEntity): Promise<HistoryEntity>;
  findAllByUser(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ data: HistoryEntity[]; total: number }>;
}
