import { Scene } from 'phaser';
import { EventBus } from '~/game/EventBus';
import { GameState } from '~/game/GameState';
import { HEADER_HEIGHT } from '~/game/constants';
export class UISidebar extends Scene {
  openedWindowId: 'Settings' | 'Menu' | null = null;
  textElem: Phaser.GameObjects.Text | null = null;
  constructor() {
    super('UISidebar');
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setViewport(0, HEADER_HEIGHT, width, height - HEADER_HEIGHT);
    let bg = this.add.graphics();
    bg.fillStyle(0x4f3232, 1);
    bg.fillRect(0, 0, width, height - HEADER_HEIGHT);
    this.scene.sendToBack();
    //   let bg = this.add.image(400, 30, '__WHITE'); // Используем встроенную белую текстуру
    //   bg.setDisplaySize(800, 60);
    //   bg.setTint(0x0080ff, 0x0080ff, 0x0033aa, 0x0033aa);
    //   const gr = this.add.graphics();

    //   gr.fillStyle(0xffffff, 1);
    //   gr.fillRect(0, 30, 800, 30);
    //   const iconContainer = this.add.container(5, 5);
    this.textElem = this.add.text(width - 180, 0, 'Игра', {
      fontFamily: 'Arial',
      fontSize: '20px',
    });
    this.registry.events.on('changedata-currentLevel', (parent, value) => {
      const text = !value ? 'Игра' : `Уровень: ${value}`;

      this.textElem!.setText(text);
    });
    //   const mouse = this.add.image(10, 10, 'red-mouse', 0).setDisplaySize(20, 20);
    //   iconContainer.add([mouse, text]);

    //   const topButtonContainer = this.add.container(725, 5);
    //   const bottomButtonContainer = this.add.container(5, 35);

    //   const btn1 = this.add.graphics();
    //   btn1.fillStyle(0xffffff, 1);
    //   btn1.fillRect(0, 0, 20, 20);

    //   btn1.setInteractive(new Phaser.Geom.Rectangle(0, 0, 20, 20), Phaser.Geom.Rectangle.Contains);
    //   btn1.on('pointerdown', () => {
    //     console.log('d');
    //   });
    //   topButtonContainer.add([btn1]);

    //   const menuButton = this.add.container(0, 0);
    //   menuButton.setInteractive({
    //     hitArea: new Phaser.Geom.Rectangle(0, 0, 50, 20),
    //     hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    //     useHandCursor: true,
    //   });

    //   menuButton.on('pointerdown', () => {
    //     if (GameState.launchedScene) return;

    //     this.scene.pause(GameState.mainScene);
    //     this.scene.launch('UIModalWindow');
    //     GameState.setLaunchedScene('UIModalWindow');
    //   });

    //   const menuButtonBg = this.add.graphics();

    //   menuButtonBg.fillStyle(0x135df4, 1);
    //   menuButtonBg.fillRect(0, 0, 50, 20);
    //   const menuButtonText = this.add
    //     .text(25, 10, 'Меню', {
    //       fontSize: '16px',
    //       fontFamily: 'Arial',
    //       color: '#000000',
    //     })

    //     .setOrigin(0.5)
    //     .setResolution(2);
    //   menuButton.add([menuButtonBg, menuButtonText]);

    //   const settingsButton = this.add.container(70, 0);
    //   settingsButton.setInteractive({
    //     hitArea: new Phaser.Geom.Rectangle(0, 0, 80, 20),
    //     hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    //     useHandCursor: true,
    //   });

    //   settingsButton.on('pointerdown', () => {
    //     if (GameState.launchedScene) return;

    //     this.scene.pause(GameState.mainScene);

    //     this.scene.launch('UISettingsWindow');
    //     GameState.setLaunchedScene('UISettingsWindow');
    //   });

    //   const settingsButtonBg = this.add.graphics();

    //   EventBus.on('window-closed', () => {
    //     this.openedWindowId = null;
    //   });

    //   settingsButtonBg.fillStyle(0x135df4, 1);
    //   settingsButtonBg.fillRect(0, 0, 80, 20);
    //   const settingsButtonText = this.add
    //     .text(40, 10, 'Настройки', {
    //       fontSize: '16px',
    //       fontFamily: 'Arial',
    //       color: '#000000',
    //     })
    //     .setOrigin(0.5)
    //     .setResolution(2);
    //   settingsButton.add([settingsButtonBg, settingsButtonText]);

    //   bottomButtonContainer.add([menuButton, settingsButton]);
  }
}
