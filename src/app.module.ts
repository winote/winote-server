import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from './config/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: () => Config.typeorm }),
    AuthModule,
    UserModule,
    StorageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
