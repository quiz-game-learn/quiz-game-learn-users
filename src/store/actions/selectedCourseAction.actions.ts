import {Quiz} from "../../models/Quiz";
import {getQuizzesAvailable} from "@/services/dbService";
import {Course} from "@/models/Course";

export const setSelectedCourseAction = ({commit}: any, selectedCourse: Course) => {
    console.log(selectedCourse)
    localStorage.setItem("selectedCourse", JSON.stringify(selectedCourse))
    commit('setSelectedCourseMutation',selectedCourse)
}
