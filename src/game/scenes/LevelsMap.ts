import { EventBus } from '../EventBus';
import { Scene, GameObjects } from 'phaser';
import { GameState } from '~/game/GameState';
import { HEADER_HEIGHT, VIEWPORT_MARGIN } from '~/game/constants';
export class LevelsMap extends Scene {
  levels: Map<number, GameObjects.Image> = new Map();
  constructor() {
    super('LevelsMap');
  }
  create() {
    console.log('levelsmap');
    const { width, height } = this.scale;
    const size = height - HEADER_HEIGHT - 2 * VIEWPORT_MARGIN;
    this.cameras.main.setViewport(VIEWPORT_MARGIN, HEADER_HEIGHT + VIEWPORT_MARGIN, size, size);
    // this.add.image(size / 2, size / 2, 'map').setDisplaySize(width, height);
    let bg = this.add.graphics();
    bg.fillStyle(0xf5f1ab, 1);
    bg.fillRect(0, 0, size, size);

    [...Array(10).keys()].forEach(id => {
      const x = 300 + Math.trunc(id / 4) * 400 - Math.cos((Math.PI * (id % 4)) / 4) * 200;
      const coefY = Math.trunc(id / 4) % 2 === 0 ? 1 : -1;
      const y = 300 - Math.sin((Math.PI * (id % 4)) / 4) * 200 * coefY;
      const level = this.add.image(x, y, 'circle');

      this.levels.set(id, level);
      level.setInteractive({ useHandCursor: true });
      level.setDisplaySize(width / 15, width / 15);

      level.on('pointerover', () => {
        console.log('m1');
        level.setTint(0x00ff00); // Подсвечиваем зеленым
        level.setDisplaySize(width / 15 + 19, width / 15 + 19); // Немного увеличиваем
      });

      // 3. Событие при уходе курсора (Hover Out)
      level.on('pointerout', () => {
        level.clearTint(); // Сбрасываем цвет
        level.setDisplaySize(width / 15, width / 15);
      });
      level.on('pointerdown', () => {
        this.registry.set('currentLevel', 1);
        GameState.currentLevel = 1;
        this.scene.start('Level');
      });
    });
  }
}
