import userRouter from '@routes/users';
import eventRouter from '@routes/events';
import morgan from 'morgan';
import { verifyToken } from '@middlewares/routes';

const logFormat = '[:method] :url';
userRouter.use(morgan(logFormat));
eventRouter.use(morgan(logFormat));

userRouter.use(verifyToken);
eventRouter.use(verifyToken);

export { eventRouter, userRouter };



/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - auth
 *     summary: Регистрация
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
  *               name:
 *                 type: string
  *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Успешная регистрация
 *       400:
 *         description: Ошибка валидации или email уже существует
 *       500:
 *         description: Ошибка сервера
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - auth
 *     summary: Авторизация
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                  type: string
 *     responses:
 *       201:
 *         description: Успешная авторизация
 *       400:
 *         description: Ошибка валидации или email не существует
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный идентификатор
 *         name:
 *           type: string
 *           description: Имя
 *         email:
 *           type: string
 *           format: email
 *           description: Email (уникальный)
 *         password:
 *           type: string
 *           description: Пароль (Хешированный)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - users
 *     security:
 *       - bearerAuth: []
 *     summary: Получить список пользователей
 *     responses:
 *       200:
 *         description: Список пользователей
 *       500:
 *         description: Ошибка сервера
 *   post:
 *     tags:
 *         - users
 *     security:
 *       - bearerAuth: []
 *     summary: Создать пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
*               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь создан
 *       400:
 *         description: Ошибка валидации или email уже существует
 *       500:
 *         description: Ошибка сервера
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - date
 *         - createdBy
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный идентификатор
 *         title:
 *           type: string
 *           description: Название
 *         description:
 *           type: string
 *           description: Описание
 *         date:
 *           type: string
 *           format: date-time
 *           description: Дата
 *         createdBy:
 *           type: integer
 *           description: ID создателя
 */

/**
 * @swagger
 * /events:
 *   get:
 *     tags:
 *         - events
 *     summary: Получить список мероприятий
 *     parameters:
 *       - name: startDate
 *         in: query
 *         description: Начало
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: endDate
 *         in: query
 *         description: Конец
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Список мероприятий
 *       500:
 *         description: Ошибка сервера
 *   post:
 *     tags:
 *       - events
 *     security:
 *       - bearerAuth: []
 *     summary: Создать мероприятие
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - createdBy
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               createdBy:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Мероприятие создано
 *       400:
 *         description: Ошибка валидации
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     tags:
 *       - events
 *     security:
 *       - bearerAuth: []
 *     summary: Получить мероприятие по ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Мероприятие найдено
 *       404:
 *         description: Мероприятие не найдено
 *   put:
 *     tags:
 *       - events
 *     security:
 *       - bearerAuth: []
 *     summary: Обновить мероприятие
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               createdBy:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Мероприятие обновлено
 *       404:
 *         description: Мероприятие не найдено
 *   delete:
 *     tags:
 *       - events
 *     security:
 *       - bearerAuth: []
 *     summary: Удалить мероприятие
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Мероприятие удалено
 *       404:
 *         description: Мероприятие не найдено
 */
