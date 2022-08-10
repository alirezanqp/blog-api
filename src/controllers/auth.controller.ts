import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/user.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, messsage: 'ثبت نام با موفقیت انجام شد' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const { cookie, findUser } = await this.authService.signin(userData);

      const picked = (({ id, email }) => ({ id, email }))(findUser);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: picked, message: 'ورود با موفقیت انجام شد' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'خروج از سیستم با موفقیت انجام شد' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
