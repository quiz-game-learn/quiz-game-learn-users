<template>
  <v-container v-if="quiz">
    <v-card
        class="mx-auto description"
        max-width="544"
    >
      <v-card-text>
        <div>{{ $t('Quiz Results') }}
          <v-chip
              v-if="quiz.type === 'INITIAL'"
              small
              class="ma-2"
              color="blue"
              outlined
          >{{$t('Initial')}}</v-chip>
          <v-chip
              v-if="quiz.type === 'FINAL'"
              class="ma-2"
              small
              color="green"
              outlined
          >{{$t('Final')}}</v-chip>
        </div>

        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1">
              {{ quiz.title }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="quizResults"
                                  class=" mb-1">
              <strong>{{$t('Score')}}</strong>: {{Math.round(quizResults.score)}}
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="quizResults"
                                  class=" mb-1">
              <strong>{{$t('Correct answers')}}</strong>: {{quizResults.correctAnswers.length}}
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="quizResults"
                                  class=" mb-1">
              <strong>{{$t('Wrong answers')}}</strong>: {{quizResults.wrongAnswers.length}}
            </v-list-item-subtitle>

          </v-list-item-content>

          <v-list-item-avatar
              tile
              size="120"
              v-if="quizResults"
          >
            <vc-donut
                v-if="quizResults"
                background="black" foreground="grey"
                :size="100" unit="px" :thickness="30"
                :text="quizResults.score"
                :sections="[{ value: quizResults.score }]" :total="100"
                :start-angle="0" :auto-adjust-text-size="true"
            >
              <h1>{{ Math.round(quizResults.score) }}
                <v-icon v-if="quizResults.score<=25" small>mdi-close</v-icon>
                <v-icon v-if="quizResults.score>25 && quizResults.score<=50" small>mdi-chevron-up</v-icon>
                <v-icon v-if="quizResults.score>50 && quizResults.score<=75" small>mdi-checkbox-marked-circle</v-icon>
                <v-icon v-if="quizResults.score>75" small>mdi-flash</v-icon>
              </h1>

            </vc-donut>

          </v-list-item-avatar>
        </v-list-item>

      </v-card-text>
    </v-card>

    <div v-for="(question, questionIndex) in quiz.questions"
         :key="question.questionText + questionIndex">
      <v-card
          v-if="userAnswer(questionIndex)"
          class="mx-auto lesson"
          max-width="444"
          outlined
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div class="subtitle-1">
              {{ question.questionText }}
            </div>

            <v-list-item-subtitle>
              <strong>{{ $t('You answered') }}: </strong>
              <div class="answer2" v-for="ans in userAnswer(questionIndex)" :key="ans">
                <v-icon small>mdi-arrange-bring-to-front</v-icon>
                {{ ans }}
                <span class="ansIcon"><v-icon v-if="isCorrect(questionIndex, ans)" small>mdi-check</v-icon>
                <v-icon v-else small>mdi-close</v-icon>
                  </span>
              </div>
            </v-list-item-subtitle>

            <v-list-item-subtitle>
              <strong>{{ $t('Correct') }}: </strong>
              <div class="answer2" v-for="ans in correctAnswer(questionIndex)" :key="ans">
                {{ ans }}
              </div>
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-avatar
              tile
              size="50"
          >
            <v-icon>mdi-checkbox-multiple-marked</v-icon>

          </v-list-item-avatar>
        </v-list-item>
      </v-card>
    </div>

    <div class="button">
      <v-btn
          text
          color="teal accent-4"
          v-on:click="lessonMenu()"
      >
        <v-icon>mdi-chevron-double-left</v-icon>
        {{ $t('Lesson menu') }}
      </v-btn>
      <v-btn
          text
          color="teal accent-4"
          v-if="quiz.type === 'INITIAL'"
          v-on:click="continueLesson()"
      >
        {{ $t('Start lesson') }}
        <v-icon>mdi-chevron-double-right</v-icon>
      </v-btn>
      <v-btn
          text
          color="teal accent-4"
          v-if="quiz.type === 'FINAL'"
          v-on:click="lessonResults()"
      >
        {{ $t('Lesson Results') }}
        <v-icon>mdi-chevron-double-right</v-icon>
      </v-btn>
    </div>

  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {getLesson, getQuiz, getUserSolutions, saveQuizResults} from "@/services/dbService";
import {Quiz, QuizType} from "@/models/Quiz";
import {ChosenAnswerMultichoice, QuizUserSolution} from "@/models/QuizUserSolution";
import {QuizResults} from "@/models/QuizResults";
import {evaluateQuiz} from "@/services/evaluationService";
import {setFinalQuizAsFinished, setInitialQuizAsFinished} from "@/services/progressService";
import {Lesson} from "@/models/Lessons";

@Component({
  components: {},
})
export default class QuizResultsMenu extends Vue {
  public quiz: Quiz | undefined
  public quizUserSolution: QuizUserSolution
  public quizResults: QuizResults
  public lesson: Lesson

  get user() {
    return this.$store.state.user
  }

  correctAnswer(questionIndex: number): string[] {
    const question = (this.quiz as Quiz).questions[questionIndex]
    const correct = question.correctAnswers
    return correct.map(opt => question.answerOptions[opt])
  }

  isCorrect(questionIndex: number, answer: string) {
    const correct = this.correctAnswer(questionIndex)
    return correct.includes(answer)
  }

  userAnswer(questionIndex: number): string[] {
    const question = (this.quiz as Quiz).questions[questionIndex]
    const answ = this.quizUserSolution.userAnswers.find((answ) => answ.questionIndex == questionIndex) as ChosenAnswerMultichoice
    if (answ) {
      return answ.selectedOptions.map(opt => question.answerOptions[opt])
    } else {
      return []
    }
  }

  async getPreviousSolution(quizId: string) {
    if (this.user.uid) {
      const prevSol = await getUserSolutions(quizId, this.user.uid) as QuizUserSolution
      if (prevSol) {
        this.quizUserSolution = Object.assign({}, prevSol)
      }
    }
  }

  isChecked(questionIndex: number, answerIndex: number): boolean {

    if (this.quizUserSolution && this.quizUserSolution.userAnswers) {
      const answer = this.quizUserSolution.userAnswers.find((answ) => answ.questionIndex == questionIndex) as ChosenAnswerMultichoice
      if (!answer) return false
      return answer.selectedOptions.includes(answerIndex)
    }
    return false
  }

  async continueLesson() {
    if (this.lesson.parts && this.lesson.parts.length>0) {
      this.$router.push({name: 'LessonPart', params: {lessonId: (this.quiz as Quiz).lessonId}})
    } else if (this.lesson.finalQuiz && this.lesson.finalQuiz.id) {
      this.$router.push({name: 'QuizEntry', params: {quizId: (this.lesson as Lesson).finalQuiz.id}})
    }
  }

  async lessonResults () {
    this.$router.push({name: 'LessonResults', params: {lessonId: (this.quiz as Quiz).lessonId}})
  }

  async lessonMenu() {
    console.log()
    this.$router.push({name: 'LessonMainMenu', params: {lessonId: (this.quiz as Quiz).lessonId}})

  }

  async created() {
    this.quiz = await getQuiz(this.$route.params.quizId) as Quiz
    this.lesson = await getLesson(this.quiz.lessonId) as Lesson

    await this.getPreviousSolution(this.$route.params.quizId)
    await this.evaluateResults()
    if ((this.quiz as Quiz).type === QuizType.INITIAL) {
      await setInitialQuizAsFinished((this.quiz as Quiz).lessonId, this.user.uid)
    } else {
      await setFinalQuizAsFinished((this.quiz as Quiz).lessonId, this.user.uid)
    }
    this.$forceUpdate()
  }

  async evaluateResults() {
    const results = evaluateQuiz((this.quiz as Quiz), this.quizUserSolution)
    this.quizResults = results
    await saveQuizResults(results)
    console.log(this.quizResults)
    this.$forceUpdate()
  }

}
</script>

<style>
.description {
  margin: 30px
}

.answer2 {
  padding: 5px;
  margin-left: 10px;
}

.ansIcon {
  margin-left: 10px;
}

.button {
  text-align: center;
  margin: 0 auto;
}
</style>