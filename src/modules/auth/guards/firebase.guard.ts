import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UserService } from 'src/modules/user/user.service';
import { NestApplicationContextProvider } from 'src/shared/provider/nest.provider';
import { User } from 'src/modules/user/user.entity';

@Injectable()
export class FirebaseAuthGuard extends AuthGuard('firebase-auth') {
  private readonly LOGGER: Logger = new Logger(FirebaseAuthGuard.name);
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request: any): Promise<boolean> {
    const { authorization } = request.headers;
    const applicationContext =
      NestApplicationContextProvider.getInstance().getApplicationContext();
    const userService: UserService = applicationContext.get(UserService);

    if (!authorization && !request.user) {
      throw new UnauthorizedException('No token provided');
    } else {
      const info = await firebaseAdmin
        .auth()
        .verifyIdToken(authorization)
        .then((userRecord) => {
          return firebaseAdmin.auth().getUser(userRecord.uid);
        })
        .catch((err) => {
          const message = 'Invalid or expired token';
          this.LOGGER.error(message);
          throw new ForbiddenException(message);
        });

      const user: User = await userService.findByEmail(info.email);
      request.user = user;
    }
    return true;
  }
}
