import Phaser from 'phaser';

import { BUTTON_PADDING, BUTTON_DEFAULT_FONT_SIZE } from '~/game/constants';

export class UIButton extends Phaser.GameObjects.Container {
  labelTextElement: Phaser.GameObjects.Text;
  bg: Phaser.GameObjects.Graphics;
  isClickStopPropagation: boolean;
  disabled: boolean;

  constructor(params: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    label: string;
    width?: number;
    fontSize?: number;
    isClickStopPropagation?: boolean;
    disabled?: boolean;

    pointerdownHandler: () => void;
  }) {
    const {
      scene,
      x,
      y,
      label,
      width,
      pointerdownHandler,
      fontSize,
      isClickStopPropagation,
      disabled,
    } = params;
    super(scene, x, y);
    this.disabled = !!disabled;

    this.isClickStopPropagation = !!isClickStopPropagation;

    const textPosition = width ? width / 2 : BUTTON_PADDING;
    const origin = width ? { x: 0.5, y: 0 } : { x: 0, y: 0 };

    this.labelTextElement = scene.add
      .text(textPosition, BUTTON_PADDING, label, {
        fontSize: `${fontSize || BUTTON_DEFAULT_FONT_SIZE}px`,
        fontFamily: 'Arial',
        color: '#ffffff',
      })
      .setResolution(2)
      .setOrigin(origin.x, origin.y);

    const buttonWidth = width || this.labelTextElement.width + 2 * BUTTON_PADDING;
    const buttonHeight = this.labelTextElement.height + 2 * BUTTON_PADDING;
    console.log(buttonHeight, buttonWidth);
    const strokeWidth = 2;
    const halfStroke = strokeWidth / 2;

    this.bg = scene.add.graphics();
    this.bg.fillStyle(this.disabled ? 0x666666 : 0x533a26, 1);
    this.bg.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 5);
    this.bg.lineStyle(strokeWidth, 0x322012, 1);
    this.bg.strokeRoundedRect(
      halfStroke,
      halfStroke,
      buttonWidth - strokeWidth,
      buttonHeight - 2,
      strokeWidth
    );

    this.add([this.bg, this.labelTextElement]);
    // scene.add.existing(this);

    if (this.disabled) return;

    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(0, 0, buttonWidth, buttonHeight),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true,
    });

    // scene.input.enableDebug(this);

    this.on(
      'pointerdown',
      (
        _pointer: Phaser.Input.Pointer,
        _x: number,
        _y: number,
        event: Phaser.Types.Input.EventData
      ) => {
        if (this.isClickStopPropagation) {
          event.stopPropagation();
        }
        pointerdownHandler();
      }
    );

    this.on('pointerover', () => {
      if (this.bg) {
        this.bg.setAlpha(0.8);
      }
    });
    this.on('pointerout', () => {
      if (this.bg) {
        this.bg.setAlpha(1);
      }
    });
  }

  updateLabel(newLabel: string) {
    this.labelTextElement.setText(newLabel);
  }
}
