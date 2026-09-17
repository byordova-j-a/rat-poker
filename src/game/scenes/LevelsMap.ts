import { EventBus } from '../EventBus';
import { Scene, GameObjects } from 'phaser';
import { GameState } from '~/game/GameState';
import { HEADER_HEIGHT, VIEPORT_SIZE, VIEWPORT_MARGIN } from '~/game/constants';
import { Door } from '~/game/scenes/Door';
export class LevelsMap extends Scene {
  levels: Map<number, GameObjects.Image> = new Map();
  constructor() {
    super('LevelsMap');
  }

  create() {
    console.log('levelsmap');
    this.cameras.main.setViewport(
      VIEWPORT_MARGIN,
      HEADER_HEIGHT + VIEWPORT_MARGIN,
      VIEPORT_SIZE,
      VIEPORT_SIZE
    );
    const levels = GameState.levelList;
    let bg = this.add.graphics();
    // bg.fillStyle(0xd9f2c9, 1);
    bg.fillRect(0, 0, VIEPORT_SIZE, VIEPORT_SIZE);
    // this.add.image(size / 2, size / 2, 'map').setDisplaySize(width, height);
    const levelCardsContainer = this.add.container(15, 15);
    const doorSpriteList = levels.map(({ id }, idx) => {
      const a = idx % 5;
      const b = Math.trunc(idx / 5);
      const x = !a ? 0 : a * (88 + 15);
      const y = b * (110 + 20);
      return new Door(this, x, y, id);
    });
    // const doorSprite1 = new Door(this, 0, 0, 1);
    // const doorSprite2 = new Door(this, 88 + 15, 0, 2);
    // const doorSprite3 = new Door(this, 88 + 15, 0, 2);

    //   const hitArea = new Phaser.Geom.Polygon([
    //     0, 110,                         // Левый нижний угол
    //     0, 55,       // Левый верхний угол (начало арки)
    //     x - radius * 0.7, y - height + radius * 0.3, // Точки скругления
    //     x, y - height,                         // Самый пик арки (центр верхушки)
    //     x + radius * 0.7, y - height + radius * 0.3,
    //     x + radius, y - height + radius,       // Правый верхний угол (конец арки)
    //     x + radius, y                          // Правый нижний угол
    // ]);
    levelCardsContainer.add(doorSpriteList);
    // this.input.on('pointerdown', (event, currentlyOver) => {
    //   if (currentlyOver.length > 0) {
    //     console.log('d');
    //   } else console.log('fdf');
    // });

    // [...Array(10).keys()].forEach(id => {
    //   const x = 300 + Math.trunc(id / 4) * 400 - Math.cos((Math.PI * (id % 4)) / 4) * 200;
    //   const coefY = Math.trunc(id / 4) % 2 === 0 ? 1 : -1;
    //   const y = 300 - Math.sin((Math.PI * (id % 4)) / 4) * 200 * coefY;
    //   const level = this.add.image(x, y, 'circle');

    //   this.levels.set(id, level);
    //   level.setInteractive({ useHandCursor: true });
    //   level.setDisplaySize(width / 15, width / 15);

    //   level.on('pointerover', () => {
    //     console.log('m1');
    //     level.setTint(0x00ff00); // Подсвечиваем зеленым
    //     level.setDisplaySize(width / 15 + 19, width / 15 + 19); // Немного увеличиваем
    //   });

    //   // 3. Событие при уходе курсора (Hover Out)
    //   level.on('pointerout', () => {
    //     level.clearTint(); // Сбрасываем цвет
    //     level.setDisplaySize(width / 15, width / 15);
    //   });
    //   level.on('pointerdown', () => {
    //     this.registry.set('currentLevel', 1);
    //     GameState.currentLevel = 1;
    //     this.scene.start('Level');
    //   });
    // });
  }
}
