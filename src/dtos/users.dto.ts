import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public username: string;

  @IsString()
  public password: string;
}
export class CreateUserSignupDto {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(5, { message: 'نام کاربری باید حداقل 5 کاراکتر باشد' })
  public username: string;

  @IsString()
  @MinLength(8, { message: 'رمز عبور باید حداقل 8 کاراکتر باشد' })
  public password: string;
}

export class CreateUserLoginDto {
  @IsString()
  public emailOrUserName: string;

  @IsString()
  public password: string;
}
