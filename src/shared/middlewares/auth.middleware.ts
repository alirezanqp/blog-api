import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { UserEntity } from '@/modules/user/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@/modules/auth/auth.interface';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const { id } = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const findUser = await UserEntity.findOne({ where: { id }, select: ['id', 'email', 'password'] });

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'توکن معتبر نیست'));
      }
    } else {
      next(new HttpException(404, 'اعتبار سنجی ناموفق'));
    }
  } catch (error) {
    next(new HttpException(401, 'توکن معتبر نیست'));
  }
};

export default authMiddleware;
