// admin.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Check if the user is an admin
    if (user && user.role === 'admin') {
      return true; // Allow access for admins
    }
    
    // If not an admin, throw an unauthorized exception
    throw new UnauthorizedException('You do not have permission to access this resource.');
  }
}
