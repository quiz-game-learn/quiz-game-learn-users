import Vue from 'vue'
import Vuex from 'vuex'
import {State} from "../models/State";
import {setSelectedCourseMutation} from "@/store/mutations/selectedCourses.mutations";
import {setSelectedCourseAction} from "@/store/actions/selectedCourseAction.actions";
import {setAvailableCoursesForUser} from "@/store/actions/availableCoursesForUser.actions";
import {setAvailableCoursesForUserMutation} from "@/store/mutations/availableCoursesForUser.mutations";
import {setUserMutation} from "@/store/mutations/user.mutations";
import {setUser} from "@/store/actions/user.actions";
import {setLessonsMutation} from "@/store/mutations/lesson.mutations";
import {setLessons, setLessonsInCourse} from "@/store/actions/lesson.actions";
import {setSelectedLessonAction} from "@/store/actions/selectedLessonAction.actions";
import {setSelectedLessonMutation} from "@/store/mutations/selectedLesson.mutations";
import {setAvailableLessonsInCourseMutation} from "@/store/mutations/availableLessonsInCourse.mutations";
import {setAvailableLessonsInCourse} from "@/store/actions/availableLessonsInCourse.actions";

Vue.use(Vuex)

let selectedCourseLocalStorage
let selectedLessonLocalStorage

try {
    selectedCourseLocalStorage = JSON.parse(localStorage.getItem("selectedCourse") || "" as string)
} catch (e) {
    console.log(e)
}

try {
    selectedLessonLocalStorage = JSON.parse(localStorage.getItem("selectedLesson") || "" as string)
} catch (e) {
    console.log(e)
}
export default new Vuex.Store({
    state: {
        selectedCourse: selectedCourseLocalStorage || null,
        selectedLesson: selectedLessonLocalStorage || null,
        answers: [],
        status: null,
        lessons: null,
        user: null,
        availableCoursesForUser: null,
        availableLessonsInCourse: null
    } as State,
    mutations: {
        setSelectedCourseMutation: setSelectedCourseMutation,
        setSelectedLessonMutation: setSelectedLessonMutation,
        setUserMutation: setUserMutation,
        setLessonsMutation: setLessonsMutation,
        setAvailableCoursesForUserMutation: setAvailableCoursesForUserMutation,
        setAvailableLessonsInCourseMutation: setAvailableLessonsInCourseMutation,
    },
    actions: {
        setLessonsInCourse: setLessonsInCourse,
        setSelectedCourseAction: setSelectedCourseAction,
        setSelectedLessonAction: setSelectedLessonAction,
        setUser: setUser,
        setLessons: setLessons,
        setAvailableCoursesForUser: setAvailableCoursesForUser,
        setAvailableLessonsInCourse: setAvailableLessonsInCourse,
    },
    modules: {}
})

