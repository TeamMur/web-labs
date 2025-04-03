import userRouter from './users.js'
import eventRouter from './events.js'
import passport from 'passport'
import morgan from 'morgan'

const logFormat = '[:method] :url'
userRouter.use(morgan(logFormat))
eventRouter.use(morgan(logFormat))

userRouter.use(passport.authenticate("jwt", { session: false }))
eventRouter.use(passport.authenticate("jwt", { session: false }))

export { eventRouter, userRouter }

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

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
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
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список пользователей
 *     responses:
 *       200:
 *         description: Список пользователей
 *       500:
 *         description: Ошибка сервера
 *   post:
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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Пользователь создан
 *       400:
 *         description: Ошибка валидации или email уже существует
 *       500:
 *         description: Ошибка сервера
 */