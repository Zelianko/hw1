import express, { Express, Request, Response } from 'express';
import { videosRouter } from './videos/routers/videos.router';
import { testingRouter } from './testing/routers/testing.router';
import { HttpStatus } from './core/types/http-statuses';

export const setupApp = (app: Express) => {
    // express.json() парсит JSON из тела запроса и кладёт его в req.body.
    app.use(express.json());

    // Health-check: простой ответ, что сервер жив.
    app.get('/', (_req: Request, res: Response) => {
        res.status(HttpStatus.Ok).send('Hello world!');
    });

    // Каждый модуль подключается по своему базовому пути (все ресурсы — под /api).
    app.use('/videos', videosRouter);
    app.use('/testing', testingRouter);


    return app;
};
