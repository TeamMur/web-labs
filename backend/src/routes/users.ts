import express, { Request, Response, Router, RequestHandler } from 'express';
import { User } from '../models/models';
import { verifyToken } from '../middlewares/routes';
const userRouter: Router = express.Router();

//get users
userRouter.get('/', verifyToken, (async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ error: `Ошибка при получении пользователей: ${errorMessage}` });
  }
}) as RequestHandler);

//create user
userRouter.post('/', verifyToken, (async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({
        error: `Отсутствуют поля: ${!name ? 'name ' : ''}${!email ? 'email' : ''}${!password ? 'password' : ''}`,
      });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res
        .status(400)
        .json({ error: `Email ${email} уже зарегистрирован` });

    const newUser = await User.create({ name, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ error: `Ошибка при создании пользователя: ${errorMessage}` });
  }
}) as RequestHandler);

export default userRouter;
