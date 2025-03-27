import express from "express";
import cors from "cors";
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc';
import { sequelize } from "./config/db.js";
import { eventRouter, userRouter } from "./routes/routes.js";
import rateLimit from 'express-rate-limit'
import dotenv from "dotenv";
dotenv.config();

//Надстройки
const app = express();
const PORT = process.env.PORT ?? 5000

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: (req) => ({error: `Превышен лимит запросов. Доступно ${req.rateLimit.limit} запросов в минуту. Попробуйте позже.`}),
    standardHeaders: false,
    legacyHeaders: false
})

const swaggerDocs = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: { title: 'Events API', description: 'API для управления мероприятиями'},
        servers: [{url: `http://localhost:5000`}]
    },
    apis: ['./routes/*.js']
  })

//База данных
sequelize.authenticate()
    .then(() => console.log("Соединение с БД установлено"))
    .catch(() => console.log("Не удалось установить соединение с БД"));

sequelize.sync()
    .then(() => console.log('Таблицы синхронизированы!'))
    .catch((err) => console.log('Таблицы не синхронизированы. Ошибка:', err));


//Сервер
app.use(limiter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(express.json())
app.use(cors())

app.use('/events', eventRouter)
app.use('/users', userRouter)

const server = app.listen(PORT, () => console.log('Сервер запущен на порту', PORT))

server.on("error", (err) => {
    console.error(err.code === "EADDRINUSE" ? `Ошибка: порт ${PORT} уже используется.` : `Ошибка при запуске: ${err.message}`);
    process.exit(1);
});

