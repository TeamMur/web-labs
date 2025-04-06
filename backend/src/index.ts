import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { sequelize } from '@config/db';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import passport from 'passport';
import authRoutes from '@routes/auth';
import publicRoutes from '@routes/public';
import { userRouter, eventRouter } from '@routes/routes';
import '@config/passport'; // Импортируем конфигурацию passport
import { Request } from 'express';

interface RateLimitRequest extends Request {
  rateLimit: { limit: number };
}

dotenv.config();

//Надстройки
const app = express();
const PORT = process.env.PORT ?? 5000;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: (req: Request) => ({
    error: `Превышен лимит запросов. Доступно ${(req as RateLimitRequest).rateLimit.limit} запросов в минуту. Попробуйте позже.`,
  }),
  standardHeaders: false,
  legacyHeaders: false,
});

const swaggerDocs = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Events API',
      description: 'API для управления мероприятиями',
      version: '1.0.0',
    },
    servers: [{ url: `http://localhost:5000` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      {
        name: 'auth',
        description: 'Вход',
      },
      {
        name: 'events',
        description: 'События',
      },
      {
        name: 'users',
        description: 'Пользователи',
      }
    ],
  },
  apis: ['./src/routes/*.ts'],
});

//База данных
sequelize
  .authenticate()
  .then(() => console.log('Соединение с БД установлено'))
  .catch(() => console.log('Не удалось установить соединение с БД'));

sequelize
  .sync()
  .then(() => console.log('Таблицы синхронизированы!'))
  .catch((err) => console.log('Таблицы не синхронизированы. Ошибка:', err));

//Сервер
app.use(limiter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(cors());

// Инициализация passport
app.use(passport.initialize());

// Подключение роутеров
app.use('/auth', authRoutes);
app.use('/', publicRoutes);
app.use('/users', userRouter);
app.use('/events', eventRouter);

const server = app.listen(PORT, () =>
  console.log('Сервер запущен на порту', PORT),
);

server.on('error', (err: NodeJS.ErrnoException) => {
  console.error(
    err.code === 'EADDRINUSE'
      ? `Ошибка: порт ${PORT} уже используется.`
      : `Ошибка при запуске: ${err.message}`,
  );
  process.exit(1);
});
