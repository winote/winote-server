import { forwardRef, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDTO, AuthInputDTO } from './interfaces/auth.interface';
// import { User } from '../user/user.entity';
// import { UserService } from '../user/user.service';
import { Service } from '../../shared/decorators/service';
import { FirebaseNotConfigured, FirebaseProvider, FirebaseUserNotFound } from '../../shared/provider/firebase.provider';
import * as FirebaseAuthClient from 'firebase/auth';
// import Auth = auth.Auth;


@Service()
@Injectable()
export class AuthService {

    constructor(
        // @Inject(forwardRef(() => UserService)) private readonly userService: UserService
        ) {
    }

    // async findUserById(id: number): Promise<User> {
    //     return this.userService.findOne(id, {
    //         join: { alias: 'user' },
    //         loadEagerRelations: true,
    //     });
    // }

    // async findUserByEmail(email: string): Promise<User> {
    //     return this.userService.findByEmail(email);
    // }

    // async findUserByToken(token: string): Promise<User> {
    //     return this.userService.findByToken(token);
    // }

    public async doFirebaseLogin(access: AuthInputDTO,) {
        const token = await new Promise<string>((resolve, reject) => {
            const authPromise = FirebaseProvider.authClient(async (auth: FirebaseAuthClient.Auth) => {
                try {
                    const userCredential: any = await FirebaseAuthClient.signInWithEmailAndPassword(auth, access.email, access.password);
                    resolve(userCredential?.user?.accessToken);
                } catch (e) {
                    throw new HttpException("Wrong credentials", HttpStatus.UNAUTHORIZED);
                }
            });
            authPromise.then().catch((e) => reject(e));
        });

        if (token)
            return token;

        throw new UnauthorizedException('Invalid access');
    }
}
