import {getLessonProgress, saveLessonProgress} from "@/services/dbService";
import {LessonsProgress, QuizStatus} from "@/models/Progress";

const PROGRESS_LESSON_COLLECTION = "progress_lesson"

export const createNewLessonProgress = (lessonId: string, userId: string): LessonsProgress => {
    const newProg = {} as LessonsProgress
    newProg.lessonId = lessonId
    newProg.userId = userId
    newProg.id = PROGRESS_LESSON_COLLECTION + "_" + lessonId + "_" + userId
    return newProg
}

export const setInitialQuizAsFinished = async (lessonId: string, userId: string) => {
    let existingProgress = await getLessonProgress(lessonId, userId)
    if (!existingProgress || !existingProgress.id) {
        existingProgress = createNewLessonProgress(lessonId, userId)
    }
    existingProgress.initialQuizProgress = QuizStatus.FINISHED
    existingProgress.percentDone = Math.max(existingProgress.percentDone || 0, 20)
    return await saveLessonProgress(existingProgress)

}

export const setInitialQuizAsStarted = async (lessonId: string, userId: string) => {
    let existingProgress = await getLessonProgress(lessonId, userId)
    if (!existingProgress || !existingProgress.id) {
        existingProgress = createNewLessonProgress(lessonId, userId)
    }
    if (existingProgress.initialQuizProgress !== QuizStatus.FINISHED) {
        existingProgress.initialQuizProgress = QuizStatus.STARTED
    }
    existingProgress.percentDone = Math.max(existingProgress.percentDone || 0, 10)
    return await saveLessonProgress(existingProgress)
}

export const setLessonPartStarted = async (lessonId: string, userId: string, part: number) => {
    let existingProgress = await getLessonProgress(lessonId, userId)
    if (!existingProgress || !existingProgress.id) {
        existingProgress = createNewLessonProgress(lessonId, userId)
    }
    existingProgress.lastPart = part
    existingProgress.percentDone = Math.max(existingProgress.percentDone || 0, 50)

    return await saveLessonProgress(existingProgress)
}

export const setLessonPartEnd = async (lessonId: string, userId: string, part: number) => {
    let existingProgress = await getLessonProgress(lessonId, userId)
    if (!existingProgress || !existingProgress.id) {
        existingProgress = createNewLessonProgress(lessonId, userId)
    }
    existingProgress.lastPart = part
    existingProgress.percentDone = 100
    existingProgress.AllPartsRead = true

    return await saveLessonProgress(existingProgress)
}

export const setFinalQuizAsFinished = async (lessonId: string, userId: string) => {
    let existingProgress = await getLessonProgress(lessonId, userId)
    if (!existingProgress || !existingProgress.id) {
        existingProgress = createNewLessonProgress(lessonId, userId)
    }

    existingProgress.finalQuizProgress = QuizStatus.FINISHED

    existingProgress.percentDone = 100
    return await saveLessonProgress(existingProgress)

}

export const setFinalQuizAsStarted = async (lessonId: string, userId: string) => {
    let existingProgress = await getLessonProgress(lessonId, userId)
    if (!existingProgress || !existingProgress.id) {
        existingProgress = createNewLessonProgress(lessonId, userId)
    }

    if (existingProgress.finalQuizProgress !== QuizStatus.FINISHED) {
        existingProgress.finalQuizProgress = QuizStatus.STARTED
    }

    existingProgress.percentDone = Math.max(existingProgress.percentDone || 0, 60)
    return await saveLessonProgress(existingProgress)
}