import { Op } from 'sequelize'
import express from 'express'
import { Event } from '../models/models.js'

const eventRouter = express.Router()

//get events
eventRouter.get('/', async (req, res) => {
  try {
    const { startDate, endDate, } = req.query
    const events = (startDate && endDate) ? await Event.findAll({where: {date: { [Op.between]: [startDate, endDate] }}}) : await Event.findAll()
    res.status(200).json(events)
  } catch (error) {
    res.status(500).json({ error: `Ошибка при получении мероприятий: ${error}`})
  }
})

//get event
eventRouter.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id)
    if (!event) return res.status(404).json({ error: `Мероприятие с id=${req.params.id} не найдено`})
    res.status(200).json(event)
  } catch (error) {
    res.status(500).json({ error: `Ошибка при получении мероприятия: ${error}`})
  }
})

//create event
eventRouter.post('/', async (req, res) => {
  try {
    const { title, description, date, createdBy } = req.body
    if (!title || !date || !createdBy) return res.status(400).json({ error: `Отсутствуют поля: ${!title ? 'title ' : ''}${!date ? 'date ' : ''}${!createdBy ? 'createdBy' : ''}`})
    
    const newEvent = await Event.create({ title, description, date, createdBy })
    res.status(201).json(newEvent)
  } catch (error) {
    res.status(500).json({ error: `Ошибка при создании мероприятия: ${error}`})
  }
})

//update event
eventRouter.put('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const event = await Event.findByPk(id)
    if (!event) return res.status(404).json({ error: `Мероприятие с id=${id} не найдено`})

    const { title, description, date, createdBy } = req.body
    await event.update({ title, description, date, createdBy })
    res.status(200).json(event)
  } catch (error) {
    res.status(500).json({ error: `Ошибка при обновлении мероприятия: ${error}`})
  }
})

//delete event
eventRouter.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const event = await Event.findByPk(id)
    if (!event) return res.status(404).json({ error: `Мероприятие с id=${id} не найдено`})

    await event.destroy()
    res.status(200).json({ message: `Мероприятие с id=${id} удалено`})
  } catch (error) {
    res.status(500).json({ error: `Ошибка при удалении мероприятия: ${error}`})
  }
})

export default eventRouter