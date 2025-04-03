import express from 'express'
import { User } from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

import { MAX_FAILED_ATTEMPTS } from '../models/user.js';

const router = express.Router()

router.post("/register", async (req, res) => {
    // поля из запроса
    const { email, name, password } = req.body
    if (!email || !name || !password) return res.status(400).json({ message: "Пожалуйста, заполните поля email, name и password" })
    
    try {
        // проверка на существование пользователя
        const user = await User.findOne({ where: { email } })
        if (user) return res.status(400).json({ message: "Пользователь с таким email уже существует" })
        
        // регистрация
        await User.create({ email, name, password })
        res.status(201).json({ message: "Регистрация успешна" })
    } catch (error) {
        res.status(500).json({ message: "Ошибка при регистрации", error: error.message })
    }
})

router.post("/login", async (req, res) => {
    // поля из запроса
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: "Пожалуйста, введите логин и пароль" })
    
    try {
        // проверка на существование пользователя
        const user = await User.findOne({ where: { email } })
        if (!user) return res.status(401).json({ message: "Пользователь не найден" })

        // проверка пароля
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) return res.status(401).json({ message: "Неверный пароль"})

        // jwt токен
        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )
        
        // ответ клиенту
        res.status(200).json({
            message: "Успешный вход",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Ошибка при входе" })
    }
})

export default router 