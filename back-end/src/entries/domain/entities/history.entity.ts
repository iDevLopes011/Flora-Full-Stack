export class HistoryEntity {
  id: string;
  userId: string;
  word: string;
  viewedAt: Date;

  constructor(props: {
    id: string;
    userId: string;
    word: string;
    viewedAt: Date;
  }) {
    Object.assign(this, props);
  }
}
