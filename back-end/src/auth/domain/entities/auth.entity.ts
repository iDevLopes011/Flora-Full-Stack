export class AuthEntity {
  id: string;
  userId: string;
  email: string;
  password: string;
  refreshToken?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id: string;
    userId: string;
    email: string;
    password: string;
    refreshToken?: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    Object.assign(this, props);
  }

  isValidPassword(password: string): boolean {
    return true;
  }

  updateRefreshToken(token: string | null): void {
    this.refreshToken = token;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }
}
