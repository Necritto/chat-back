export class BaseError extends Error {
  constructor(public statusCode: number, public errorMessage: string) {
    super();
  }
}
