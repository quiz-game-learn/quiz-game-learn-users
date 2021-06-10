import {Quiz} from "../../models/Quiz";
import {
    getCoursesAvailable,
    getLessonProgress,
    getLessonProgressAvailable, getLessonResultsAvailable,
    getLessonsInCourse,
    getQuizzesAvailable
} from "@/services/dbService";
import {Course} from "@/models/Course";
import {Lesson} from "@/models/Lessons";
import {State} from "@/models/State";
import {calculateLevelInfo} from "@/services/experienceService";

export const updateLevel = ({commit, state}: any, payload: any) => {
    console.log(payload)
    const {userId} = payload
    getLessonProgressAvailable(userId).then(progress => {
        getLessonResultsAvailable(userId).then(results => {
            const levelInfo = calculateLevelInfo(progress, results)
            commit('setLevelInfo', levelInfo)
        })
    })
}
