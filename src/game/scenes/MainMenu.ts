import { EventBus } from '../EventBus';
import { Scene, GameObjects } from 'phaser';
import { GameState } from '~/game/GameState';
import { HEADER_HEIGHT, VIEPORT_SIZE, VIEWPORT_MARGIN } from '~/game/constants';
import { UIButton } from '~/game/scenes/UIButton';
export class MainMenu extends Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const { width, height } = this.scale;
    const size = height - HEADER_HEIGHT - 2 * VIEWPORT_MARGIN;

    this.cameras.main.setViewport(
      VIEWPORT_MARGIN,
      HEADER_HEIGHT + VIEWPORT_MARGIN,
      VIEPORT_SIZE,
      VIEPORT_SIZE
    );

    // const buttonText = this.add
    //   .text(0, 0, 'Играть', {
    //     fontFamily: 'Arial Black',
    //     fontSize: 38,
    //     color: '#ffffff',

    //     align: 'center',
    //   })
    //   .setPadding(10, 4)
    //   .setOrigin(0.5);

    // const buttonBackground = this.add.rectangle(
    //   0,
    //   0,
    //   buttonText.width,
    //   buttonText.height,
    //   0x533a26
    // );

    // const button = this.add
    //   .container(VIEPORT_SIZE / 2, VIEPORT_SIZE / 2, [buttonBackground, buttonText])
    //   .setSize(buttonBackground.width, buttonBackground.height)
    //   .setInteractive({ useHandCursor: true });
    const container = this.add.container(VIEPORT_SIZE / 2, VIEPORT_SIZE / 2);
    const button = new UIButton({
      scene: this,
      label: 'Играть',
      x: -147 / 2,
      y: -64 / 2,
      fontSize: 40,
      pointerdownHandler: () => {
        console.log('m');
        this.scene.start('LevelsMap');
        GameState.setMainScene('LevelsMap');
        this.registry.set('scene', { type: 'levelsMap', value: null });
      },
    });
    console.log('333');
    console.log(button.height);
    container.add([button]);
    // button.on('pointerdown', () => {
    //   console.log('m');
    //   this.scene.start('LevelsMap');
    //   GameState.setMainScene('LevelsMap');
    //   this.registry.set('scene', { type: 'levelsMap', value: null });
    // });
  }
}
