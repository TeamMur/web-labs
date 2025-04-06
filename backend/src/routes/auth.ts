import express, { Request, Response, RequestHandler } from 'express';
import { User } from '@models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { MAX_FAILED_ATTEMPTS } from '@models/user';

const router = express.Router();

router.post('/register', (async (req: Request, res: Response) => {
  // поля из запроса
  const { email, name, password } = req.body;
  if (!email || !name || !password)
    return res
      .status(400)
      .json({ message: 'Пожалуйста, заполните поля email, name и password' });

  try {
    // проверка на существование пользователя
    const user = await User.findOne({ where: { email } });
    if (user)
      return res
        .status(400)
        .json({ message: 'Пользователь с таким email уже существует' });

    // регистрация
    await User.create({ email, name, password });
    res.status(201).json({ message: 'Регистрация успешна' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: 'Ошибка при регистрации', error: errorMessage });
  }
}) as RequestHandler);

router.post('/login', (async (req: Request, res: Response) => {
  // поля из запроса
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: 'Пожалуйста, введите логин и пароль' });

  try {
    // проверка на существование пользователя
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ message: 'Пользователь не найден' });

    // проверка на бан
    if (user.isUserLocked())
      return res
        .status(403)
        .json({ message: `Аккаунт заблокирован`, lockUntil: user.lockUntil });

    // проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      // неверный пароль - увеличение неудачных попыток или бан
      await user.addFailedAttempts();

      // сообщение если бан
      if (user.isUserLocked())
        return res.status(403).json({
          message: 'Слишком много неудачных попыток. Аккаунт заблокирован',
          lockUntil: user.lockUntil,
        });

      // если еще не бан, то просто ответ
      return res.status(401).json({
        message: `Неверный пароль. Неудачных попыток ${user.failedAttempts} из ${MAX_FAILED_ATTEMPTS}`,
      });
    }

    // успешный вход - сброс неудачных попыток
    await user.resetFailedAttempts();

    // jwt токен
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      jwtSecret,
      { expiresIn: '1h' },
    );

    // ответ клиенту
    res.status(200).json({
      message: 'Успешный вход',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Ошибка при входе', error: errorMessage });
  }
}) as RequestHandler);

export default router;
