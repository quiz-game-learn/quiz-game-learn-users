<template>
  <div class="main-wrapper">
    <canvas id="demo" width="512" height="512"></canvas>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Lesson} from "@/models/Lessons";

@Component({
  components: {},
})
export default class LessonMapGameTest extends Vue {
  @Prop({required: false, type: Array})
  public lessons: Lesson[] | undefined
  public sizeMap = 8
  public map = {
    cols: this.sizeMap,
    rows: this.sizeMap,
    tsize: this.sizeMap*this.sizeMap,
    layers: [[
      3, 3, 3, 3, 3, 3, 3, 3,
      3, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 2, 1, 3,
      3, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 2, 1, 1, 1, 3,
      3, 1, 1, 1, 2, 1, 1, 3,
      3, 1, 1, 1, 2, 1, 1, 3,
      3, 3, 3, 1, 2, 3, 3, 3
    ], [
      4, 3, 3, 3, 3, 3, 3, 4,
      4, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 5, 5, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 4,
      4, 4, 4, 0, 5, 4, 4, 4,
      0, 3, 3, 0, 0, 3, 3, 3
    ], [
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 5, 5, 5, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
    ]],
    getTile: function (layer: any, col: number, row: number) {
      return this.layers[layer][row * this.cols + col];
    }
  };

  public maxPixels = this.sizeMap*64

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
        this.loadImage('tiles', 'tiles.png'),
        this.loadImage('character', 'character.png'),
        this.loadImage('tower', 'tower_big.png'),
        this.loadImage('castle', 'building.png'),
        this.loadImage('flag', 'flag_blue.png')
      ];
    };


    this.Game.run = async (context: any) => {
      this.Game.ctx = context;
      this.Game._previousElapsed = 0;

      const p = await this.Game.load();
      await Promise.all(p)

      this.Game.tileAtlas = await this.getImage('tiles');
      console.log(this.Game.tileAtlas)
      this.Game.hero = {x: 128, y: 384, image: await this.getImage('character')};
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

  public renderMap() {
    // draw map background layer
    this.Game._drawLayer(0);
    // draw game sprites
    this.Game.ctx.font = '10px serif';

    this.Game.ctx.drawImage(this.Game.hero.image as any, this.Game.hero.x, this.Game.hero.y);
    this.Game.ctx.drawImage(this.getImage('tower') as any, 248, 384);
    this.Game.ctx.drawImage(this.getImage('castle') as any, 148, 284);
    this.Game._drawLayer(1);

    const numTowers = 8
    const margin = 20
    for (let i=0; i<= numTowers; i++) {
      const nrow = Math.floor(i/4)
      const ncol = i%4
      const x = this.maxPixels * ncol /4 + margin
      const y = this.maxPixels * nrow / 4 + margin
      this.Game.ctx.drawImage(this.getImage('castle') as any, x, y);
      this.Game.ctx.drawImage(this.getImage('flag') as any, x, y-10);
      this.Game.ctx.fillText(''+i, x, y);

    }

    // draw map top layer



  }


  async mounted() {
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