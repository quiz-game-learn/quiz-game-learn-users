<template>
  <div style="width: 400px; height:400px; margin: 10px auto;">
    <canvas id="demo" width="400" height="400"></canvas>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Lesson} from "@/models/Lessons";
import {getLessonProgress} from "@/services/dbService";
import {LessonsProgress} from "@/models/Progress";

@Component({
  components: {},
})
export default class LessonMapGame extends Vue {
  @Prop({required: false, type: Array})
  public lessons: Lesson[]
  public lessonProgresses: LessonsProgress[] = [] as LessonsProgress[]

  get user() {
    return this.$store.state.user
  }

  public async getLessonProgresses() {
    for (const lesson of this.lessons) {
      let lessonProgress = await getLessonProgress(lesson.id, this.user.uid)
      if (!lessonProgress) {
        lessonProgress = {} as LessonsProgress
        lessonProgress.percentDone = 0
      }
      this.lessonProgresses.push(lessonProgress as LessonsProgress)
    }
    this.$forceUpdate()

  }

  public tileSize = 50
  public sizeMap = 8
  public map = {
    cols: this.sizeMap,
    rows: this.sizeMap,
    tsize: this.tileSize,
    layers: [
      [
        1, 3, 3, 3, 3, 3, 3, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 2, 2, 1, 1, 1,
        1, 3, 3, 2, 2, 3, 3, 1
      ], [
        1, 3, 3, 3, 3, 3, 3, 1,
        1, 0, 0, 0, 0, 0, 0, 0,
        1, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 4, 4, 0, 0, 4, 4, 0,
        0, 3, 3, 0, 0, 3, 3, 0
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 5, 5, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0
      ]],
    getTile: function (layer: any, col: number, row: number) {
      return this.layers[layer][row * this.cols + col];
    }
  };

  public maxPixels = this.sizeMap * this.tileSize

  public images = {} as any

  public loadImage = (key: string, src: string) => {
    const img = new Image();

    const d = new Promise((resolve: any, reject: any) => {
      img.onload = () => {
        this.images[key] = img;
        resolve(img);
      };

      img.onerror = (err) => {
        reject('Could not load image: ' + src);
      };
    });

    img.src = src;
    return d;
  };

  getImage = (key: string) => {
    return (key in this.images) ? this.images[key] : null;
  };


  public Game = {} as any;

  public createGame() {
    this.Game.load = async () => {
      return [
        this.loadImage('tiles', '../tiles_low.png'),
        this.loadImage('character', '../character.png'),
        this.loadImage('tower', '../tower_big.png'),
        this.loadImage('castle', '../building.png'),
        this.loadImage('flag', '../flag_blue.png'),
        this.loadImage('hero', '../hero_behind.gif')
      ];
    };


    this.Game.run = async (context: any) => {
      this.Game.ctx = context;
      this.Game._previousElapsed = 0;

      const p = await this.Game.load();
      try {
        await Promise.all(p)
      } catch (e) {
        console.log(e)
      }

      this.Game.tileAtlas = await this.getImage('tiles');
    };


    this.Game._drawLayer = (layer: any) => {
      for (let c = 0; c < this.map.cols; c++) {
        for (let r = 0; r < this.map.rows; r++) {
          const tile = this.map.getTile(layer, c, r);
          if (tile !== 0) { // 0 => empty tile
            this.Game.ctx.drawImage(
                this.Game.tileAtlas, // image
                (tile - 1) * this.map.tsize, // source x
                0, // source y
                this.map.tsize, // source width
                this.map.tsize, // source height
                c * this.map.tsize,  // target x
                r * this.map.tsize, // target y
                this.map.tsize, // target width
                this.map.tsize // target height
            );
          }
        }
      }
    };
  }

  public isCompleted(index: number) {
    if (this.lessonProgresses[index]) {
      return this.lessonProgresses[index].percentDone > 95
    } else {
      return false
    }
  }

  public renderMap() {
    this.Game._drawLayer(0);

    this.Game.ctx.font = '10px serif';

    this.Game.ctx.drawImage(this.getImage('hero'), 250, 250);
    this.Game._drawLayer(1);

    const numTowers = this.lessons.length
    const margin = 20
    for (let i = 0; i < numTowers; i++) {
      const nrow = Math.floor(i / 4)
      const ncol = i % 4
      const x = this.maxPixels * ncol / 4 + margin
      const y = this.maxPixels * nrow / 4 + margin * (nrow+1)

      if (i==numTowers-1){
        this.Game.ctx.drawImage(this.getImage('tower') as any, x, y-50);
        this.Game.ctx.fillText(this.lessons[i].title, x+45, y+10);

      } else {
        this.Game.ctx.drawImage(this.getImage('castle') as any, x, y);
        this.Game.ctx.fillText(this.lessons[i].title, x, y);
      }

      if (this.isCompleted(i)) {
        this.Game.ctx.drawImage(this.getImage('flag') as any, x, y);
      }
    }

    this.Game._drawLayer(2);
    this.$forceUpdate()

  }


  async mounted() {
    await this.getLessonProgresses()
    this.lessons = [...this.lessons].reverse()
    this.lessonProgresses = [...this.lessonProgresses].reverse()
    console.log(this.lessons, this.lessonProgresses)
    const canvas = document.getElementById('demo') as HTMLCanvasElement;

    const context = canvas.getContext('2d');

    this.createGame()

    await this.Game.run(context);

    this.renderMap()
  }

}
</script>
<style>
.card {
  margin: 30px
}
</style>