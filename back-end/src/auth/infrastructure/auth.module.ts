import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/auth/application/services/auth.service';
import { AuthController } from 'src/auth/presentation/auth.controller';
import { AuthRepository } from 'src/auth/infrastructure/repositories/auth.repository';
import { TokenProvider } from 'src/auth/infrastructure/providers/token.provider';
import { PasswordProvider } from 'src/auth/infrastructure/providers/password.provider';
import { JwtStrategy } from 'src/auth/infrastructure/strategies/jwt.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
    {
      provide: 'ITokenProvider',
      useClass: TokenProvider,
    },
    {
      provide: 'IPasswordProvider',
      useClass: PasswordProvider,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
