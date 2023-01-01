import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDTO, AuthInputDTO } from './interfaces/auth.interface';
import { Service } from '../../shared/decorators/service';
import { FirebaseProvider } from '../../shared/provider/firebase.provider';
import * as FirebaseAuthClient from 'firebase/auth';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Service()
@Injectable()
export class AuthService {
  private readonly LOGGER: Logger = new Logger(AuthService.name);
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public async doFirebaseLogin(access: AuthInputDTO): Promise<AuthDTO> {
    const firebaseUser = await new Promise<AuthDTO>((resolve, reject) => {
      const authPromise = FirebaseProvider.authClient(
        async (auth: FirebaseAuthClient.Auth) => {
          try {
            const userCredential: any =
              await FirebaseAuthClient.signInWithEmailAndPassword(
                auth,
                access.email,
                access.password,
              );
            const user: User = await this.userService.findByEmail(
              userCredential.user.email,
            );
            resolve({
              id: user.id,
              email: user.email,
              avatar: user.avatar,
              name: user.name,
              token: userCredential.user.accessToken,
            });
          } catch (e) {
            this.LOGGER.error(e);
            throw new HttpException(
              'Wrong credentials',
              HttpStatus.UNAUTHORIZED,
            );
          }
        },
      );
      authPromise.then().catch((e) => reject(e));
    });

    if (firebaseUser) return firebaseUser;
  }
}
