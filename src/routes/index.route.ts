import IndexController from '@controllers/index.controller';
import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';

class IndexRoute implements Routes {
  public path = '/';
  public router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initialzeRoutes();
  }

  public initialzeRoutes() {
    this.router.use(`${this.path}`, this.indexController.index);
  }
}

export default IndexRoute;
