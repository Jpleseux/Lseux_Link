export class apiError extends Error {
  public readonly statusCode: number;
  public readonly internalMessage: string;
  constructor(message: string, statusCode: number, internalMessage: string) {
    super(message);
    this.statusCode = statusCode;
    this.internalMessage = internalMessage;
  }
}
