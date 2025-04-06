import express, { Request, Response, Router, RequestHandler } from 'express';
import { Event } from '@models/models';
import { verifyToken } from '@middlewares/routes';

const eventRouter: Router = express.Router();

//get event
eventRouter.get('/:id', verifyToken, (async (req: Request, res: Response) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event)
      return res
        .status(404)
        .json({ error: `Мероприятие с id=${req.params.id} не найдено` });
    res.status(200).json(event);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ error: `Ошибка при получении мероприятия: ${errorMessage}` });
  }
}) as RequestHandler);

//create event
eventRouter.post('/', verifyToken, (async (req: Request, res: Response) => {
  try {
    const { title, description, date, createdBy } = req.body;
    if (!title || !date || !createdBy)
      return res.status(400).json({
        error: `Отсутствуют поля: ${!title ? 'title ' : ''}${!date ? 'date ' : ''}${!createdBy ? 'createdBy' : ''}`,
      });

    const newEvent = await Event.create({
      title,
      description,
      date,
      createdBy,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ error: `Ошибка при создании мероприятия: ${errorMessage}` });
  }
}) as RequestHandler);

//update event
eventRouter.put('/:id', verifyToken, (async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const event = await Event.findByPk(id);
    if (!event)
      return res
        .status(404)
        .json({ error: `Мероприятие с id=${id} не найдено` });

    const { title, description, date, createdBy } = req.body;
    await event.update({ title, description, date, createdBy });
    res.status(200).json(event);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ error: `Ошибка при обновлении мероприятия: ${errorMessage}` });
  }
}) as RequestHandler);

//delete event
eventRouter.delete('/:id', verifyToken, (async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const event = await Event.findByPk(id);
    if (!event)
      return res
        .status(404)
        .json({ error: `Мероприятие с id=${id} не найдено` });

    await event.destroy();
    res.status(200).json({ message: `Мероприятие с id=${id} удалено` });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ error: `Ошибка при удалении мероприятия: ${errorMessage}` });
  }
}) as RequestHandler);

export default eventRouter;
