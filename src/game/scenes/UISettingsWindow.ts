import { Scene } from 'phaser';
import { UIButton } from '~/game/scenes/UIButton';
import { UILabeledSlider } from '~/game/scenes/UILabeledSlider';
import { UIKeyBinder } from '~/game/scenes/UIKeyBinder';
import { EventBus } from '~/game/EventBus';
import { EActionType, EControls, gameControls } from '~/game/scenes/Entities';
import { GameState } from '~/game/GameState';
import { HEADER_HEIGHT } from '~/game/constants';

export class UISettingsWindow extends Scene {
  updatedControlKeyId: EControls | null = null;
  keyBinderConfig: { [key in EControls]?: UIKeyBinder } = {};
  constructor() {
    super('UISettingsWindow');
  }
  create() {
    const { width, height } = this.scale;
    const windowWidth = 690;
    const windowHeight = 390;

    const windowContainer = this.add.container(
      width / 2 - windowWidth / 2,
      HEADER_HEIGHT + (height - HEADER_HEIGHT) / 2 - windowHeight / 2
    );

    const windowBg = this.add.graphics();
    windowBg.fillStyle(0xe0eaff, 1);
    windowBg.fillRect(0, 0, windowWidth, windowHeight);

    const header = this.add
      .text(windowWidth / 2, 20, 'Настройки', {
        fontSize: '30px',
        fontFamily: 'Arial',
        color: '#000000',
      })
      .setResolution(2)
      .setOrigin(0.5, 0);

    const settingsContainer = this.add.container(20, 72);

    const musicSettingContainer = new UILabeledSlider({
      scene: this,
      x: 0,
      y: 0,
      label: 'Громкость музыки:',
      sliderWidth: 165,
      startSliderValue: 0,
    });
    musicSettingContainer.on('volum-updated', (volume: number) => {
      console.log(volume);
    });

    const soundSettingContainer = new UILabeledSlider({
      scene: this,
      x: 335,
      y: 0,
      label: 'Громкость звуков:',
      sliderWidth: 165,
      startSliderValue: 0,
    });
    soundSettingContainer.on('volum-updated', (volume: number) => {
      console.log(volume);
    });

    const leftRotateSettingContainer1 = new UIKeyBinder({
      scene: this,
      x: 0,
      y: 60,
      label: 'Поворот влево(1):',
      controlKeyLabel: gameControls.keyBinds[EControls.LEFT1].label,
      controlKeyId: EControls.LEFT1,
    });
    this.keyBinderConfig[EControls.LEFT1] = leftRotateSettingContainer1;

    const leftRotateSettingContainer2 = new UIKeyBinder({
      scene: this,
      x: 335,
      y: 60,
      label: 'Поворот влево(2):',
      controlKeyLabel: gameControls.keyBinds[EControls.LEFT2].label,
      controlKeyId: EControls.LEFT2,
    });
    this.keyBinderConfig[EControls.LEFT2] = leftRotateSettingContainer2;

    const rightRotateSettingContainer1 = new UIKeyBinder({
      scene: this,
      x: 0,
      y: 120,
      label: 'Поворот вправо(1): ',
      controlKeyLabel: gameControls.keyBinds[EControls.RIGHT1].label,
      controlKeyId: EControls.RIGHT1,
    });
    this.keyBinderConfig[EControls.RIGHT1] = rightRotateSettingContainer1;

    const rightRotateSettingContainer2 = new UIKeyBinder({
      scene: this,
      x: 335,
      y: 120,
      label: 'Поворот вправо(2): ',
      controlKeyLabel: gameControls.keyBinds[EControls.RIGHT2].label,
      controlKeyId: EControls.RIGHT2,
    });
    this.keyBinderConfig[EControls.RIGHT2] = rightRotateSettingContainer2;

    const cautchSettingContainer = new UIKeyBinder({
      scene: this,
      x: 0,
      y: 180,
      label: 'Схватить/отпустить: ',
      controlKeyLabel: gameControls.keyBinds[EControls.CAUTCH].label,
      controlKeyId: EControls.CAUTCH,
    });
    this.keyBinderConfig[EControls.CAUTCH] = cautchSettingContainer;

    const changeTrapSettingContainer = new UIKeyBinder({
      scene: this,
      x: 335,
      y: 180,
      label: 'Переключить ловушку: ',
      controlKeyLabel: gameControls.keyBinds[EControls.CHANGE_TRAP].label,
      controlKeyId: EControls.CHANGE_TRAP,
    });
    this.keyBinderConfig[EControls.CHANGE_TRAP] = changeTrapSettingContainer;

    EventBus.on('control-key:rebinding', ({ id }: { id: EControls | null }) => {
      if (!this.updatedControlKeyId && !id) return;

      if (this.updatedControlKeyId) {
        this.keyBinderConfig[this.updatedControlKeyId]?.removeUpdatingState();
      }
      this.updatedControlKeyId = id;
      if (this.updatedControlKeyId) {
        this.keyBinderConfig[this.updatedControlKeyId]?.setUpdatingState();
      }
    });

    this.input.on('pointerdown', () => {
      if (this.updatedControlKeyId === null) return;

      this.keyBinderConfig[this.updatedControlKeyId]?.removeUpdatingState();
      this.updatedControlKeyId = null;
    });

    const exitBtn = new UIButton({
      scene: this,
      x: 20,
      y: 326,
      width: 315,
      label: 'Назад',
      pointerdownHandler: () => {
        this.scene.stop('UISettingsWindow');
        GameState.setLaunchedScene(null);

        this.scene.resume(GameState.mainScene);
      },
    });

    settingsContainer.add([
      musicSettingContainer,
      soundSettingContainer,
      leftRotateSettingContainer1,
      leftRotateSettingContainer2,
      rightRotateSettingContainer1,
      rightRotateSettingContainer2,
      cautchSettingContainer,
      changeTrapSettingContainer,
    ]);
    windowContainer.add([windowBg, header, settingsContainer, exitBtn]);
  }
}
