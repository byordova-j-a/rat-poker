import type { Level } from '~/game/scenes/Level';
import { NONE, DOWN, LEFT } from '~/game/constants';
import { TMouseStreak } from '~/game/types';

export function checkMouseQueue(this: Level) {
  if (this.openedDoorTickAmount) {
    this.openedDoorTickAmount--;
    if (!this.openedDoorTickAmount) {
      this.flowGrid[this.exitCoords.y][this.exitCoords.x] = NONE;
      if (this.doorTile) {
        if (this.doorTile.index !== -1) this.doorTile.index = -1;
      }
    }
  }
  if (this.openedDoorTickAmount) return;

  const firstItem = this.cellStateList[0];
  if (!firstItem) return;

  const checkedCells = this.cellStateList.slice(1, this.maxMouseQeueLength);

  const streakList: TMouseStreak[] = [];
  let currentStreak: TMouseStreak = { color: firstItem.color, amount: 1 };

  let totalAmount = 1;

  const result = checkedCells.some(cell => {
    if (!cell) {
      streakList.push(currentStreak);
      return true;
    }
    const { color } = cell;
    if (currentStreak.color === color) {
      currentStreak.amount++;
    } else {
      streakList.push(currentStreak);
      currentStreak = { color, amount: 1 };
    }
    totalAmount++;
    return false;
  });
  if (!result) {
    streakList.push(currentStreak);
  }

  if (streakList.length >= 1) {
    const { amount } = streakList[0];
    if (amount >= 3) {
      if (streakList.length === 1 && totalAmount < this.maxMouseQeueLength) return;
      this.flowGrid[this.exitCoords.y][this.exitCoords.x] = DOWN;
      this.openedDoorTickAmount = amount;
      return;
    }
    if (streakList.length > 1) {
      this.flowGrid[this.exitCoords.y][this.exitCoords.x] = LEFT;
      streakList.some(({ amount }, id) => {
        if (amount >= 3 || id === streakList.length - 1) return true;

        this.openedDoorTickAmount = this.openedDoorTickAmount + amount;
        return false;
      });
    }
  }
}
