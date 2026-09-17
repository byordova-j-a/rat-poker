import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';
import { LevelsMap } from './scenes/LevelsMap';
import { Level } from '~/game/scenes/Level';
import { UIHeader } from '~/game/scenes/UIHeader';
import { UIModalWindow } from '~/game/scenes/UIModalWindow';
import { UISettingsWindow } from '~/game/scenes/UISettingsWindow';
import { UISidebar } from '~/game/scenes/UISidebar';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
// const config = {
//   type: Phaser.AUTO,
//   // width: 1024,
//   // height: 768,
//   width: 1920, // "Целевое" разрешение (логическое)
//   height: 1080,
//   mode: Phaser.Scale.FIT,
//   autoCenter: Phaser.Scale.CENTER_BOTH,
//   parent: 'game-container',
//   backgroundColor: '#028af8',
//   scene: [Boot, Preloader, MainMenu, Game, GameOver],
// };
const config = {
  type: Phaser.AUTO,
  width: 837,
  height: 600,
  // width: 1024,
  // height: 768,
  backgroundColor: '#028af8',
  autoCenter: Phaser.Scale.CENTER_BOTH,
  scale: {
    // Режим масштабирования: FIT вписывает игру, сохраняя пропорции
    mode: Phaser.Scale.FIT,
    // Автоматическое центрирование по горизонтали и вертикали
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    Boot,
    Preloader,
    MainMenu,
    Game,
    GameOver,
    LevelsMap,
    Level,
    UIHeader,
    UIModalWindow,
    UISettingsWindow,
    UISidebar,
  ],
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: true, // Рисует цветные рамки вокруг объектов
      // pixelArt: true, // Это сделает все спрайты четкими
      // antialias: false,
    },
  },
  render: {
    // pixelArt: true, // Это сделает все спрайты четкими
    // antialias: false,
  },
};

const StartGame = parent => {
  const game = new Phaser.Game(config);

  //   window.addEventListener('resize', () => {
  //     game.scale.refresh();
  //   });
  return game;
};

export default StartGame;
