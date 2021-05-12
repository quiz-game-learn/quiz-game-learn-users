import {State} from "../../models/State";
import {Quiz} from "../../models/Quiz";
import {Lesson} from "@/models/Lessons";

export const setAvailableLessonsInCourseMutation = (state: State, quizes: Lesson[]) => {
    state.availableLessonsInCourse = quizes
}
