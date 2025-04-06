import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: number };
}

export const verifyToken = ((
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({
        message:
          'Требуется авторизация (Поле запроса authorization отсутствует)',
      });

    const token = authHeader.split(' ')[1];
    if (!token)
      return res.status(401).json({
        message: 'Неверный формат токена (Не забудь Bearer в запросе)',
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError')
      return res.status(401).json({ message: 'Токен истек' });
    return res.status(401).json({ message: 'Неверный токен' });
  }
}) as unknown as (req: Request, res: Response, next: NextFunction) => void;
