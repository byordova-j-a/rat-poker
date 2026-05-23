import type { Level } from '~/game/scenes/Level';

export function updateCellStateList(this: Level) {
  this.cellStateList = this.cellReservedState.map(state => {
    if (state === null) return state;
    return this.mouseMapList.get(state) || null;
  });
  this.isCellStateListUpdated = true;
  this.checkMouseQueue();
}
