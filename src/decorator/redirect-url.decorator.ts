import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RedirectUrl = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.query.redirectUrl || null;
  },
);
