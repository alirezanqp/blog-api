import { IsEmail, IsString, MaxLength, maxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(8, { message: 'رمز عبور نمیتواند کمتر از 8 کاراکتر باشد' })
  public password: string;

  @IsString()
  @MinLength(6, { message: 'نام کاربری حداقل باید 6 کاراکتر باشد' })
  @MaxLength(30, { message: 'نام کاربری نمیتواند بیشتر از 30 کاراکتر باشد' })
  public username: string;
}
