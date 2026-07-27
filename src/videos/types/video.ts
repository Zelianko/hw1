export enum AvailableResolutions {
    P144 = "P144",
    P240 = "P240",
    P360 = "P360",
    P480 = "P480",
    P720 = "P720",
    P1080 = "P1080",
    P1440 = "P1440",
    P2160 = "P2160",
}

// Данные храним в массиве в памяти, поэтому id — обычное число (позже, с БД, станет строкой).
export type Video = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    availableResolutions: AvailableResolutions[];
    publicationDate: string;
    createdAt: string;
};