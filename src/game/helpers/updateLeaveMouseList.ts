import type { Level } from '~/game/scenes/Level';
import { compareTwoPositions } from '~/game/helpers/compareTwoPositions';

export function updateLeaveMouseList(this: Level) {
  let isMouseDeleted = false;
  let hasMouseOnPreDespawnCoords = false;

  this.leaveMouseList.forEach(mouse => {
    const { x, y } = mouse.gridPosition;
    if (
      !hasMouseOnPreDespawnCoords &&
      compareTwoPositions(mouse.gridPosition, this.preDespawnCoords)
    ) {
      if (!this.isDespawnDoorOpened) {
        this.isDespawnDoorOpened = true;
        this.despawnDoorSprite?.play('open-door');
      }
      hasMouseOnPreDespawnCoords = true;
    }

    if (compareTwoPositions(mouse.gridPosition, this.despawnCoords)) {
      isMouseDeleted = true;
      return;
    }

    const direction = this.flowGrid[y][x];
    const newX = x + direction.x;
    const newY = y + direction.y;

    this.updateMousePosition(mouse, newX, newY);
  });

  if (!hasMouseOnPreDespawnCoords && this.isDespawnDoorOpened) {
    this.isDespawnDoorOpened = false;
    this.despawnDoorSprite?.play('close-door');
  }

  if (isMouseDeleted) {
    const mouse = this.leaveMouseList.shift();
    if (!mouse) return;
    this.mouseMapList.delete(mouse.id);
    mouse.destroy();

    if (this.necessaryMouseAmount) {
      this.necessaryMouseAmount--;
      (this.containerCounter?.getByName('ratLabel') as Phaser.GameObjects.Text).setText(
        `${this.necessaryMouseAmount}`
      );
    }
  }
}
