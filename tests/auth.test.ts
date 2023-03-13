import { AppDataSource } from '../databases';
import request from 'supertest';
import App from '../app';
import AuthRoute from '../routes/auth.route';
import bcrypt from 'bcrypt';
import { UserEntity } from '../entities/users.entity';
import { CreateUserDto } from '../dtos/user.dto';
import { API_VERSION } from '../config';

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('Testing Auth', () => {
  describe('[POST] /api/v1/signup', () => {
    it('response should have the Create userData', async () => {
      const userData: CreateUserDto = {
        email: 'test@gmail.com',
        password: 'q1w2e3r4!',
      };

      await UserEntity.delete({ email: userData.email });

      const authRoute = new AuthRoute();

      UserEntity.findOne = jest.fn().mockResolvedValue(null);
      UserEntity.save = jest.fn().mockResolvedValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      const app = new App([authRoute]);
      // eslint-disable-next-line prettier/prettier
      return request(app.getServer())
        .post(`/api/${API_VERSION}${authRoute.path}/signup`)
        .send(userData)
        .expect(201);
    });
  });
  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
      };

      const authRoute = new AuthRoute();

      UserEntity.findOne = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      const app = new App([authRoute]);
      return request(app.getServer())
        .post(`/api/${API_VERSION}${authRoute.path}/login`)
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
  });

  /* describe('[POST] /logout', () => {
    it('logout Set-Cookie Authorization=; Max-age=0', async () => {
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
      };

      UserEntity.findOne = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      return request(app.getServer())
        .post(`/api/${API_VERSION}${authRoute.path}/logout`)
        .send(userData)
        .expect('Set-Cookie', /^Authorization=\;/);
    });*/
});
