import Phaser from 'phaser';

import { UIButton } from '~/game/scenes/UIButton';
import { EventBus } from '~/game/EventBus';
import { gameControls, EControls } from '~/game/scenes/Entities';

export class UIKeyBinder extends Phaser.GameObjects.Container {
  controlKeyId: EControls;
  controlKeyLabel: string;
  button: UIButton;
  isUpdating: boolean;
  errorMessageElement: Phaser.GameObjects.Text;
  errorMessage: string;

  constructor(params: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    label: string;
    controlKeyLabel: string;
    controlKeyId: EControls;
  }) {
    const { scene, x, y, label, controlKeyLabel, controlKeyId } = params;
    super(scene, x, y);
    this.controlKeyId = controlKeyId;
    this.errorMessage = '';
    this.isUpdating = false;
    this.controlKeyLabel = controlKeyLabel;

    const labelElement = scene.add
      .text(0, 6, label, {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#000000',
      })
      .setOrigin(0)
      .setResolution(2);

    this.errorMessageElement = scene.add
      .text(0, 22, this.errorMessage, {
        fontSize: '10px',
        fontFamily: 'Arial',
        color: '#ff0000',
      })
      .setOrigin(0)
      .setResolution(2);

    this.button = new UIButton({
      scene,
      x: 185,
      y: 0,
      label: this.controlKeyLabel,
      fontSize: 14,
      isClickStopPropagation: true,
      width: 130,

      pointerdownHandler: () => {
        if (!this.isUpdating) {
          EventBus.emit('control-key:rebinding', { id: this.controlKeyId });
        } else {
          EventBus.emit('control-key:rebinding', { id: null });
        }
      },
    });

    scene.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (!this.isUpdating) return;
      event.preventDefault();

      const result = gameControls.updateKey({
        keyType: this.controlKeyId,
        keyCode: event.keyCode,
        keyLabel: event.code,
      });

      if (result.success) {
        this.controlKeyLabel = event.code;
        EventBus.emit('control-key:rebinding', { id: null });
      } else {
        this.setErrorMessage(result.errorMessage);
      }
    });

    this.add([labelElement, this.button, this.errorMessageElement]);
  }

  setErrorMessage(text: string) {
    this.errorMessage = text;
    this.errorMessageElement.setText(this.errorMessage);
  }

  setUpdatingState() {
    this.isUpdating = true;
    this.button.updateLabel('...');
  }
  removeUpdatingState() {
    this.isUpdating = false;
    this.button.updateLabel(this.controlKeyLabel);
    if (this.errorMessage) this.setErrorMessage('');
  }
}
