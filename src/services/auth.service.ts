import { SECRET_KEY } from '@/config';
import { CreateUserDto } from '@/dtos/user.dto';
import { UserEntity } from '@/entities/users.entitiy';
import { DataStoredInToken, TokenData } from '@/interfaces/auth.interface';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class AuthService {
  public userRepository = UserEntity;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'اطلاعات کاربری خالی است');

    const user = await this.userRepository.findOne({ where: { email: userData.email } });
    if (user) throw new HttpException(409, 'کاربری با این ایمیل قبلا ثبت شده است');

    const hashPassword = await bcrypt.hash(userData.password, 10);
    const newUser: User = await this.userRepository.create({ ...userData, password: hashPassword }).save();
    return newUser;
  }

  public async signin(userData: CreateUserDto): Promise<{ cookie: string; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, 'اطلاعات کاربری خالی است');

    const findUser = await this.userRepository.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(404, 'ایمیل یا رمز عبور اشتباه است');

    const isValid = await bcrypt.compare(userData.password, findUser.password);
    if (!isValid) throw new HttpException(401, 'ایمیل یا رمز عبور اشتباه است');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'اطلاعات کاربری خالی است');

    const findUser: User = await UserEntity.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, 'کاربری با این اطلاعات وجود ندارد');

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}

export default AuthService;
