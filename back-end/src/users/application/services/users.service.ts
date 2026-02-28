import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import type { IHistoryRepository } from '../../../entries/domain/interfaces/history.repository.interface';
import type { IFavoriteRepository } from '../../../entries/domain/interfaces/favorite.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
    @Inject('IFavoriteRepository')
    private readonly favoriteRepository: IFavoriteRepository,
  ) {}

  async create(data: { name: string; email: string }) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new UserAlreadyExistsException(
        `User with email ${data.email} already exists`,
      );
    }

    const user = new UserEntity({
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedUser = await this.userRepository.save(user);

    return savedUser;
  }

  async getUserProfile(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException(`User not found`);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async getUserHistory(userId: string, page: number, limit: number) {
    const result = await this.historyRepository.findAllByUser(
      userId,
      page,
      limit,
    );

    return {
      results: result.data.map((h) => ({
        word: h.word,
        added: h.viewedAt.toISOString(),
      })),
      totalDocs: result.total,
      page: page,
      totalPages: Math.ceil(result.total / limit) || 1,
      hasNext: page < Math.ceil(result.total / limit),
      hasPrev: page > 1,
    };
  }

  async getUserFavorites(userId: string, page: number, limit: number) {
    const result = await this.favoriteRepository.findAllByUserPaginated(
      userId,
      page,
      limit,
    );

    return {
      results: result.data.map((f) => ({
        word: f.word,
        added: f.addedAt.toISOString(),
      })),
      totalDocs: result.total,
      page: page,
      totalPages: Math.ceil(result.total / limit) || 1,
      hasNext: page < Math.ceil(result.total / limit),
      hasPrev: page > 1,
    };
  }
}
