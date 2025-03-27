import express from 'express'
import { User } from '../models/models.js'

const userRouter = express.Router()

//get user
userRouter.get('/', async (req, res) => {
  try {
    const users = await User.findAll()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: `Ошибка при получении пользователей: ${error}`})
  }
})

//create user
userRouter.post('/', async (req, res) => {
  try {
    const { name, email } = req.body
    if (!name || !email) return res.status(400).json({error: `Отсутствуют поля: ${!name ? 'name ' : ''}${!email ? 'email' : ''}`})

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) return res.status(400).json({ error: `Email ${email} уже зарегистрирован`})

    const newUser = await User.create({ name, email })
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ error: `Ошибка при создании пользователя: ${error}`})
  }
})

export default userRouter 