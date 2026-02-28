export class FavoriteEntity {
  id: string;
  userId: string;
  word: string;
  isActive: boolean;
  addedAt: Date;
  updatedAt: Date;

  constructor(props: {
    id: string;
    userId: string;
    word: string;
    isActive: boolean;
    addedAt: Date;
    updatedAt: Date;
  }) {
    Object.assign(this, props);
  }
}
