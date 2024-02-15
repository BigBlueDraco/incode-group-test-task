import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { CreateUser } from '../interfaces/create-user.interface';
export class CreateUserDto implements CreateUser {
  @ApiProperty({
    description: 'email',
    example: 'mail@example.com',
    type: String,
    maxLength: 128,
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @Max(128)
  email: string;
  @ApiProperty({
    description: 'Password',
    example: 'password123123123',
    type: String,
    minLength: 8,
    maxLength: 64,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Min(8)
  @Max(64)
  password: string;
}
