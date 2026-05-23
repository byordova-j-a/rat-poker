import type { Level } from '~/game/scenes/Level';

export function switchMouseTrap(this: Level) {
  if (this.mouseTrapConfigList.length <= 1) return;

  if (this.activeTrapId === this.mouseTrapConfigList.length - 1) {
    this.activeTrapId = 0;
  } else {
    this.activeTrapId++;
  }
  const activeTrapCoords = this.mouseTrapConfigList[this.activeTrapId].cellCoords;
  const activeTrapPoint = this.layoutGrid[activeTrapCoords.y][activeTrapCoords.x];

  this.activeTrapMarker?.setPosition(activeTrapPoint.x, activeTrapPoint.y);
}
