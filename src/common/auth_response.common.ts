import { BasicResponse } from './basic_response.common';

export class AuthResponse extends BasicResponse {
  constructor(message: string, error: boolean, access_token: string) {
    super(message, error);

    this.access_token = access_token;
  }

  private access_token: string;
}
