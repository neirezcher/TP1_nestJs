// middleware/auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";

dotenv.config()
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    // extending the Request object with the user property
    use(req: Request  & { user?: any }, res: Response, next: NextFunction) {
    const authToken = req.headers['auth-user'];
    if (!authToken) {
    throw new UnauthorizedException('No authentication token provided');
    }
    let token: string;
    if (Array.isArray(authToken)) {
    token = authToken.join('');
    } else {
      token = authToken; }
    try {
      const decodedToken: any = jwt.verify(token,process.env.JWT_SECRET); // Replace 'your-secret-key' with your actual secret key
      req.user = decodedToken;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired authentication token');
    }
  }
}
