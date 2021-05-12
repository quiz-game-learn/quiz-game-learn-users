<template>
  <v-container v-if="quiz">
    <v-card
        class="mx-auto description"
        max-width="544"
    >
      <v-img
          v-if="quiz.imageUrl"
          :src="quiz.imageUrl"
      ></v-img>
      <v-card-text>
        <div>{{ $t('Quiz') }}</div>
        <p class="display-1 text--primary">
          {{ quiz.title }}
        </p>
        <p>{{ quiz.subtitle }}</p>
        <div class="text--primary">
          {{ quiz.description }}
        </div>
      </v-card-text>
    </v-card>

    <v-card
        class="mx-auto lesson"
        max-width="444"
        v-for="(question, questionIndex) in quiz.questions"
        :key="question.questionText + questionIndex"
        outlined
    >
      <v-list-item three-line>
        <v-list-item-content>
          <div class="subtitle-1">
            {{ question.questionText }}
          </div>
          <div class="answer" v-for="(answer, answerIndex) in question.answerOptions"
               :key="answer+ answerIndex">
            <input type="checkbox" :checked="isChecked(questionIndex, answerIndex)"
                   @change="check(questionIndex, answerIndex)"/> {{ answer }}
            <div                   v-if="question.answerImages && question.answerImages[answer]"
                                   class="image">
              <v-img
                  lazy-src="https://picsum.photos/id/11/10/6"
                  max-height="300"
                  max-width="300"
                  style="margin: 0 auto"
                  :src="question.answerImages[answer]"
              ></v-img>
            </div>
          </div>
        </v-list-item-content>

        <v-list-item-avatar
            tile
            size="120"
            color="grey"
            v-if="quiz.imageUrl"
        >
          <v-img

              :src="quiz.imageUrl"
          ></v-img>
        </v-list-item-avatar>
      </v-list-item>
    </v-card>

    <div class="button">
      <v-btn
          text
          color="teal accent-4"
          v-on:click="continueLesson()"
      >
        {{ $t('See results') }}
        <v-icon>mdi-chevron-double-right</v-icon>
      </v-btn>
    </div>

  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {getQuiz, getUserSolutions, saveUserSolutions} from "@/services/dbService";
import {Quiz, QuizType} from "@/models/Quiz";
import {ChosenAnswerMultichoice, QuizUserSolution} from "@/models/QuizUserSolution";
import {v4 as uuidv4} from "uuid";
import {
  setFinalQuizAsFinished,
  setFinalQuizAsStarted,
  setInitialQuizAsFinished,
  setInitialQuizAsStarted
} from "@/services/progressService";

@Component({
  components: {},
})
export default class QuizEntry extends Vue {
  public quiz: Quiz | undefined
  public quizUserSolution: QuizUserSolution

  get user() {
    return this.$store.state.user
  }

  async getPreviousSolution(quizId: string) {
    if (this.user.uid) {
      const prevSol = await getUserSolutions(quizId, this.user.uid) as QuizUserSolution
      if (prevSol) {
        this.quizUserSolution = Object.assign({}, prevSol)

      } else {
        this.quizUserSolution = {} as QuizUserSolution
        const answers = [] as ChosenAnswerMultichoice[]
        this.quizUserSolution.userAnswers = answers
        this.quizUserSolution.startedAt = new Date()
        this.quizUserSolution.userId = this.user.uid
        this.quizUserSolution.quizId = quizId
        this.quizUserSolution.id = uuidv4()
      }
    }
  }

  async saveUserSolutionDb() {
    await saveUserSolutions(this.quizUserSolution)
  }

  isChecked(questionIndex: number, answerIndex: number): boolean {

    if (this.quizUserSolution && this.quizUserSolution.userAnswers) {
      const answer = this.quizUserSolution.userAnswers.find((answ) => answ.questionIndex == questionIndex) as ChosenAnswerMultichoice
      if (!answer) return false
      return answer.selectedOptions.includes(answerIndex)
    }
    return false
  }


  check(questionIndex: number, answerIndex: number) {
    if (this.quizUserSolution && this.quizUserSolution.userAnswers) {
      let answer = this.quizUserSolution.userAnswers.find((answ) => answ.questionIndex == questionIndex) as ChosenAnswerMultichoice
      if (!answer) {
        answer = {questionIndex} as ChosenAnswerMultichoice
        answer.selectedOptions = []
        this.quizUserSolution.userAnswers.push(answer)
      }
      this.checkResponseInAnswer(answer, answerIndex)
      this.saveUserSolutionDb()
    }
  }

  checkResponseInAnswer(answer: ChosenAnswerMultichoice, answerIndex: number) {
    if (answer.selectedOptions.includes(answerIndex)) {
      answer.selectedOptions.splice(answer.selectedOptions.indexOf(answerIndex), 1)
    } else {
      answer.selectedOptions.push(answerIndex)
      answer.selectedOptions = answer.selectedOptions.filter((element: number, i: number) => i === answer.selectedOptions.indexOf(element))
    }
  }

  async continueLesson() {
    this.quizUserSolution.completed = true
    console.log(this.quizUserSolution)
    await saveUserSolutions(this.quizUserSolution)

    if ((this.quiz as Quiz).type === QuizType.INITIAL) {
      await setInitialQuizAsFinished((this.quiz as Quiz).lessonId, this.user.uid)
    } else {
      await setFinalQuizAsFinished((this.quiz as Quiz).lessonId, this.user.uid)
    }

    this.$router.push({name: 'QuizResults', params: {quizId: (this.quiz as Quiz).id}})

  }

  async created() {
    this.quiz = await getQuiz(this.$route.params.quizId) as Quiz
    await this.getPreviousSolution(this.$route.params.quizId)

    if (this.quiz.type === QuizType.INITIAL) {
      await setInitialQuizAsStarted(this.quiz.lessonId, this.user.uid)
    } else {
      await setFinalQuizAsStarted(this.quiz.lessonId, this.user.uid)
    }

    this.$forceUpdate()
  }

}
</script>

<style>
.description {
  margin: 30px
}

.answer {
  margin: 10px;
}

.button {
  text-align: center;
  margin: 0 auto;
}

.image {
  padding-top: 10px;
}
</style>