import { CreateUserDto } from '@/dtos/user.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { User } from '@/interfaces/users.interface';
import AuthService from '@/services/auth.service';
import { NextFunction, Request, Response } from 'express';

class AuthController {
  private authService = new AuthService();

  public async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      res.status(201).json({ signUpUserData, message: 'ثبت نام با موفقیت انجام شد' });
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: CreateUserDto = req.body;
      const { cookie, findUser } = await this.authService.signin(userData);

      res.status(200).json({ findUser, cookie, message: 'ورود با موفقیت انجام شد' });
    } catch (error) {
      next(error);
    }
  }

  public async logout(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: User = req.user;
      const findUser: User = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-Age=0']);
      res.status(200).json({ findUser, message: 'خروج با موفقیت انجام شد' });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
