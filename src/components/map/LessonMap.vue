<template>
  <div class="main-wrapper">
    <canvas id="demo" width="512" height="512"></canvas>
  </div>
</template>

<script>
import {FriendCard} from './../pages/FriendCard'
import {Game} from "./common";

export default {
  name:"LessonMap",
  props: {
    lesson: Array
  },
  methods:{
   created(){
       let context = document.getElementById('demo').getContext('2d');
       Game.run(context);
   }
  },
  computed: {
  }
}
</script>


<style>
canvas {
  background: #000;
}

.main-wrapper {
  width: 512px;
  padding-left: 1em;
  padding-right: 1em;
  margin: 0 auto;
}

.main-header, .main-footer {
  text-align: center;
}

.subtitle {
  font-size: 1.5em;
}

.main-header {
  margin-top: 0;
  margin-bottom: 2em;
}

.main-header h1 {
  margin: 0;
  background: #31ffd5;
  padding: 0.5em 1em;
}

.main-header a {
  color: #000;
  text-decoration: none;
}

.main-footer {
  margin-top: 2em;
}

</style>