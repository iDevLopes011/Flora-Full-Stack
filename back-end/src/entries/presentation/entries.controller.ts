import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EntriesService } from '../application/services/entries.service';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';

@ApiTags('Entries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Get('en')
  @ApiOperation({ summary: 'Lista palavras em inglês com paginação' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Termo para buscar no início/meio da palavra',
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
  @ApiResponse({
    status: 200,
    description: 'Lista de palavras retornada com sucesso.',
  })
  async search(
    @Query('search') search: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ) {
    const l = limit ? parseInt(limit, 10) : 10;
    const p = page ? parseInt(page, 10) : 1;

    return this.entriesService.searchEntries(search, l, p);
  }

  @Get('en/:word')
  @ApiOperation({
    summary: 'Retorna os detalhes e significados de uma palavra inteira',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da palavra retornados (via Free Dictionary API).',
  })
  @ApiResponse({ status: 404, description: 'Palavra não encontrada.' })
  async getWordDetails(
    @Param('word') word: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user?.id;
    const result = await this.entriesService.getWordDetails(userId, word);

    res.setHeader('x-cache', result.cache);
    res.setHeader('x-response-time', `${result.responseTime}ms`);

    return result.data;
  }

  @Post('en/:word/favorite')
  @ApiOperation({
    summary: 'Salva uma palavra como favorita para o usuário logado',
  })
  @ApiResponse({ status: 201, description: 'Palavra favoritada.' })
  async favoriteWord(@Param('word') word: string, @Req() req: any) {
    const userId = req.user?.id;
    return this.entriesService.favoriteWord(userId, word);
  }

  @Delete('en/:word/unfavorite')
  @ApiOperation({
    summary: 'Remove uma palavra dos favoritos do usuário logado',
  })
  @ApiResponse({ status: 200, description: 'Palavra desfavoritada.' })
  async unfavoriteWord(@Param('word') word: string, @Req() req: any) {
    const userId = req.user?.id;
    return this.entriesService.unfavoriteWord(userId, word);
  }
}
