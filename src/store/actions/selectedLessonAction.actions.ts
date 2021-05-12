import {Quiz} from "../../models/Quiz";
import {getQuizzesAvailable} from "@/services/dbService";
import {Course} from "@/models/Course";
import {Lesson} from "@/models/Lessons";

export const setSelectedLessonAction = ({commit}: any, selectedLesson: Lesson) => {
    try{
        localStorage.setItem("selectedLesson", JSON.stringify(selectedLesson))
        commit('setSelectedLessonMutation',selectedLesson)
    } catch (e) {
        console.log(e)
    }

}
