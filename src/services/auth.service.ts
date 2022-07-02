import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { EntityRepository, Repository } from 'typeorm';
import { SECRET_KEY } from '@config';
import { CreateUserSignupDto, CreateUserLoginDto } from '@dtos/users.dto';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';

@EntityRepository()
class AuthService extends Repository<UserEntity> {
  public async signup(userData: CreateUserSignupDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUserByUsername: User = await UserEntity.findOne({ where: { username: userData.username } });
    if (findUserByUsername) throw new HttpException(409, 'نام کاربری تکراری می باشد');

    const findUserByEmail: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (findUserByEmail) throw new HttpException(409, `کاربری با ایمیل ${userData.email} قبلا ثبت شده است`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserEntity.create({ ...userData, password: hashedPassword }).save();
    return createUserData;
  }

  public async login(userData: CreateUserLoginDto): Promise<{ cookie: string; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await UserEntity.findOne({
      where: [{ email: userData.emailOrUserName }, { username: userData.emailOrUserName }],
    });
    if (!findUser) throw new HttpException(409, `اطلاعات وارد شده صحیح نمی باشد`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'اطلاعات وارد شده صحیح نمی باشد');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await UserEntity.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
