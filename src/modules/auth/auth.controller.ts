import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/user.dto';
import { RequestWithUser } from '@/modules/auth/auth.interface';
import { User } from '@/modules/user/users.interface';
import AuthService from '@services/auth.service';
import EmailService from '@/shared/services/email.service';

class AuthController {
  public authService = new AuthService();
  public emailService = new EmailService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, messsage: 'ثبت نام با موفقیت انجام شد. لطفا ایمیل خود را تایید کنید.' });
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

  public sendVerificationEmail = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const verifyToken = Math.floor(Math.random() * 100 + 54);
      this.emailService.sendVerificationEmail(req.user.email, verifyToken);

      res.status(200).json({ message: 'ایمیل تاییدیه به ایمیل شما ارسال شد.' });
    } catch (error) {
      next(error);
    }
  };

  public verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.params;
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
