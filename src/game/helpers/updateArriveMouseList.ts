import type { Level } from '~/game/scenes/Level';
import { compareTwoPositions } from '~/game/helpers/compareTwoPositions';

export function updateArriveMouseList(this: Level) {
  let isMouseEntered = false;

  this.arriveMouseList.forEach((mouse, idx) => {
    const { x, y } = mouse.gridPosition;

    const direction = this.flowGrid[y][x];
    const newX = x + direction.x;
    const newY = y + direction.y;

    const isMouseGoingToEnter = compareTwoPositions({ x: newX, y: newY }, this.entryCoords);

    if (
      (!idx && isMouseGoingToEnter && this.cellReservedState[this.entryCellId]) ||
      (idx && compareTwoPositions({ x: newX, y: newY }, this.arriveMouseList[idx - 1].gridPosition))
    ) {
      return;
    }

    this.updateMousePosition(mouse, newX, newY);
    if (!idx && isMouseGoingToEnter) {
      this.cellReservedState[this.entryCellId] = mouse.id;
      isMouseEntered = true;
    }
  });
  if (isMouseEntered) this.arriveMouseList.shift();
}
