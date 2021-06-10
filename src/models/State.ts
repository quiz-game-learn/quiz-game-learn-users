import {Quiz} from "./Quiz";
import {Lesson} from "./Lessons";
import {User, UserInfo} from "firebase";
import {Course} from "@/models/Course";
import {LevelInfo} from "@/models/LevelInfo";

export interface State {
    selectedCourse: Course | null,
    selectedLesson?: Lesson | null,
    availableCoursesForUser: Course[] | null,
    availableLessonsInCourse: Lesson [] | null,
    answers: Answer[],
    status: string | null,
    levelInfo: LevelInfo | null,
    user: User | null,
    userFirebase?: UserInfo | null,
    lessons: Lesson[] | null
}

export interface Answer {
    questionId: string
    questionNumber: string
    answer: string
    correct:boolean
}
