import {LessonsProgress} from "@/models/Progress";
import {LessonResults} from "@/models/QuizResults";

export interface LevelInfo {
    level: number,
    experience: number,
    progress: LessonsProgress[],
    results: LessonResults[],
    updatedAt: Date
}