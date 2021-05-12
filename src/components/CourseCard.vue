<template>
  <v-card
      class="mx-auto card"
      max-width="344"
  >
    <v-img
        v-if="course.imageUrl"
        :src="course.imageUrl"
    ></v-img>
    <v-card-text>
      <div>{{$t('Course')}}</div>
      <p class="display-1 text--primary">
        {{ course.title }}
      </p>
      <p>{{ course.subtitle }}</p>
      <div class="text--primary">
        {{ course.description }}
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
          text
          color="teal accent-4"
          v-on:click="select(course)"
      >
        {{$t('View lessons')}}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Quiz} from "../models/Quiz";
import {Course} from "@/models/Course";

@Component({
  components: {},
})
export default class QuizCard extends Vue {
  @Prop({required: false})
  public course: Course | undefined

  public select = async  (course: Course) => {
    await  this.$store.dispatch('setSelectedCourseAction', course)
    await this.$router.push({ name: 'Lessons', params: { courseId:course.id } })
  }

}
</script>
<style>
.card {
  margin:30px
}
</style>