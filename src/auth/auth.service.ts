import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { Login } from './interfaces/login.interface';
import { Registration } from './interfaces/registration.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async login(login: Login) {
    try {
      const { password, ...user } = await this.userService.findOne({
        email: login.email.toLocaleLowerCase(),
      });
      const isValidPassword = await compare(login.password, password);
      if (!isValidPassword) {
        throw new ConflictException('Unvalid user data');
      }
      return {
        accessToken: this.jwtService.sign({
          id: user.id,
          email: user.email,
          role: user.role,
        }),
        user,
      };
    } catch (err) {
      return err;
    }
  }
  async registration(registration: Registration) {
    try {
      const { password, ...user } = registration;
      const hashedPassword = await hash(password, 10);
      const newUser = await this.userService.create({
        ...user,
        password: hashedPassword,
      });
      // eslint-disable-next-line
      const { password: newPassword, ...resUser } = newUser;
      return {
        accessToken: this.jwtService.sign({
          id: resUser.id,
          email: resUser.email,
          role: resUser.role,
        }),
        resUser,
      };
    } catch (err) {
      return err;
    }
  }
}
