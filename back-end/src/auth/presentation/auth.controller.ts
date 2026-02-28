import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from 'src/auth/application/services/auth.service';
import { LoginAuthDto } from 'src/auth/application/dtos/login-auth.dto';
import { RegisterAuthDto } from 'src/auth/application/dtos/register-auth.dto';
import { RefreshTokenDto } from 'src/auth/application/dtos/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cadastra um novo usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário cadastrado com sucesso e token retornado.',
  })
  @ApiResponse({
    status: 400,
    description: 'E-mail já cadastrado ou campos inválidos.',
  })
  async signup(@Body() registerDto: RegisterAuthDto) {
    const result = await this.authService.register(registerDto);
    return {
      id: result.user.id,
      name: result.user.name,
      token: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza login e devolve o Token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com credenciais corretas.',
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async signin(@Body() loginDto: LoginAuthDto) {
    const result = await this.authService.login(loginDto);
    return {
      id: result.user.id,
      name: result.user.name,
      token: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Atualiza o token de acesso usando o refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Novos tokens gerados e retornados.',
  })
  @ApiResponse({
    status: 400,
    description: 'refreshToken ausente ou inválido.',
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token expirado ou inválido.',
  })
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desloga o usuário (invalida o refresh token)' })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Token Ausente.' })
  async logout(@Req() req: any) {
    const userId = req.user.id;
    return this.authService.logout(userId);
  }
}
