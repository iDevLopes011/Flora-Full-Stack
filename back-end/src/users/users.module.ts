import { Module } from '@nestjs/common';
import { UsersService } from './application/services/users.service';
import { UsersController } from './presentation/users.controller';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { EntriesModule } from '../entries/entries.module';

@Module({
  imports: [EntriesModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
