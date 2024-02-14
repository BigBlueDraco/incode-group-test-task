import { Injectable } from '@nestjs/common';
import { Login } from './interfaces/login.interface';
import { Registration } from './interfaces/registration.interface';

@Injectable()
export class AuthService {
  login(login: Login) {}
  registration(registration: Registration) {}
}
