import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MaxLength(32, { message: 'Username must be less than 32 characters long.' })
  @MinLength(4, { message: 'Username must be at least 4 characters long.' })
  @Matches(/^(?:[a-zA-Z\d]+(?:(?:\.|-|_)[a-zA-Z\d])*)+$/g, { message: 'Username contains invalid characters.' })
  @IsString({ message: 'Username is required.' })
  username: string;

  @MaxLength(128, { message: 'Email must be less than 128 characters long.' })
  @MinLength(4, { message: 'Email must be at least 4 characters long.' })
  @IsEmail({ message: 'The provided email is invalid.' })
  email: string;

  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @IsString({ message: 'Password is required.' })
  password: string;

  @MaxLength(32, { message: 'Firstname must be less than 32 characters long.' })
  @MinLength(2, { message: 'Firstname must be at least 2 characters long.' })
  @IsString({ message: 'Firstname is required.' })
  firstname: string;

  @MaxLength(32, { message: 'Surname must be less than 32 characters long.' })
  @MinLength(2, { message: 'Surname must be at least 2 characters long.' })
  @IsString({ message: 'Surname is required.' })
  surname: string;
}

export class LoginUserDto extends PickType(CreateUserDto, ['email', 'password'] as const) {
}

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['firstname', 'surname'] as const)
) {
}

export class UpdateUserEmailDto extends PickType(CreateUserDto, ['email'] as const) {
}

export class UpdateUserPasswordDto extends PickType(CreateUserDto, ['password'] as const) {
}