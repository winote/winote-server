import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../auth/guards/firebase.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {

    constructor(
        private readonly userService:UserService
    ){ }

    @ApiOperation({description: 'Creates a new user for the app'})
    @Post()
    async createUser(@Body() user:User){
        return this.userService.create(user);
    }

    @UseGuards(FirebaseAuthGuard)
    @Get('/:email')
    async getUserByEmail(@Param('email') email:string){
        return this.userService.findByEmail(email);
    }

    @UseGuards(FirebaseAuthGuard)
    @Patch()
    async updateUser(@Body() user:UpdateUserDto){
        return await this.userService.update(user)
    }
}
