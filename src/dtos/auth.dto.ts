import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UserSignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'پسورد باید حداقل 8 کاراکتر باشد' })
  @MaxLength(30, { message: 'پسورد باید حداکثر 30 کاراکتر باشد' })
  password: string;
}

export class UserSigninDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
