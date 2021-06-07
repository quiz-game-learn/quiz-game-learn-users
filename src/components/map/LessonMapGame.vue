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
export default class LessonMapGame extends Vue {
  @Prop({required: false, type: Array})
  public lessons: Lesson | undefined

  public map = {
    cols: 8,
    rows: 8,
    tsize: 64,
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

  public Loader = {
    images: {}
  } as any;

  public createLoader() {
    this.Loader.loadImage = (key: string, src: string) => {
      const img = new Image();

      const d = new Promise((resolve: any, reject: any) => {
        img.onload = () => {
          this.Loader.images[key] = img;
          resolve(img);
        };

        img.onerror = (err) => {
          reject('Could not load image: ' + src);
        };
      });

      img.src = src;
      return d;
    };

    this.Loader.getImage = (key: string) => {
      return (key in this.Loader.images) ? this.Loader.images[key] : null;
    };
  }

  public Game = {} as any;

  public createGame() {
    this.Game.load = async () => {
      return [
        this.Loader.loadImage('tiles', 'tiles.png'),
        this.Loader.loadImage('character', 'character.png'),
        this.Loader.loadImage('tower', 'tower_low.png'),
        this.Loader.loadImage('castle', 'castle.png')
      ];
    };


    this.Game.run = async (context: any) => {
      this.Game.ctx = context;
      this.Game._previousElapsed = 0;

      const p = await this.Game.load();
      await Promise.all(p)

      this.Game.tileAtlas = this.Loader.getImage('tiles');
      console.log(this.Game.tileAtlas)
      this.Game.hero = {x: 128, y: 384, image: this.Loader.getImage('character')};

      //window.requestAnimationFrame(this.Game.tick);
    };


    this.Game._drawLayer = (layer: any) => {
      for (let c = 0; c < this.map.cols; c++) {
        for (let r = 0; r < this.map.rows; r++) {
          const tile = this.map.getTile(layer, c, r);
          if (tile !== 0) { // 0 => empty tile
            console.log(tile, this.Game.tileAtlas, this.Loader.getImage('tiles'), this.map.tsize)
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
    this.Game.ctx.drawImage(this.Game.hero.image as any, this.Game.hero.x, this.Game.hero.y);
    this.Game.ctx.drawImage(this.Loader.getImage('castle') as any, 248, 384);

    // draw map top layer
    this.Game._drawLayer(1);
  }


  createClickListeners(canvas: any) {
    const elemLeft = canvas.offsetLeft + canvas.clientLeft
    const elemTop = canvas.offsetTop + canvas.clientTop

    canvas.addEventListener('click', (event: any) => {
      const x = event.pageX - elemLeft,
          y = event.pageY - elemTop;

      const imageLen = 64
      const xCell = Math.floor(x / imageLen)
      const yCell = Math.floor(y / imageLen)
      console.log(xCell, yCell)
    }, false);
  }

  async mounted() {
    const canvas = document.getElementById('demo') as HTMLCanvasElement;

    this.createClickListeners(canvas)

    const context = canvas.getContext('2d');

    this.createLoader()

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