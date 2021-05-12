import {State} from "../../models/State";
import {Quiz} from "../../models/Quiz";
import {Course} from "@/models/Course";

export const setAvailableCoursesForUserMutation = (state: State, quizes: Course[]) => {
    state.availableCoursesForUser = quizes
}
