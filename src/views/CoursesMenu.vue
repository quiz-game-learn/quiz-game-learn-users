<template>
  <div>
    <v-container fluid>

    <CourseCard :course="item" v-for="item in courses" :key="item.id">
    </CourseCard>

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

@Component({
  components: {CourseCard, DeleteDialog},
})
export default class CoursesMenu extends Vue {
  public loading = true

  get courses() {
    return this.$store.state.availableCoursesForUser
  }

  async created() {
    await this.$store.dispatch('setAvailableCoursesForUser')
    this.loading = false
  }


}
</script>
<style>
.create{
  margin-left: 10px;
}
</style>