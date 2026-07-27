import { AvailableResolutions } from '../types/video';

// Данные, которые клиент присылает при создании/обновлении видео
// (без служебных id и createdAt — их проставляет сервер).
export type VideoInputDto = {
    title: string;
    author: string;
    canBeDownloaded?: boolean;
    minAgeRestriction?: number | null;
    availableResolutions: AvailableResolutions[];
};