export class UserEntity {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    Object.assign(this, props);
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  updateDetails(name?: string, email?: string): void {
    if (name) this.name = name;
    if (email) this.email = email;
    this.updatedAt = new Date();
  }
}
