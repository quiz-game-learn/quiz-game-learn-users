<template>
  <div>
    <v-container fluid>
      <div >
        <v-card class="map">
          <v-card-title>
            {{$t('Map')}}
          </v-card-title>
          <v-card-text v-if="lessons">
            <LessonMapGame :lessons="lessons"></LessonMapGame>
          </v-card-text>
        </v-card>
      <div>
        <LessonCard :lesson="item" v-for="item in lessons" :key="item.id">
        </LessonCard>
      </div>
      </div>
    </v-container>

  </div>

</template>

<script lang="ts">
/* eslint-disable */
import {Component, Vue} from 'vue-property-decorator';
import CourseCard from "@/components/CourseCard.vue";
import {Course} from "@/models/Course";
import {v4 as uuidv4} from "uuid";
import {saveCourse, deleteCourse} from "@/services/dbService";
import {uploadFile} from "@/services/filesService";
import DeleteDialog from "@/components/DeleteDialog.vue";
import LessonCard from "@/components/LessonCard.vue";
import {Lesson} from "@/models/Lessons";
import LessonMapGame from "@/components/map/LessonMapGame.vue";

@Component({
  components: {LessonMapGame, LessonCard, CourseCard, DeleteDialog},
})
export default class LessonsMenu extends Vue {
  public loading = true

  get lessons() {
    const lessons = this.$store.state.availableLessonsInCourse
    if (lessons) {
      return this.sortLesson(lessons)
    }
  }

  sortLesson(lessons: Lesson[]) {
    return lessons.sort((lesson1, lesson2) => {
      if (!lesson1.index && lesson2.index) return -1
      if (lesson1.index && !lesson2.index) return 1
      return lesson1.index - lesson2.index
    })
  }

  async mounted() {
    await this.$store.dispatch('setAvailableLessonsInCourse', this.$route.params.courseId)
    console.log(this.$route.params.courseId, this.$store.state.user.uid)

    this.$store.dispatch('updateLevel', {courseId: this.$route.params.courseId, userId:this.$store.state.user.uid})
    this.loading = false
  }


}
</script>
<style>
.create {
  margin-left: 10px;
}
.map {
  width: 400px;
  margin: 0 auto;
}
</style>