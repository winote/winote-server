import { forwardRef, Module } from '@nestjs/common';
// import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { FirebaseStrategy } from './passport/firebase.strategy';

@Module({
    imports: [
        // forwardRef(() => UserModule),
    ],
    controllers: [AuthController],
    providers: [
        FirebaseStrategy,
        AuthService,
    ],
    exports: [
        AuthService,
    ],
})
export class AuthModule {
}
