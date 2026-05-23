import { EventBus } from '../EventBus';
import { Scene, GameObjects } from 'phaser';
import { GameState } from '~/game/GameState';
import { HEADER_HEIGHT, VIEWPORT_MARGIN } from '~/game/constants';
export class MainMenu extends Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const { width, height } = this.scale;
    const size = height - HEADER_HEIGHT - 2 * VIEWPORT_MARGIN;
    this.add.image(size / 2, size / 2, 'bg1').setDisplaySize(size, size);
    this.cameras.main.setViewport(VIEWPORT_MARGIN, HEADER_HEIGHT + VIEWPORT_MARGIN, size, size);
    // console.log(this.scale.width);

    const buttonText = this.add
      .text(0, 0, 'Играть', {
        fontFamily: 'Arial Black',
        fontSize: 38,
        color: '#ffffff',

        align: 'center',
      })
      .setPadding(10, 4)
      .setOrigin(0.5);

    const buttonBackground = this.add.rectangle(
      0,
      0,
      buttonText.width,
      buttonText.height,
      0x007bff
    );

    const button = this.add
      .container(size / 2, size / 2, [buttonBackground, buttonText])
      .setSize(buttonBackground.width, buttonBackground.height)
      .setInteractive({ useHandCursor: true });

    button.on('pointerdown', () => {
      console.log('m');
      this.scene.start('LevelsMap');
      GameState.setMainScene('LevelsMap');
    });

    // this.logo = this.add.image(512, 300, 'logo').setDepth(100);
    // EventBus.emit('current-scene-ready', this);
  }

  // changeScene() {
  //   if (this.logoTween) {
  //     this.logoTween.stop();
  //     this.logoTween = null;
  //   }

  //   this.scene.start('Game');
  // }

  // moveLogo(vueCallback: ({ x, y }: { x: number; y: number }) => void) {
  //   if (this.logoTween) {
  //     if (this.logoTween.isPlaying()) {
  //       this.logoTween.pause();
  //     } else {
  //       this.logoTween.play();
  //     }
  //   } else {
  //     this.logoTween = this.tweens.add({
  //       targets: this.logo,
  //       x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
  //       y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
  //       yoyo: true,
  //       repeat: -1,
  //       onUpdate: () => {
  //         if (!this.logo) return;
  //         vueCallback({
  //           x: Math.floor(this.logo.x),
  //           y: Math.floor(this.logo.y),
  //         });
  //       },
  //     });
  //   }
  // }
}
