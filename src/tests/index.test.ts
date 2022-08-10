import request from 'supertest';
import IndexRoute from '../routes/index.route';
import { API_VERSION } from '../config';
import App from '../app';

describe('Testing route path', () => {
  describe('[GET] / ', () => {
    it('response statusCode 200', async () => {
      const indexRoute = new IndexRoute();
      const app = new App([indexRoute]);

      return request(app.getServer()).get(`/api/${API_VERSION}${indexRoute.path}`).expect(200);
    });
  });
});
