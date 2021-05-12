
export interface Progress {
    lessonsProgress: { [lectionId: string]: LessonsProgress },
    points: number,
    userId: string,
    level: number,
    badges: string[],
    createdAt: Date,
    updatedAt: Date,
    lastActive: Date
}

export interface LessonsProgress {
    globalStatus: LectionStatus,
    percentDone: number,
    lastPart: number,
    AllPartsRead: boolean,
    initialQuizProgress: QuizStatus,
    finalQuizProgress: QuizStatus,
    userId: string,
    lessonId: string,
    createdAt: Date,
    updatedAt: Date,
    id: string
}

export enum LectionStatus {
    STARTED = "STARTED",
    FINISHED = "FINISHED"
}

export enum QuizStatus {
    STARTED = "STARTED",
    FINISHED = "FINISHED"
}

export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';

export interface UpdateProgressAction {
    type: typeof UPDATE_PROGRESS;
    payload: Progress;
}
