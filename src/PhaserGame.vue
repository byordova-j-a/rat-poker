<template>
  <div id="game-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { EventBus } from './game/EventBus';
import StartGame from './game/main';

// Save the current scene instance
const scene = ref();
const game = ref();
const emit = defineEmits(['current-active-scene']);

onMounted(() => {
  game.value = StartGame('game-container');

  EventBus.on('current-scene-ready', (currentScene: Phaser.Scene) => {
    emit('current-active-scene', currentScene);

    scene.value = currentScene;
  });
});

onUnmounted(() => {
  if (game.value) {
    game.value.destroy(true);
    game.value = null;
  }
});

defineExpose({ scene, game });
</script>
<style lang="css">
#game-container {
  width: 100vw;
  height: 80vh;
  /* background-color: red; */
  /* display: flex; 
  justify-content: center; 
  align-items: center;
  margin: 0 auto; */
}
</style>
