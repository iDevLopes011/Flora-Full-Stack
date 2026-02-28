import { HttpException, HttpStatus } from '@nestjs/common';

export class WordNotFoundException extends HttpException {
  constructor(word: string) {
    super(`Word '${word}' not found in dictionary`, HttpStatus.NOT_FOUND);
  }
}
