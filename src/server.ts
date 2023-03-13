import { createApp, listen } from './app';
import AuthRoute from './modules/auth/auth.route';
import IndexRoute from './modules/index/index.route';
import validateEnv from './shared/utils/validateEnv';

validateEnv();

const app = createApp([new AuthRoute(), new IndexRoute()]);

listen(app);
