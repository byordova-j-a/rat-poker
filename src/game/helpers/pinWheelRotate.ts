import type { Level } from '~/game/scenes/Level';
import { ERotateDirection } from '~/game/types';

export function pinWheelRotate(this: Level, direction: ERotateDirection) {
  if (!this.pinwheelRotateMaxAmount[direction]) return;

  let angleSign;
  let movedElement;
  if (direction === ERotateDirection.LEFT) {
    this.pinwheelRotateAngel = this.pinwheelRotateAngel - 90;
    angleSign = '-';
    movedElement = this.pinWheelVanesIdList.shift();
    if (movedElement) {
      this.pinWheelVanesIdList.push(movedElement);
    }
  } else {
    this.pinwheelRotateAngel = this.pinwheelRotateAngel + 90;
    angleSign = '+';
    movedElement = this.pinWheelVanesIdList.pop();

    if (movedElement) {
      this.pinWheelVanesIdList.unshift(movedElement);
    }
  }
  this.tweens.add({
    targets: this.containerPinwheel,
    angle: this.pinwheelRotateAngel,
    duration: this.gameTick / 4,
    repeat: 0,
  });

  Object.values(this.pinwheelVanesMousePlace).forEach(item => {
    if (!item) return;
    this.tweens.add({
      targets: item,
      angle: -this.pinwheelRotateAngel,
      duration: this.gameTick / 4,
      repeat: 0,
    });
  });

  if (this.pinwheelRotateMaxAmount[direction] < 0) return;

  Object.values(ERotateDirection).forEach(item => {
    if (item === direction) this.pinwheelRotateMaxAmount[item]--;
    else this.pinwheelRotateMaxAmount[item]++;
  });
}
