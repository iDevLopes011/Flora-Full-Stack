export class AuthAlreadyExistsException extends Error {
  constructor(message: string = 'Auth already exists') {
    super(message);
    this.name = 'AuthAlreadyExistsException';
  }
}
