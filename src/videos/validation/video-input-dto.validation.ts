import { VideoInputDto } from '../dto/video.input.dto';
import { AvailableResolutions } from '../types/video';
import { ValidationError } from '../../core/types/validation-error';

// Ручная валидация тела запроса (на этом этапе — без сторонних библиотек).
// Возвращает список ошибок; пустой список означает, что данные корректны.
export const validateVideoInputDto = (
    data: VideoInputDto,
): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (
        !data.title ||
        typeof data.title !== 'string' ||
        data.title.trim().length > 40
    )
        errors.push({field: 'title', message: 'Any String' });

    if (
        !data.author ||
        typeof data.author !== 'string' ||
        data.author.trim().length > 20
    )
        errors.push({field: 'author', message: 'Invalid author' });

    if (data.minAgeRestriction !== null &&
        data.minAgeRestriction !== undefined) {
        if (
            typeof data.minAgeRestriction !== 'number' ||
            data.minAgeRestriction < 1 ||
            data.minAgeRestriction > 18
        ) {
            errors.push({
                field: 'minAgeRestriction',
                message: 'minAgeRestriction must be between 1 and 18',
            });
        }
    }


    if (!Array.isArray(data.availableResolutions)) {
        errors.push({
            field: 'availableResolutions',
            message: 'AvailableResolutions must be an array',
        });
    } else if (data.availableResolutions.length < 1) {
        errors.push({
            field: 'availableResolutions',
            message: 'At least one resolution should be added',
        });

    } else {
        const validResolutions = Object.values(AvailableResolutions);
        const hasInvalidResolution = data.availableResolutions.some(
            (resolution) => !validResolutions.includes(resolution),
        );

        if (hasInvalidResolution) {
            errors.push({
                field: 'availableResolutions',
                message: 'Invalid resolution',
            });
        }
    }

    return errors;
};
