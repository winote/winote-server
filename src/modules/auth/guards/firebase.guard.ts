import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Config } from '../../../config/config';

@Injectable()
export class FirebaseAuthGuard extends AuthGuard('firebase-auth') {

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        if (Config.auth.firebaseAdmin && !request.user) {
            return super.canActivate(context);
        }
        return true;
    }
}