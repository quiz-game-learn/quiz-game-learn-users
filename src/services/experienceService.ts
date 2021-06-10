import {LessonResults} from "@/models/QuizResults";
import {LessonsProgress} from "@/models/Progress";
import {LevelInfo} from "@/models/LevelInfo";


export const calculateLevelInfo = (lessonsProgress: LessonsProgress[], lessonResults: LessonResults[]): LevelInfo => {
    console.log(lessonsProgress, lessonResults)
    const reducer = (accumulator: number, currentValue: LessonsProgress): number => {
        const id = currentValue.lessonId
        const percent = currentValue.percentDone | 0
        const result = lessonResults.find(lesson => lesson.lessonId === id) as LessonResults
        let score = 0
        if (result && result.totalScore) {
            score = result.totalScore
        }
        return accumulator + percent + score;
    }
    const exp = lessonsProgress.reduce(reducer, 0)
    const level = Math.floor(exp / 200);
    const levelInfo = {} as LevelInfo
    levelInfo.experience = exp
    levelInfo.level = level
    levelInfo.updatedAt = new Date()
    return levelInfo
}
