import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Check for authentication logic here
    if (this.isValidHeader(req)) {
      // If authenticated, proceed to the next middleware or route handler
      next();
    } else {
      // If not authenticated, send an unauthorized response
      res.status(HttpStatus.UNAUTHORIZED).json({
        error: true,
        message: 'Unauthorized',
      });
    }
  }

  private isValidHeader(req: Request): boolean {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (!token || !type) {
      return false;
    }

    const content_type = req.headers['content-type'];

    if (type !== 'Bearer' || content_type !== 'application/json') {
      return false;
    }

    return true;
  }
}
