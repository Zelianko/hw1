import { Request, Response, Router } from 'express';
import { db } from '../../db/in-memory.db';
import { HttpStatus } from '../../core/types/http-statuses';
import { createErrorMessages } from '../../core/utils/error.utils';
import { Video} from '../types/video';
import { VideoInputDto } from '../dto/video.input.dto';
import { UpdateVideoInputDto } from '../dto/video.update.dto';
import { validateVideoUpdateDto } from '../validation/video-update-dto.validation';
import { validateVideoInputDto } from '../validation/video-input-dto.validation';

// Все маршруты, связанные с водителями, вынесены в отдельный роутер.
// В setup-app он подключается по базовому пути '/videos'.
export const videosRouter = Router({});

videosRouter
    // Список всех видео
    .get('', (req: Request, res: Response) => {
        res.status(HttpStatus.Ok).send(db.videos);
    })

    // Одно видео по id.
    .get('/:id', (req: Request<{ id: string }>, res: Response) => {
        const video = db.videos.find((d) => d.id === +req.params.id);

        if (!video) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorMessages([{ field: 'id', message: 'Video not found' }]),
                );
            return;
        }

        res.status(HttpStatus.Ok).send(video);
    })

    // Создание видео: сначала валидируем тело, затем создаём.
    .post('', (req: Request<{}, {}, VideoInputDto>, res: Response) => {
        const errors = validateVideoInputDto(req.body);

        if (errors.length > 0) {
            res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
            return;
        }

        const lastVideo = db.videos[db.videos.length - 1];

        // Создаем дату публикации (+1 день)

        const createdAt = new Date();

        const publicationDate = new Date(createdAt);
        publicationDate.setDate(publicationDate.getDate() + 1);

        const newVideo: Video = {
            id: lastVideo ? lastVideo.id + 1 : 1,
            title:	req.body.title,
            author:	req.body.author,
            canBeDownloaded: req.body.canBeDownloaded ?? false,
            minAgeRestriction: req.body.minAgeRestriction ?? null,
            availableResolutions: req.body.availableResolutions,
            createdAt: new Date().toISOString(),
            publicationDate: publicationDate.toISOString(),
        };

        db.videos.push(newVideo);
        res.status(HttpStatus.Created).send(newVideo);
    })

    // Обновление водителя: проверяем, что он существует, затем валидируем тело.
    .put(
        '/:id',
        (
            req: Request<{ id: string }, {}, UpdateVideoInputDto>,
            res: Response,
        ) => {
            const index = db.videos.findIndex((d) => d.id === +req.params.id);

            if (index === -1) {
                res
                    .status(HttpStatus.NotFound)
                    .send(
                        createErrorMessages([{ field: 'id', message: 'Video not found' }]),
                    );
                return;
            }

            const errors = validateVideoUpdateDto(req.body);

            if (errors.length > 0) {
                res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
                return;
            }

            // Обновляем поля из тела запроса, сохраняя служебные id и createdAt.
            db.videos[index] = { ...db.videos[index], ...req.body };

            res.sendStatus(HttpStatus.NoContent);
        },
    )

    // Удаление водителя по id.
    .delete('/:id', (req: Request<{ id: string }>, res: Response) => {
        const index = db.videos.findIndex((d) => d.id === +req.params.id);

        if (index === -1) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
                );
            return;
        }

        db.videos.splice(index, 1);
        res.sendStatus(HttpStatus.NoContent);
    });
