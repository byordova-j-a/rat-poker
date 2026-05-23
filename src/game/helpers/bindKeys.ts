import type { Level } from '~/game/scenes/Level';
import { EActionType } from '~/game/scenes/Entities';
import { ERotateDirection } from '~/game/types';

export function bindKeys(this: Level) {
  Object.values(EActionType).forEach((actionType: EActionType) => {
    this.events.off(`input_${actionType}`);
  });

  this.events.on(`input_${EActionType.CAUTCH}`, () => {
    this.cautchMouse();
  });

  this.events.on(`input_${EActionType.LEFT}`, () => {
    this.pinWheelRotate(ERotateDirection.LEFT);
  });

  this.events.on(`input_${EActionType.RIGHT}`, () => {
    this.pinWheelRotate(ERotateDirection.RIGHT);
  });

  this.events.on(`input_${EActionType.CHANGE_TRAP}`, () => {
    this.switchMouseTrap();
  });
}
