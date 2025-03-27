import express from "express";
import cors from "cors";
import { sequelize } from "./config/db.js";
import { eventRouter, userRouter } from "./routes/routes.js";
import dotenv from "dotenv";
dotenv.config();

//Надстройки
const app = express();
const PORT = process.env.PORT ?? 5000

//База данных
sequelize.authenticate()
    .then(() => console.log("Соединение с БД установлено"))
    .catch(() => console.log("Не удалось установить соединение с БД"));

sequelize.sync()
    .then(() => console.log('Таблицы синхронизированы!'))
    .catch((err) => console.log('Таблицы не синхронизированы. Ошибка:', err));


//Сервер
app.use(express.json())
app.use(cors())

app.use('/events', eventRouter)
app.use('/users', userRouter)

const server = app.listen(PORT, () => console.log('Сервер запущен на порту', PORT))

server.on("error", (err) => {
    console.error(err.code === "EADDRINUSE" ? `Ошибка: порт ${PORT} уже используется.` : `Ошибка при запуске: ${err.message}`);
    process.exit(1);
});

