import {
  Controller,
  Get,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from '../application/services/users.service';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';

@ApiTags('User Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user/me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retorna o perfil do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil detalhado do usuário retornado.',
  })
  async getProfile(@Req() req: any) {
    const userId = req.user?.id;
    return this.usersService.getUserProfile(userId);
  }

  @Get('history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retorna o histórico de palavras visualizadas pelo usuário',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Quantidade de itens por página (padrão: 10)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Página atual (padrão: 1)',
  })
  @ApiResponse({ status: 200, description: 'Lista paginada do histórico.' })
  async getHistory(
    @Req() req: any,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const userId = req.user?.id;
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 10;

    return this.usersService.getUserHistory(userId, p, l);
  }

  @Get('favorites')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retorna a lista de palavras favoritadas pelo usuário',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Quantidade de itens por página (padrão: 10)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Página atual (padrão: 1)',
  })
  @ApiResponse({ status: 200, description: 'Lista paginada de favoritos.' })
  async getFavorites(
    @Req() req: any,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const userId = req.user?.id;
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 10;

    return this.usersService.getUserFavorites(userId, p, l);
  }
}
