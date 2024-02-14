import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/registration')
  registration(@Body() registration: RegistrationDto) {
    return this.authService.registration(registration);
  }
  @Post('/login')
  login(@Body() login: LoginDto) {
    return this.authService.login(login);
  }
}
