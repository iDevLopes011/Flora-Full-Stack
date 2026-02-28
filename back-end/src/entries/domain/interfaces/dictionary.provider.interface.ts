export interface IDictionaryProvider {
  searchWords(
    query: string,
    page: number,
    limit: number,
  ): Promise<{
    results: string[];
    totalDocs: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }>;
  getWordDetails(word: string): Promise<any>;
}
