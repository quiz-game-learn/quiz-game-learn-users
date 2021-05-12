import {
    coursesCollection, lessonProgressCollection,
    lessonsCollection,
    lessonsResultsCollection,
    partsCollection,
    quizzesCollection,
    quizzesResultsCollection, userSolutionsCollection
} from "@/firebase";
import {Quiz} from "../models/Quiz";
import {Lesson, Part} from "@/models/Lessons";
import {Course} from "@/models/Course";
import {v4 as uuidv4} from 'uuid';
import {LessonResults, QuizResults} from "@/models/QuizResults";
import {QuizUserSolution} from "@/models/QuizUserSolution";
import {LessonsProgress} from "@/models/Progress";

export const getQuizzesAvailable = async (limit: number, skip: number): Promise<Quiz[]> => {
    //const result  = await quizzesCollection.limit(10).where("public", "==", true).orderBy("date", "desc").get()
    const result = await quizzesCollection.limit(limit).where("public", "==", true).get()
    const quizzes = []

    for (const doc of result.docs) {
        quizzes.push(doc.data() as Quiz)
    }
    console.log(quizzes)
    return quizzes
}

export const saveQuiz = async (quiz: Quiz) => {
    if (!quiz.id || quiz.id === "None") {
        quiz.id = uuidv4()
    }
    console.log(quiz)
    return quizzesCollection.doc(quiz.id).set(quiz)
}

export const deleteQuiz = async (quiz: Quiz) => {
    return quizzesCollection.doc(quiz.id).delete()
}

export const savePart = async (part: Part) => {
    if (!part.id || part.id === "None") {
        part.id = uuidv4()
    }
    return partsCollection.doc(part.id).set(part)
}

export const deletePart = async (part: Part) => {
    return partsCollection.doc(part.id).delete()
}

export const getLessonsAvailable = async (limit: number, skip: number): Promise<Lesson[]> => {
    //const result  = await quizzesCollection.limit(10).where("public", "==", true).orderBy("date", "desc").get()
    const result = await lessonsCollection.limit(limit).get()
    const lessons = []

    for (const doc of result.docs) {
        lessons.push(doc.data() as Lesson)
    }
    console.log(lessons)
    return lessons
}

export const getLessonsInCourse = async (limit: number, skip: number, courseId: string): Promise<Lesson[]> => {
    //const result  = await quizzesCollection.limit(10).where("public", "==", true).orderBy("date", "desc").get()
    const result = await lessonsCollection.limit(limit).where("courseId", "==", courseId).get()
    const lessons = []

    for (const doc of result.docs) {
        lessons.push(doc.data() as Lesson)
    }
    console.log(lessons)
    return lessons
}

export const saveLesson = async (lesson: Lesson) => {
    if (!lesson.id) {
        lesson.id = uuidv4()
    }
    return lessonsCollection.doc(lesson.id).set(lesson)
}

export const deleteLesson = async (lesson: Lesson) => {
    return lessonsCollection.doc(lesson.id).delete()
}

export const getCoursesAvailable = async (limit: number, skip: number): Promise<Course[]> => {
    const result = await coursesCollection.limit(limit).get()
    const lessons = []

    for (const doc of result.docs) {
        lessons.push(doc.data() as Course)
    }
    console.log(lessons)
    return lessons
}

export const saveCourse = async (course: Course) => {
    if (!course.id) {
        course.id = uuidv4()
    }
    return coursesCollection.doc(course.id).set(course)
}

export const deleteCourse = async (course: Course) => {
    return coursesCollection.doc(course.id).delete()
}

export const getLesson = async (id: string): Promise<Lesson | null> => {

    const result = await lessonsCollection.where("id", "==", id).get()

    return result.docs[0].data() as Lesson
}

export const getQuiz = async (id: string): Promise<Quiz | null> => {
    const result = await quizzesCollection.where("id", "==", id).get()

    return result.docs[0].data() as Quiz
}

export const getCourse = async (id: string): Promise<Course | null> => {
    const result = await coursesCollection.where("id", "==", id).get()

    if (result.docs[0]) return result.docs[0].data() as Course
    return null

}

export const getPart = async (id: string): Promise<Part | null> => {
    const result = await partsCollection.where("id", "==", id).get()
    console.log(id, result)
    if (result.docs[0]) return result.docs[0].data() as Part
    return null

}


export const getQuizResults = async (quizId: string, userId: string): Promise<QuizResults | null> => {
    const result = await quizzesResultsCollection.where("quizId", "==", quizId)
        .where("userId", "==", userId).get()
    if (result.docs[0]) return result.docs[0].data() as QuizResults
    return null

}

export const saveQuizResults = async (quizResults: QuizResults) => {
    if (!quizResults.id) {
        quizResults.id = uuidv4()
    }
    if (!quizResults.createdAt) {
        quizResults.createdAt = new Date()
    }
    quizResults.updatedAt = new Date()

    return quizzesResultsCollection.doc(quizResults.id).set(quizResults)
}

export const getUserSolutions = async (quizId: string, userId: string): Promise<QuizUserSolution | null> => {
    const result = await userSolutionsCollection.where("quizId", "==", quizId)
        .where("userId", "==", userId).get()

    console.log(quizId, userId, result)
    if (result.docs[0]) return result.docs[0].data() as QuizUserSolution
    return null
}

export const saveUserSolutions = async (quizResults: QuizUserSolution) => {
    if (!quizResults.id) {
        quizResults.id = uuidv4()
    }
    return userSolutionsCollection.doc(quizResults.id).set(quizResults)
}

export const getLessonProgress = async (lessonId: string, userId: string): Promise<LessonsProgress | null> => {
    const result = await lessonProgressCollection.where("lessonId", "==", lessonId)
        .where("userId", "==", userId).get()

    if (result.docs[0]) return result.docs[0].data() as LessonsProgress
    return null
}

export const saveLessonProgress = async (lessonsProgress: LessonsProgress) => {
    if (!lessonsProgress.id) {
        lessonsProgress.id = uuidv4()
    }
    if (!lessonsProgress.createdAt) {
        lessonsProgress.createdAt = new Date()
    }
    lessonsProgress.updatedAt = new Date()

    return lessonProgressCollection.doc(lessonsProgress.id).set(lessonsProgress)
}

export const getLessonResults = async (lessonId: string, userId: string): Promise<LessonResults | null> => {
    const result = await lessonsResultsCollection.where("lessonId", "==", lessonId)
        .where("userId", "==", userId).get()

    if (result.docs[0]) return result.docs[0].data() as LessonResults
    return null
}

export const saveLessonResults = async (lessonResults: LessonResults) => {
    if (!lessonResults.id) {
        lessonResults.id = uuidv4()
    }
    if (!lessonResults.createdAt) {
        lessonResults.createdAt = new Date()
    }
    lessonResults.updatedAt = new Date()

    console.log(lessonResults)
    return lessonsResultsCollection.doc(lessonResults.id).set(lessonResults)
}