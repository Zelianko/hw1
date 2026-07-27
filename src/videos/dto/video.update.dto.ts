import { AvailableResolutions } from '../types/video';

export type UpdateVideoInputDto = {
    title: string;
    author: string;
    availableResolutions: AvailableResolutions[];
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    publicationDate: string;
};