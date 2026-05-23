import type { Level } from '~/game/scenes/Level';
import { Mouse } from '~/game/scenes/Entities';

export function addMouse(this: Level) {
  if (this.arriveMouseList.length >= this.maxArriveMouseListLength) return;

  const newMouse = new Mouse(this, this.spawnPoint.x, this.spawnPoint.y, {
    color: this.getMouseColor(),
    id: ++this.allMouseAmount,
    gridPosition: { ...this.spawnCoords },
  });

  this.arriveMouseList.push(newMouse);
  this.mouseMapList.set(this.allMouseAmount, newMouse);
  // if (this.spawnDoorSprite) this.spawnDoorSprite.play('door-open');
}
