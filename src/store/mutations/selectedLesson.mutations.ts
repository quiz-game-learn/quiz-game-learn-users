import {State} from "../../models/State";
import {Course} from "@/models/Course";
import {Lesson} from "@/models/Lessons";

export const setSelectedLessonMutation = (state: State, selectedQuiz: Lesson) => {
    state.selectedLesson = selectedQuiz
}
