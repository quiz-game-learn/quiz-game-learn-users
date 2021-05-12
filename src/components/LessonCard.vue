<template>
  <v-card
      class="mx-auto lesson"
      max-width="444"
      outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">
          {{$t('Lesson')}}
        </div>
        <v-list-item-title class="headline mb-1">
          {{ lesson.title }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ lesson.subtitle }}</v-list-item-subtitle>
        <v-list-item-subtitle> {{ lesson.description }}</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar
          tile
          size="120"
          color="grey"
      >
        <v-img
            v-if="lesson.imageUrl"
            :src="lesson.imageUrl"
        ></v-img>
      </v-list-item-avatar>
    </v-list-item>

    <v-card-actions>
      <v-btn
          outlined
          rounded
          text
          v-on:click="select(lesson)"
      >
        {{$t('Continue')}}
      </v-btn>
    </v-card-actions>
    <v-progress-linear
        v-if="lessonProgress"
        :value="''+lessonProgress.percentDone"
    ></v-progress-linear>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Lesson} from "@/models/Lessons";
import {LessonsProgress} from "@/models/Progress";
import {getLessonProgress} from "@/services/dbService";

@Component({
  components: {},
})
export default class QuizCard extends Vue {
  @Prop({required: false})
  public lesson: Lesson | undefined
  public lessonProgress: LessonsProgress | null

  public select = (lesson: Lesson) => {
    this.$store.dispatch('setSelectedLessonAction', lesson)
    this.$router.push({ name: 'LessonMainMenu', params: { lessonId:lesson.id } })

  }
  get user() {
    return this.$store.state.user
  }
  async created() {
    if (this.lesson && "id" in this.lesson) {
      this.lessonProgress = await getLessonProgress(this.lesson.id, this.user.uid)
    }
    this.$forceUpdate()

  }

}
</script>
<style>
.lesson {
  margin:30px
}
</style>