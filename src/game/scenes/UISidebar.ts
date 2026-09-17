import { Scene } from 'phaser';
import { EventBus } from '~/game/EventBus';
import { GameState } from '~/game/GameState';
import { COEF, HEADER_HEIGHT, VIEPORT_SIZE, VIEWPORT_MARGIN } from '~/game/constants';
import { UIButton } from '~/game/scenes/UIButton';
import { UIInformBanner } from '~/game/scenes/UIInformBanner';
export class UISidebar extends Scene {
  openedWindowId: 'Settings' | 'Menu' | null = null;
  textElem: Phaser.GameObjects.Text | null = null;
  textElem1: Phaser.GameObjects.Text | null = null;
  button: UIButton | null = null;
  constructor() {
    super('UISidebar');
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setViewport(0, HEADER_HEIGHT, width, height - HEADER_HEIGHT);
    // let bg = this.add.graphics();
    // bg.fillStyle(0x4f3232, 1);
    // bg.fillRect(0, 0, width, height - HEADER_HEIGHT);
    console.log(width - 301);
    console.log(height - HEADER_HEIGHT);
    this.add
      .image(width / 2, (height - HEADER_HEIGHT) / 2, 'main-bg')
      .setDisplaySize(width, height - HEADER_HEIGHT);
    const container = this.add.container(
      VIEPORT_SIZE + VIEWPORT_MARGIN + 1 + (224 * (COEF - 1)) / 2,
      5
    );
    this.scene.sendToBack();

    // this.button = new UIButton({
    //   scene: this,
    //   x: 0,
    //   y: 0,
    //   label: 'Играть3',
    //   width: 160,
    //   pointerdownHandler: () => {
    //     this.registry.set('currentLevel', 1);
    //     this.registry.set('showedLevel', null);
    //     GameState.currentLevel = 1;
    //     this.scene.launch('Level');
    //     this.scene.stop('LevelsMap');
    //   },
    // }).setVisible(false);
    const inforBanner = new UIInformBanner({ scene: this });
    container.add([inforBanner]);

    // this.textElem = this.add
    //   .text(width - 100, 0, 'Игра', {
    //     fontFamily: 'Arial',
    //     fontSize: '10px',
    //   })
    //   .setOrigin(0.5, 0);
    // this.textElem1 = this.add
    //   .text(width - 100, 150, 'Игра', {
    //     fontFamily: 'Arial',
    //     fontSize: '10px',
    //   })
    //   .setOrigin(0.5, 0);
    this.registry.events.on('changedata-currentLevel', (parent, value) => {
      // const text = !value ? 'Игра' : `Уровень: ${value}`;
      // this.textElem1!.setText(text);
      // console.log('mf');
    });

    this.registry.events.on('changedata-showedLevel', (parent, value) => {
      // this.textElem!.setText(`Демонстрируемый Уровень: ${value}`);
      // this.button?.setVisible(!!value);
      // console.log('dfafsd');
    });
  }
}
