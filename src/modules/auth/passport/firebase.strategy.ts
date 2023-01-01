import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { FirebaseProvider } from '../../../shared/provider/firebase.provider';
import { Auth } from 'firebase-admin/lib/auth';
// import Auth = auth.Auth;
import { AuthService } from '../auth.service';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    FirebaseProvider.init().then();
  }

  async validate(token: string): Promise<any> {
    return await new Promise<any>(async (resolve, reject) => {
      const firebaseState = await FirebaseProvider.authAdmin(
        async (auth: Auth) => {
          try {
            const firebaseUser = await auth.verifyIdToken(token, true);
            if (firebaseUser) {
              resolve(firebaseUser);
              // const user = await this.authService.findUserByEmail(firebaseUser.email);
              // if (user) {
              //     resolve(user);
              // }
            }
            reject(new UnauthorizedException());
          } catch (ignored) {
            reject(new UnauthorizedException());
          }
        },
      );

      // Firebase isn't configured
      if (!firebaseState) {
        reject(new UnauthorizedException());
      }
    });
  }
}
