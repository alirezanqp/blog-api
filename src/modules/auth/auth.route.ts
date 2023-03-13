import { Router } from 'express';
import AuthController from '@/modules/auth/auth.controller';
import { Routes } from '@/shared/interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { UserSigninDto, UserSignupDto } from '@/modules/auth/auth.dto';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, validationMiddleware(UserSignupDto, 'body'), this.authController.signUp);
    this.router.post(`${this.path}login`, validationMiddleware(UserSigninDto, 'body'), this.authController.logIn);
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);
  }
}

export default AuthRoute;
