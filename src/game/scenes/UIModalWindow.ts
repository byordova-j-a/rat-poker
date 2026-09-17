import { Scene } from 'phaser';
import { EventBus } from '~/game/EventBus';
import { UIButton } from '~/game/scenes/UIButton';
import { GameState } from '~/game/GameState';
import { HEADER_HEIGHT } from '~/game/constants';
export class UIModalWindow extends Scene {
  constructor() {
    super('UIModalWindow');
  }

  create() {
    const { width, height } = this.scale;
    const windowWidth = 280;
    const windowHeight = 290;

    const windowContainer = this.add.container(
      width / 2 - windowWidth / 2,
      HEADER_HEIGHT + (height - HEADER_HEIGHT) / 2 - windowHeight / 2
    );

    const windowBg = this.add.graphics();
    windowBg.fillStyle(0xffffff, 1);
    windowBg.fillRect(0, 0, windowWidth, windowHeight);

    const header = this.add
      .text(windowWidth / 2, 20, 'Меню', {
        fontSize: '30px',
        fontFamily: 'Arial',
        color: '#000000',
      })
      .setResolution(2)
      .setOrigin(0.5, 0);

    const exitBtn = this.add
      .text(windowWidth - 30, 0, 'X', {
        fontSize: '30px',
        fontFamily: 'Arial',
        color: '#000000',
      })
      .setResolution(2)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true });

    exitBtn.on('pointerdown', () => {
      this.scene.stop('UIModalWindow');
      GameState.setLaunchedScene(null);
      this.scene.resume(GameState.mainScene);
    });

    const buttonContainer = this.add.container(20, 80);

    const reloadLevelBtn = new UIButton({
      scene: this,
      x: 0,
      y: 0,
      label: 'Перезапустить уровень',
      width: windowWidth - 40,
      disabled: GameState.mainScene !== 'Level',

      pointerdownHandler: () => {
        if (GameState.mainScene !== 'Level') return;
        this.scene.stop('UIModalWindow');
        GameState.setLaunchedScene(null);

        this.scene.start('Level');
      },
    });

    const returnToLevelsMapBtn = new UIButton({
      scene: this,
      x: 0,
      y: 60,
      label: 'К выбору уровня',
      width: windowWidth - 40,
      disabled: GameState.mainScene === 'LevelsMap',

      pointerdownHandler: () => {
        if (GameState.mainScene === 'LevelsMap') return;

        this.scene.stop(GameState.mainScene);
        GameState.setLaunchedScene(null);
        GameState.currentLevel = null;
        this.registry.set('currentLevel', null);
        this.registry.set('showedLevel', null);

        this.scene.start('LevelsMap');
        GameState.setMainScene('LevelsMap');
        this.registry.set('scene', { type: 'levelsMap', value: null });
      },
    });

    const returnToMainMenuBtn = new UIButton({
      scene: this,
      x: 0,
      y: 120,
      label: 'В главное меню',
      width: windowWidth - 40,
      disabled: GameState.mainScene === 'MainMenu',
      pointerdownHandler: () => {
        if (GameState.mainScene === 'MainMenu') return;
        this.scene.stop(GameState.mainScene);
        GameState.setLaunchedScene(null);
        GameState.currentLevel = null;
        this.registry.set('currentLevel', null);
        this.registry.set('showedLevel', null);
        this.scene.start('MainMenu');
        GameState.setMainScene('MainMenu');
        this.registry.set('scene', { type: 'mainMenu', value: null });
      },
    });

    buttonContainer.add([reloadLevelBtn, returnToLevelsMapBtn, returnToMainMenuBtn]);
    windowContainer.add([windowBg, header, buttonContainer, exitBtn]);
  }
}
