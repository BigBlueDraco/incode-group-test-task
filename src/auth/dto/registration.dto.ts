import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Registration } from '../interfaces/registration.interface';

export class RegistrationDto extends CreateUserDto implements Registration {}
