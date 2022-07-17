import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { EmailUserUniqueValidator } from './validation/email-unique.validation';


@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers:[
    UserService,
    EmailUserUniqueValidator
  ],
  exports:[UserService]
})
export class UserModule {}
