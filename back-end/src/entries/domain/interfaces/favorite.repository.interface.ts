import { FavoriteEntity } from '../entities/favorite.entity';

export interface IFavoriteRepository {
  save(favorite: FavoriteEntity): Promise<FavoriteEntity>;
  findByUserAndWord(
    userId: string,
    word: string,
  ): Promise<FavoriteEntity | null>;
  delete(userId: string, word: string): Promise<void>;
  findAllByUser(userId: string): Promise<FavoriteEntity[]>;
  findAllByUserPaginated(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ data: FavoriteEntity[]; total: number }>;
}
