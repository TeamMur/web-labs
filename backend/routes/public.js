import express from 'express'
import { Event } from '../models/event.js'
import { Op } from 'sequelize'

const publicRouter = express.Router()

//get events
publicRouter.get('/events', async (req, res) => {
    try {
      const { startDate, endDate, } = req.query
      const events = (startDate && endDate) ? await Event.findAll({where: {date: { [Op.between]: [startDate, endDate] }}}) : await Event.findAll()
      res.status(200).json(events)
    } catch (error) {
      res.status(500).json({ error: `Ошибка при получении мероприятий: ${error}`})
    }
  })

export default publicRouter 