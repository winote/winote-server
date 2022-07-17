import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {

    constructor(
        private readonly userService:UserService
    ){ }

    @ApiOperation({
        description: 'Creates a new user for the app'
    })
    @ApiBody({
        description: 'User',
        type: User,
    })
    @Post()
    async createUser(@Body() user:User){
        return this.userService.create(user);
    }

    @Get('/:email')
    async getUserByEmail(@Param('email') email:string){
        return this.userService.findByEmail(email);
    }
}
