import {Quiz} from "../../models/Quiz";
import {getCoursesAvailable, getLessonsInCourse, getQuizzesAvailable} from "@/services/dbService";
import {Course} from "@/models/Course";
import {Lesson} from "@/models/Lessons";
import {State} from "@/models/State";

export const setAvailableLessonsInCourse = ({commit, state}: any, courseId: string) => {
    console.log(state)
    getLessonsInCourse(1000,0, courseId).then((lessons: Lesson[]) => {
        console.log(lessons)
        commit('setAvailableLessonsInCourseMutation',lessons)
    })
}
