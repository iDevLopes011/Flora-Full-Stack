export interface ITokenProvider {
  generateAccessToken(userId: string, email: string): string;
  generateRefreshToken(userId: string): string;
  validateAccessToken(token: string): { userId: string; email: string } | null;
  validateRefreshToken(token: string): { userId: string } | null;
}
