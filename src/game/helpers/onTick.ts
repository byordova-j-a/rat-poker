import type { Level } from '~/game/scenes/Level';
import { DOWN, NONE } from '~/game/constants';

export function onTick(this: Level) {
  this.cellReservedState = this.cellReservedState.map(() => null);

  if (
    this.doorTile &&
    this.flowGrid[this.exitCoords.y][this.exitCoords.x] === DOWN &&
    this.doorTile.index === -1
  ) {
    this.doorTile.index = 11;
  }

  this.cellStateList.forEach((mouse, idx) => {
    if (!mouse) return;

    const { x, y } = mouse.gridPosition;
    const direction = this.flowGrid[y][x];

    const newX = x + direction.x;
    const newY = y + direction.y;

    const mouseNewIdx = idx ? idx - 1 : this.cellReservedState.length - 1;

    switch (this.flowGrid[y][x]) {
      case NONE: {
        this.cellReservedState[idx] = mouse.id;
        break;
      }

      case DOWN: {
        if (!idx) {
          this.leaveMouseList.push(mouse);
          break;
        }
      }
      default: {
        if (!idx || !this.cellReservedState[mouseNewIdx]) {
          this.updateMousePosition(mouse, newX, newY);
          this.cellReservedState[mouseNewIdx] = mouse.id;
          return;
        }
        this.cellReservedState[idx] = mouse.id;
      }
    }
  });

  this.updateLeaveMouseList();
  this.updateArriveMouseList();
}
