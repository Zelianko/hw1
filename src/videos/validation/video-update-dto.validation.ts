import { UpdateVideoInputDto } from '../dto/video.update.dto';
import { AvailableResolutions } from '../types/video';

export const validateVideoUpdateDto = (
    data: UpdateVideoInputDto,
) => {
    const errors = [];

    if (
        !data.title ||
        typeof data.title !== 'string' ||
        data.title.trim().length === 0
    ) {
        errors.push({
            field: 'title',
            message: 'Any String',
        });
    } else if (data.title.length > 40) {
        errors.push({
            field: 'title',
            message: 'Title maximum length is 40',
        });
    }


    if (
        !data.author ||
        typeof data.author !== 'string' ||
        data.author.trim().length === 0
    ) {
        errors.push({
            field: 'author',
            message: 'Invalid author',
        });
    } else if (data.author.length > 20) {
        errors.push({
            field: 'author',
            message: 'Any String',
        });
    }


    if (!Array.isArray(data.availableResolutions) ||
        data.availableResolutions.length === 0
    ) {
        errors.push({
            field: 'availableResolutions',
            message: 'At least one resolution should be added',
        });
    } else {
        const validResolutions = Object.values(AvailableResolutions);

        const invalidResolution =
            data.availableResolutions.some(
                resolution => !validResolutions.includes(resolution),
            );

        if (invalidResolution) {
            errors.push({
                field: 'availableResolutions',
                message: 'Invalid resolution',
            });
        }
    }


    if (typeof data.canBeDownloaded !== 'boolean') {
        errors.push({
            field: 'canBeDownloaded',
            message: 'canBeDownloaded must be boolean',
        });
    }


    if (
        data.minAgeRestriction !== null &&
        (
            typeof data.minAgeRestriction !== 'number' ||
            data.minAgeRestriction < 1 ||
            data.minAgeRestriction > 18
        )
    ) {
        errors.push({
            field: 'minAgeRestriction',
            message: 'minAgeRestriction must be between 1 and 18',
        });
    }


    if (
        typeof data.publicationDate !== 'string' ||
        isNaN(Date.parse(data.publicationDate))
    ) {
        errors.push({
            field: 'publicationDate',
            message: 'Any String',
        });
    }


    return errors;
};