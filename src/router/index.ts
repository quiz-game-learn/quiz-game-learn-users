import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import CoursesMenu from '../views/CoursesMenu.vue'
import LessonMainMenu from "@/views/LessonMainMenu.vue";
import Register from "@/views/Register.vue";
import Login from "@/views/Login.vue";
import {getCurrentUserFirebase} from "@/firebase";
import Home from "@/views/Home.vue";
import LessonsMenu from "@/views/LessonsMenu.vue";
import QuizEntry from "@/views/QuizEntry.vue";
import QuizResults from "@/views/QuizResults.vue";
import LessonPart from "@/views/LessonPart.vue";
import LessonResultsMenu from "@/views/LessonResults.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresLogin: false }
  },
  {
    path: '/courses',
    name: 'Courses',
    component: CoursesMenu,
    meta: { requiresLogin: true }
  },
  {
    path: '/lessons/:courseId',
    name: 'Lessons',
    component: LessonsMenu,
    meta: { requiresLogin: true }
  },
  {
    path: '/lesson/:lessonId',
    name: 'LessonMainMenu',
    component: LessonMainMenu,
    meta: { requiresLogin: true }
  },
  {
    path: '/lesson-part/:lessonId',
    name: 'LessonPart',
    component: LessonPart,
    meta: { requiresLogin: true }
  },
  {
    path: '/quiz/:quizId',
    name: 'QuizEntry',
    component: QuizEntry,
    meta: { requiresLogin: true }
  },
  {
    path: '/quiz-results/:quizId',
    name: 'QuizResults',
    component: QuizResults,
    meta: { requiresLogin: true }
  },
  {
    path: '/lesson-results/:lessonId',
    name: 'LessonResults',
    component: LessonResultsMenu,
    meta: { requiresLogin: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresLogin: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresLogin: false }
  },
  {
    path: '/about',
    name: 'About',
    meta: { requiresLogin: true },
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresLogin);
  const user = await getCurrentUserFirebase()
  if (requiresAuth && !user){
    next('Login');
  }else{
    next();
  }
});


export default router
