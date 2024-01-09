export class BasicResponse {
  constructor(message: string, error: boolean) {
    this.message = message;
    this.error = error;
  }

  private message: string;
  private error: boolean;
  private timestamp: Date = new Date();
  private version = '1.0.0';
}
