import express, { Request, Response, RequestHandler } from 'express';
import { Event } from '../models/event';
import { Op } from 'sequelize';

interface EventsQuery {
  startDate?: string;
  endDate?: string;
}

const publicRouter = express.Router();

//get events
publicRouter.get('/events', (async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as unknown as EventsQuery;
    const events =
      startDate && endDate
        ? await Event.findAll({
            where: { date: { [Op.between]: [startDate, endDate] } },
          })
        : await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ error: `Ошибка при получении мероприятий: ${errorMessage}` });
  }
}) as RequestHandler);

export default publicRouter;
