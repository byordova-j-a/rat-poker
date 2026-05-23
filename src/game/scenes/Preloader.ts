import { Scene } from 'phaser';
import { EMouseColor, EMouseType, EMoveType } from '~/game/types';
import { GameState } from '~/game/GameState';
import { MOUSE_FRAMES_CONFIG } from '~/game/constants';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    const { width, height } = this.scale;
    this.add
      .graphics()
      .lineStyle(2, 0xffffff, 0.6)
      .strokeRoundedRect((width - 468) / 2, (height - 32) / 2, 468, 32, 2);

    const bar = this.add.graphics();
    bar.fillStyle(0xffffff, 1);
    bar.fillRect((width - 468) / 2 + 2, (height - 32) / 2 + 2, 4, 28);

    this.load.on('progress', (progress: number) => {
      bar.clear();
      bar.fillStyle(0xffffff, 1);
      bar.fillRect((width - 468) / 2 + 2, (height - 32) / 2 + 2, 4 + 460 * progress, 28);
    });

    const imageList = [
      { key: 'bg1', path: 'assets/background/bg1.jpg' },
      { key: 'circle', path: 'assets/circle.png' },
      { key: 'map', path: 'assets/map.png' },
      { key: 'pinwheelCenter', path: 'assets/pinwheelCenter.png' },
    ];

    imageList.forEach(({ key, path }) => {
      this.load.image(key, path);
    });

    Object.values(EMouseColor).forEach(color => {
      this.load.spritesheet(`${color}-mouse`, `assets/sprites/${color}-mouse.png`, {
        frameWidth: 26,
        frameHeight: 27,
      });
    });

    this.load.spritesheet('door', `assets/sprites/door.png`, {
      frameWidth: 31,
      frameHeight: 25,
    });
    this.load.spritesheet('game-tiles', 'assets/gameTiles5.png', {
      frameWidth: 50,
      frameHeight: 50,
    });
    this.load.spritesheet('pinwheelVanes', 'assets/pinwheelVanes2.png', {
      frameWidth: 60,
      frameHeight: 8,
    });
  }

  create() {
    Object.values(EMouseColor).forEach(color => {
      Object.values(EMouseType).forEach(type => {
        Object.values(EMoveType).forEach(anim => {
          const { start, end } = MOUSE_FRAMES_CONFIG[type][anim];

          const mType = type === EMouseType.EMPTY ? 'mouse' : `mouse-${type}`;

          this.anims.create({
            key: `${color}-${mType}-${anim}`,
            frames: this.anims.generateFrameNumbers(`${color}-mouse`, { start, end }),
            frameRate: 10,
            repeat: -1,
          });
        });
      });
    });

    this.anims.create({
      key: 'open-door',
      frames: this.anims.generateFrameNumbers('door', { start: 0, end: 2 }),
      duration: 500,
      repeat: 0,
    });
    this.anims.create({
      key: 'close-door',
      frames: this.anims.generateFrameNumbers('door', { start: 2, end: 0 }),
      duration: 500,
      repeat: 0,
    });
    this.registry.set('currentLevel', null);

    this.scene.launch('UIHeader');

    this.scene.start('MainMenu');
    this.scene.launch('UISidebar');
    GameState.setMainScene('MainMenu');
  }
}
