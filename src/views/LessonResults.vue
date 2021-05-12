<template>
  <v-container v-if="quizFinalResults">
    <v-row justify="space-around">

    <v-card
        class="mx-auto description"
        max-width="544"
    >
      <v-card-text>
        <div>{{ $t('Lesson Results') }}
        </div>

        <v-row>
          <v-col>
            <h1 class="headline">
              {{ lesson.title }}
            </h1>

            <div v-if="quizInitialResults"
                 class="result">
              <h2 class="subtitle-1">
                {{ $t('At first:') }}
              </h2>
              <strong>{{ $t('Score') }}</strong>: {{ Math.round(quizInitialResults.score) }}
              <br/>
              <strong>{{ $t('Correct answers') }}</strong>: {{ quizInitialResults.correctAnswers.length }}
              <br/>
              <strong>{{ $t('Wrong answers') }}</strong>: {{ quizInitialResults.wrongAnswers.length }}
            </div>

            <div v-if="quizFinalResults"
                 class="result">
              <h2 class="subtitle-1">
                {{ $t('After learning:') }}
              </h2>
              <strong>{{ $t('Score') }}</strong>: {{ Math.round(quizFinalResults.score) }}
              <br/>
              <strong>{{ $t('Correct answers') }}</strong>: {{ quizFinalResults.correctAnswers.length }}
              <br/>
              <strong>{{ $t('Wrong answers') }}</strong>: {{ quizFinalResults.wrongAnswers.length }}
            </div>

          </v-col>
          <v-col>
            <v-list-item-avatar
                tile
                size="220"
                v-if="quizInitialResults || quizFinalResults"
            >
              <QuizResultsChart class="chart" :quizResults="quizInitialResults" :size="70"></QuizResultsChart>
              <QuizResultsChart class="chart" :quizResults="quizFinalResults" :size="70"></QuizResultsChart>
            </v-list-item-avatar>
          </v-col>
        </v-row>

      </v-card-text>
    </v-card>

      <v-card
          v-if="lessonResults"
          class="mx-auto description"
          min-width="200"
          max-width="400"
      >
        <v-card-text>
          <v-row>
            <v-col>
              <div
                   class="result">
                <h2 class="subtitle-1">
                  {{ $t('Final results') }}
                </h2>
                <strong>{{ $t('Score') }}</strong>: {{ Math.round(lessonResults.totalScore) }}
                <br/>
                <strong>{{ $t('Improvement') }}</strong>: {{ Math.round(lessonResults.improvement) }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

    </v-row>
    <v-btn
        text
        class="back"
        color="teal accent-4"
        v-on:click="back()"
    >
      <v-icon>mdi-chevron-double-left</v-icon>

      {{ $t('Lesson Menu') }}
    </v-btn>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {getLesson, getQuizResults, getUserSolutions, saveLessonResults} from "@/services/dbService";
import {QuizUserSolution} from "@/models/QuizUserSolution";
import {LessonResults, QuizResults} from "@/models/QuizResults";
import {Lesson} from "@/models/Lessons";
import QuizResultsChart from "@/components/QuizResultsChart.vue";
import {evaluateLesson} from "@/services/evaluationService";

@Component({
  components: {QuizResultsChart},
})
export default class LessonResultsMenu extends Vue {
  public lesson: Lesson | undefined
  public quizInitialUserSolution: QuizUserSolution
  public quizFinalUserSolution: QuizUserSolution
  public quizInitialResults: QuizResults
  public quizFinalResults: QuizResults
  public lessonResults: LessonResults
  get user() {
    return this.$store.state.user
  }

  async getPreviousSolution(quizId: string) {
    if (this.user.uid) {
      const prevSol = await getUserSolutions(quizId, this.user.uid) as QuizUserSolution
      return prevSol
    }
  }


  async back() {
    console.log()
    this.$router.push({name: 'LessonMainMenu', params: {lessonId: (this.lesson as Lesson).id}})

  }


  async created() {
    this.lesson = await getLesson(this.$route.params.lessonId) as Lesson
    console.log(this.lesson)
    this.quizInitialUserSolution = await this.getPreviousSolution(this.lesson.initialQuiz.id) as QuizUserSolution
    this.quizFinalUserSolution = await this.getPreviousSolution(this.lesson.finalQuiz.id) as QuizUserSolution
    if (this.lesson.initialQuiz) {
      this.quizInitialResults = await getQuizResults(this.lesson.initialQuiz.id, this.user.uid) as QuizResults
    }

    if (this.lesson.finalQuiz) {
      this.quizFinalResults = await getQuizResults(this.lesson.finalQuiz.id, this.user.uid) as QuizResults
    }

    await this.evaluateResults()

    this.$forceUpdate()
  }

  async evaluateResults() {
    this.lessonResults = evaluateLesson(this.lesson as Lesson, this.quizInitialResults, this.quizFinalResults)
    console.log(this.lessonResults)
    if (this.lessonResults) await saveLessonResults(this.lessonResults)
  }

}
</script>

<style>
.description {
  margin: 30px
}

.chart {
  margin-right: 10px;
}

.result {
  margin-top: 20px;
  margin-left: 10px;
}

.back {
  margin-left: 50px;
}
</style>