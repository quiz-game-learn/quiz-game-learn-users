import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import store from "./store"

// firebase init - add your own config here
const firebaseConfig = {
    apiKey: "AIzaSyB6552oZVo2vQIvdP-N4daKxEWUexUePfE",
    authDomain: "quizz-learn-vue.firebaseapp.com",
    projectId: "quizz-learn-vue",
    storageBucket: "quizz-learn-vue.appspot.com",
    messagingSenderId: "907787151380",
    appId: "1:907787151380:web:4adff18546c12549661f01",
    measurementId: "G-1RCH7308W1"
};
firebase.initializeApp(firebaseConfig)

firebase.auth().onAuthStateChanged(user => {
    console.log("user -> ", user)
    store.dispatch("setUser", user);
});

export const getCurrentUserFirebase = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, reject);
    })
};

// utils
export const db = firebase.firestore()
export const auth = firebase.auth()
export const storage = firebase.storage()

// collection references
export const results = db.collection('results')
export const quizzesCollection = db.collection('quizzes')
export const partsCollection = db.collection('lessonContentParts')
export const coursesCollection = db.collection('courses')
export const lessonsCollection = db.collection('lessons')


export const quizzesResultsCollection = db.collection('quizesResults')
export const userSolutionsCollection = db.collection('userSolutions')
export const lessonsResultsCollection = db.collection('lessonsResults')
export const userProgressCollection = db.collection('userProgress')
export const lessonProgressCollection = db.collection('lessonProgress')

