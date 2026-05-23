<template>
  <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
  <!-- <div>
    <div>
      <button class="button" @click="changeScene">Change Scene</button>
    </div>
    <div>
      <button :disabled="canMoveSprite" class="button" @click="moveSprite">Toggle Movement</button>
    </div>
    <div class="spritePosition">
      Sprite Position:
      <pre>{{ spritePosition }}</pre>
    </div>
    <div>
      <button class="button" @click="addSprite">Add New Sprite</button>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import Phaser from 'phaser';
import { ref, toRaw } from 'vue';
import PhaserGame from './PhaserGame.vue';

// The sprite can only be moved in the MainMenu Scene
const canMoveSprite = ref();

//  References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref();
const spritePosition = ref({ x: 0, y: 0 });

const changeScene = () => {
  const scene = toRaw(phaserRef.value.scene);

  if (scene) {
    //  Call the changeScene method defined in the `MainMenu`, `Game` and `GameOver` Scenes
    scene.changeScene();
  }
};

const moveSprite = () => {
  const scene = toRaw(phaserRef.value.scene);

  if (scene) {
    //  Call the `moveLogo` method in the `MainMenu` Scene and capture the sprite position
    scene.moveLogo(({ x, y }) => {
      spritePosition.value = { x, y };
    });
  }
};

//  This event is emitted from the PhaserGame component:
const currentScene = scene => {
  canMoveSprite.value = scene.scene.key !== 'MainMenu';
};
</script>

<style lang="css" scoped>
.button {
  /* background-color: blue; */
}
:deep(canvas) {
  border: 8px #135df4 solid;
  border-top-width: 0;
  border-radius: 10px;
}
</style>
