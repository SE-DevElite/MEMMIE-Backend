import { BasicResponse } from './basic_response.common';

export class DailyMemoryResponse extends BasicResponse {
  constructor(message: string, error: boolean, calendar: any[][]) {
    super(message, error);

    this.calendar = calendar;
  }

  private calendar: any[];
}
