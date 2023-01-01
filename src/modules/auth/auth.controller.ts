import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDTO, AuthInputDTO } from './interfaces/auth.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: AuthInputDTO) {
    return this.authService.doFirebaseLogin(user);
  }

  @Post('refresh')
  refresh(@Body() user: AuthInputDTO) {
    return this.authService.doFirebaseLogin(user);
  }
}
