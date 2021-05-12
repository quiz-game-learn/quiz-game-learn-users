import {isEqual, difference} from 'lodash'
import {LessonResults, QuizResults} from "@/models/QuizResults";
import {ChosenAnswerMultichoice, QuizUserSolution} from "@/models/QuizUserSolution";
import {Quiz} from "@/models/Quiz";
import {Lesson} from "@/models/Lessons";

const QUIZRESULTS_COLLECTION = "quiz_results"
const LESSONRESULTS_COLLECTION = "lesson_results"

export const generateIdQuizResult = (quizzId: string, userId: string): string => {
    return QUIZRESULTS_COLLECTION + "_" + quizzId + "_" + userId
}

export const generateIdLessonResult = (lessonId: string, userId: string): string => {
    return LESSONRESULTS_COLLECTION + "_" + lessonId + "_" + userId
}

export const evaluateQuiz = (quiz: Quiz, solution: QuizUserSolution): QuizResults => {
    if (!quiz || !solution || !solution.userAnswers) {
        return {} as QuizResults
    }

    const quizResult = {} as QuizResults
    quizResult.lessonId = quiz.lessonId
    quizResult.quizId = quiz.id
    quizResult.userId = solution.userId
    quizResult.id = generateIdQuizResult(quiz.id, solution.userId)
    quizResult.correctAnswers = []
    quizResult.wrongAnswers = []

    for (const answ of solution.userAnswers) {
        const index = answ.questionIndex
        const responses = (answ as ChosenAnswerMultichoice).selectedOptions
        const correctResponsesForAnsw = quiz.questions[index].correctAnswers
        const isCorrectAns = difference(responses, correctResponsesForAnsw).length === 0

        if (responses.length > 0 && isCorrectAns) {
            quizResult.correctAnswers.push(index)
        } else if (responses.length > 0) {
            quizResult.wrongAnswers.push(index)
        }
    }

    const numTotalQuest = quiz.questions.length
    const numCorrectQuest = quizResult.correctAnswers.length
    const numWrongQuest = quizResult.wrongAnswers.length

    const score = (numCorrectQuest) / numTotalQuest - (numWrongQuest * 0.25) / numTotalQuest
    quizResult.score = score * 100
    return quizResult
}


export const evaluateLesson = (lesson: Lesson, solutionInitialTest: QuizResults, solutionFinalTest: QuizResults): LessonResults => {
    if (!lesson || !solutionFinalTest.id) {
        return {} as LessonResults
    }
    const lessonResult = {} as LessonResults
    lessonResult.lessonId = lesson.id
    lessonResult.id = generateIdLessonResult(lesson.id, solutionFinalTest.userId)
    if (solutionInitialTest) lessonResult.initialQuizResult = solutionInitialTest
    lessonResult.finalQuizResult = solutionFinalTest
    lessonResult.totalScore = (solutionFinalTest.score || 0)
    if (solutionInitialTest){
        lessonResult.improvement = (solutionFinalTest.score || 0) - (solutionInitialTest.score || 0)
    } else {
        lessonResult.improvement = (solutionFinalTest.score || 0)
    }
    return lessonResult
}
