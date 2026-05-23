import type { Level } from '~/game/scenes/Level';
import { Mouse } from '~/game/scenes/Entities';

export function updateMousePosition(this: Level, mouse: Mouse, newX: number, newY: number) {
  mouse.setNextTarget(this.layoutGrid[newY][newX].x, this.layoutGrid[newY][newX].y);
  mouse.setGridPosition(newX, newY);
}
