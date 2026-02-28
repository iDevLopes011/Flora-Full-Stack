import { Injectable, Inject } from '@nestjs/common';
import { LoginAuthDto } from 'src/auth/application/dtos/login-auth.dto';
import { RegisterAuthDto } from 'src/auth/application/dtos/register-auth.dto';
import { UsersService } from 'src/users/application/services/users.service';
import type { IAuthRepository } from 'src/auth/domain/interfaces/auth.repository.interface';
import type { ITokenProvider } from 'src/auth/domain/interfaces/token.provider.interface';
import type { IPasswordProvider } from 'src/auth/domain/interfaces/password.provider.interface';
import { AuthEntity } from 'src/auth/domain/entities/auth.entity';
import { InvalidCredentialsException } from 'src/auth/domain/exceptions/invalid-credentials.exception';
import { UserNotFoundException } from 'src/auth/domain/exceptions/user-not-found.exception';
import { AuthAlreadyExistsException } from 'src/auth/domain/exceptions/auth-already-exists.exception';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
    @Inject('ITokenProvider')
    private readonly tokenProvider: ITokenProvider,
    @Inject('IPasswordProvider')
    private readonly passwordProvider: IPasswordProvider,
    private readonly usersService: UsersService,
  ) {}

  async register(registerDto: RegisterAuthDto) {
    const existingAuth = await this.authRepository.findByEmail(
      registerDto.email,
    );

    if (existingAuth) {
      throw new AuthAlreadyExistsException(
        `Auth with email ${registerDto.email} already exists`,
      );
    }

    const hashedPassword = await this.passwordProvider.hash(
      registerDto.password,
    );

    const createdUser = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
    });

    const auth = new AuthEntity({
      id: crypto.randomUUID(),
      userId: createdUser.id,
      email: registerDto.email,
      password: hashedPassword,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedAuth = await this.authRepository.save(auth);

    const accessToken = this.tokenProvider.generateAccessToken(
      savedAuth.userId,
      savedAuth.email,
    );
    const refreshToken = this.tokenProvider.generateRefreshToken(
      savedAuth.userId,
    );

    auth.updateRefreshToken(refreshToken);
    await this.authRepository.update(auth);

    return {
      accessToken,
      refreshToken,
      user: {
        id: savedAuth.id,
        userId: savedAuth.userId,
        email: savedAuth.email,
        name: createdUser.name,
      },
    };
  }

  async login(loginDto: LoginAuthDto) {
    const auth = await this.authRepository.findByEmail(loginDto.email);

    if (!auth) {
      throw new InvalidCredentialsException('Credenciais inválidas');
    }

    const isPasswordValid = await this.passwordProvider.compare(
      loginDto.password,
      auth.password,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException('Credenciais inválidas');
    }

    const accessToken = this.tokenProvider.generateAccessToken(
      auth.userId,
      auth.email,
    );
    const refreshToken = this.tokenProvider.generateRefreshToken(auth.userId);

    auth.updateRefreshToken(refreshToken);
    await this.authRepository.update(auth);

    const user = await this.usersService.getUserProfile(auth.userId);

    return {
      accessToken,
      refreshToken,
      user: {
        id: auth.id,
        userId: auth.userId,
        email: auth.email,
        name: user.name,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    const payload = this.tokenProvider.validateRefreshToken(refreshToken);

    if (!payload) {
      throw new InvalidCredentialsException('Invalid refresh token');
    }

    const auth = await this.authRepository.findByUserId(payload.userId);

    if (!auth || auth.refreshToken !== refreshToken) {
      throw new InvalidCredentialsException('Refresh token does not match');
    }

    const newAccessToken = this.tokenProvider.generateAccessToken(
      auth.userId,
      auth.email,
    );
    const newRefreshToken = this.tokenProvider.generateRefreshToken(
      auth.userId,
    );

    auth.updateRefreshToken(newRefreshToken);
    await this.authRepository.update(auth);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string) {
    const auth = await this.authRepository.findByUserId(userId);

    if (!auth) {
      throw new UserNotFoundException('User not found');
    }

    auth.updateRefreshToken(null);
    await this.authRepository.update(auth);

    return { success: true };
  }
}
