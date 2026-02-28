import { Injectable } from '@nestjs/common';
import { IDictionaryProvider } from '../../domain/interfaces/dictionary.provider.interface';
import { WordNotFoundException } from '../../domain/exceptions/word-not-found.exception';

@Injectable()
export class FreeDictionaryProvider implements IDictionaryProvider {
  private MOCK_WORDS = [
    'fire',
    'firefly',
    'fireplace',
    'fireman',
    'firefox',
    'water',
    'waterfall',
    'earth',
    'wind',
    'sun',
    'moon',
    'test',
    'computer',
    'keyboard',
    'mouse',
    'monitor',
    'developer',
    'code',
    'javascript',
    'typescript',
    'nest',
  ];

  async searchWords(query: string, page: number, limit: number) {
    const term = (query || '').toLowerCase();
    const filtered = this.MOCK_WORDS.filter((w) => w.includes(term));

    const totalDocs = filtered.length;
    const totalPages = Math.ceil(totalDocs / limit);
    const start = (page - 1) * limit;
    const dataSlice = filtered.slice(start, start + limit);

    return {
      results: dataSlice,
      totalDocs,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async getWordDetails(word: string): Promise<any> {
    try {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new WordNotFoundException(word);
        }
        throw new Error(
          `Failed to fetch from Free Dictionary API: ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof WordNotFoundException) {
        throw error;
      }
      throw new Error(
        `Error communicating with dictionary API: ${error.message}`,
      );
    }
  }
}
