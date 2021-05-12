<template>
  <vc-donut
      v-if="quizResults"
      background="black" foreground="grey"
      :size="size" unit="px" :thickness="30"
      :text="quizResults.score"
      :sections="[{ value: quizResults.score }]" :total="100"
      :start-angle="0" :auto-adjust-text-size="true"
  >
    <h1>{{ Math.round(quizResults.score) }}
      <v-icon v-if="quizResults.score<=25" small>mdi-close</v-icon>
      <v-icon v-if="quizResults.score>25 && quizResults.score<=50" small>mdi-chevron-up</v-icon>
      <v-icon v-if="quizResults.score>50 && quizResults.score<=75" small>
        mdi-checkbox-marked-circle
      </v-icon>
      <v-icon v-if="quizResults.score>75" small>mdi-flash</v-icon>
    </h1>

  </vc-donut>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {QuizResults} from "@/models/QuizResults";

@Component({
  components: {},
})
export default class QuizResultsChart extends Vue {
  @Prop({required: false})
  public quizResults: QuizResults | undefined

  @Prop({required: false, default: 50})
  public size: number
}
</script>
<style>
.card {
  margin: 30px
}
</style>