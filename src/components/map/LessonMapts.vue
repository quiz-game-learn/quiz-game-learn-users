<template>
  <div class="main-wrapper">
    <canvas id="demo" width="512" height="512"></canvas>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Game from "./common";
import {Lesson} from "@/models/Lessons";

@Component({
  components: {},
})
export default class LessonMapts extends Vue {
  @Prop({required: false, type:Array})
  public lessons: Lesson | undefined

  mounted(){
    const canvas = document.getElementById('demo') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    console.log(context)
    Game.run(context);
  }

}
</script>
<style>
.card {
  margin:30px
}
</style>