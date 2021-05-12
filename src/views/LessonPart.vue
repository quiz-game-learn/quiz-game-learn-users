<template>
  <v-container>
    <v-row justify="space-around">
      <div v-if="part">
        <v-card
            class="mx-auto card"
            max-width="344"
        >
          <v-img
              v-if="part.headImageUrl"
              :src="part.headImageUrl"
          ></v-img>
          <v-card-text>
            <p class=" display-1 text--primary">
              {{ part.title }}
            </p>
            <p>{{ part.subtitle }}</p>
            <div class="text--primary">
            </div>
          </v-card-text>
        </v-card>
        <div class="text-center paginati" v-if="lesson">
          <v-pagination
              v-model="partIndex"
              @input="change()"
              @next="nextPage()"
              @previous="previousPage()"
              :length="lesson.parts.length"
          ></v-pagination>
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
                v-if="partIndex === lesson.parts.length"
                color="teal accent-4"
                v-on:click="continueLesson()"
            >
              {{ $t('Final test') }}
              <v-icon>mdi-chevron-double-right</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <div>
        <p class="content" v-if="part" v-html="part.content">
        </p>
        <v-btn
            text
            v-if="partIndex === lesson.parts.length"
            color="teal accent-4"
            v-on:click="continueLesson()"
        >
          {{ $t('Final test') }}
          <v-icon>mdi-chevron-double-right</v-icon>
        </v-btn>
      </div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {Lesson, Part} from "@/models/Lessons";
import {getLesson} from "@/services/dbService";
import {Quiz} from "@/models/Quiz";
import {setLessonPartEnd, setLessonPartStarted} from "@/services/progressService";

@Component({
  components: {},
})
export default class LessonPart extends Vue {
  public lesson: Lesson | undefined
  public partIndex = 1
  public part: Part

  get user() {
    return this.$store.state.user
  }

  public async nextPage() {
    if (this.partIndex < (this.lesson as Lesson).parts.length) {
      await this.getData()
    }
  }

  public async previousPage() {
    if (this.partIndex > 1) {
      await this.getData()
    }
  }

  async getData() {
    this.lesson = await getLesson(this.$route.params.lessonId) as Lesson
    this.part = this.lesson.parts[this.partIndex - 1]
    console.log(this.lesson)
    console.log(this.partIndex)
    await setLessonPartStarted((this.lesson as Lesson).id, this.user.uid, this.partIndex-1)
    this.$forceUpdate()
  }

  async created() {
    await this.getData()
  }


  async change() {
    await this.getData()
  }

  async continueLesson() {
    const finalQuizId = (this.lesson as Lesson).finalQuiz.id
    await setLessonPartEnd((this.lesson as Lesson).id, this.user.uid, this.partIndex-1)
    if (finalQuizId) {
      await this.$router.push({name: 'QuizEntry', params: {quizId: finalQuizId}})
    }
  }

  async lessonMenu() {
    await this.$router.push({name: 'LessonMainMenu', params: {lessonId: (this.lesson as Lesson).id}})

  }

}
</script>

<style>
.content img {
  max-width: 300px;
  margin: 0 auto;
  justify-content: center;
}

.content {
  max-width: 800px;
  padding-left: 50px;
}

.paginati {
  margin-bottom: 20px;
}
.button{
  margin-top: 30px;
}
</style>
