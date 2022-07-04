import { AppDataSource } from '../databases';
import { CreateUserDto } from '../dtos/user.dto';
import request from 'supertest';
import App from '../app';
import AuthRoute from '../routes/auth.route';
import bcrypt from 'bcrypt';
import AuthService from '../services/auth.service';

beforeAll(async () => {
  AppDataSource.initialize();
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testinf Auth', () => {
  describe('[POST] /api/v1/signup', () => {
    it('response should have the Create userData', async () => {
      const userData: CreateUserDto = {
        email: 'test@gmail.com',
        password: '12345678!',
      };

      const authRoute = new AuthRoute();
      const authService = new AuthService();
      const userRepository = authService.userRepository;

      userRepository.findOne = jest.fn().mockResolvedValue(null);
      userRepository.save = jest.fn().mockResolvedValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      const app = new App([authRoute]);
      return request(app.getServer()).post(`${authRoute.path}/signup`).send(userData).expect(201);
    });
  });
});
