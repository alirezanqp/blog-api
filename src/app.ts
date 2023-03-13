import express from 'express';
import { NODE_ENV, PORT, ORIGIN, CREDENTIALS, LOG_FORMAT, API_VERSION } from '@config';
import { AppDataSource } from '@databases';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { stream, logger } from '@/shared/utils/logger';
import { Routes } from '@/shared/interfaces/routes.interface';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import errorMiddleware from './middlewares/error.middleware';

const app = express();
const env = NODE_ENV || 'development';
const port = PORT || 3000;

const connectToDatabase = () => {
  AppDataSource.initialize()
    .then(() => logger.info('> Database connected successfully'))
    .catch(err => logger.error(err));
};

const initialzeMiddlewares = () => {
  app.use(morgan(LOG_FORMAT, { stream }));
  app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
  app.use(express.json());
  app.use(hpp());
  app.use(helmet());
  app.use(compression());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};

const initialzeRoutes = routes => {
  routes.forEach(route => {
    app.use(`/api/${API_VERSION}/`, route.router);
  });
};

const initializeSwagger = () => {
  const options = {
    swaggerDefinition: {
      info: {
        title: 'REST API',
        version: '1.0.0',
        description: 'Example docs',
      },
    },
    apis: ['swagger.yaml'],
  };

  const specs = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

const initialzeErrorHandler = () => {
  app.use(errorMiddleware);
};

const listen = (app) => {
  app.listen(port, () => {
    logger.info(`=================================`);
    logger.info(`======= ENV: ${env} =======`);
    logger.info(`🚀 App listening on the port ${port}`);
    logger.info(`=================================`);
  });
};

const createApp = routes => {
  env !== 'test' && connectToDatabase();
  initialzeMiddlewares();
  initialzeRoutes(routes);
  initializeSwagger();
  initialzeErrorHandler();
  return app;
};

export { createApp, listen };
