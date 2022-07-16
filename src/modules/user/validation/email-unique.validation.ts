import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { User } from '../user.entity';
import { NestApplicationContextProvider } from '../../../shared/provider/nest.provider';
import { UserService } from '../user.service';

@Injectable()
@ValidatorConstraint({ name: 'emailUserUniqueValidator', async: false })
export class EmailUserUniqueValidator implements ValidatorConstraintInterface {

    async validate(text: string, args: ValidationArguments) {
        if (text) {
            const userArgs = args.object as User;
            const applicationContext = NestApplicationContextProvider.getInstance().getApplicationContext();
            const userService: UserService = applicationContext.get(UserService);
            const user: User = await userService.findByEmail(text);
            if (user && userArgs && user.id !== userArgs.id) {
                return false;
            }
        }
        return true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `User with e-mail ${validationArguments.value} already exists`;
    }
}
