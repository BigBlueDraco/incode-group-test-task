import { PickType } from '@nestjs/swagger';
import { Login } from '../interfaces/login.interface';
import { RegistrationDto } from './registration.dto';

export class LoginDto
  extends PickType(RegistrationDto, ['email', 'password'])
  implements Login {}
