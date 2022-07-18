import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../auth/guards/firebase.guard';
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

    @UseGuards(FirebaseAuthGuard)
    @Get('/:email')
    async getUserByEmail(@Param('email') email:string){
        return this.userService.findByEmail(email);
    }
}
