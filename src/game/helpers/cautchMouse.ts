import type { Level } from '~/game/scenes/Level';

export function cautchMouse(this: Level) {
  const { cellId, cellCoords, previousCellCoords, nextCellCoords } =
    this.mouseTrapConfigList[this.activeTrapId];
  const { x, y } = cellCoords;

  const currentPinWheelId = this.pinWheelVanesIdList[this.activeTrapId];

  const pinwheelState = this.pinwheelVanesStateConfig[currentPinWheelId];

  if (pinwheelState === undefined) return;
  const cautchedMouse = pinwheelState.mouse;

  let newMouse = this.cellStateList[cellId];

  const pos = this.pinwheelVanesMousePlace[currentPinWheelId];
  if (cautchedMouse) {
    if (newMouse) {
      newMouse.updateCautchState(true, { x: 0, y: 0 });
      pos?.addAt(newMouse, 0);

      pinwheelState.mouse = newMouse;
    } else {
      pinwheelState.mouse = null;
      const bubble = pos!.getByName('bubble');
      if (bubble instanceof Phaser.GameObjects.Image) {
        bubble.visible = false;
      }
    }

    pos?.remove(cautchedMouse);

    if (this.isCellStateListUpdated) {
      const previousPoint = this.layoutGrid[previousCellCoords.y][previousCellCoords.x];

      cautchedMouse.updateCautchState(false, previousPoint, this.layoutGrid[y][x]);
    } else {
      const nextPoint = this.layoutGrid[nextCellCoords.y][nextCellCoords.x];
      cautchedMouse.updateCautchState(false, this.layoutGrid[y][x], nextPoint);
    }

    if (this.isCellStateListUpdated) {
      cautchedMouse.setGridPosition(x, y);
      this.cellStateList[cellId] = cautchedMouse;
      this.cellReservedState[cellId] = cautchedMouse.id;
    } else {
      cautchedMouse.setGridPosition(nextCellCoords.x, nextCellCoords.y);
      this.cellStateList[cellId] = cautchedMouse;
      this.cellReservedState[cellId - 1] = cautchedMouse.id;
    }

    return;
  }
  if (newMouse) {
    newMouse.updateCautchState(true, { x: 0, y: 0 });
    pinwheelState.mouse = newMouse;
    pos?.addAt(newMouse, 0);
    const bubble = pos!.getByName('bubble');
    if (bubble instanceof Phaser.GameObjects.Image) {
      bubble.visible = true;
    }

    if (this.isCellStateListUpdated) {
      this.cellStateList[cellId] = null;
      this.cellReservedState[cellId] = null;
    } else {
      this.cellStateList[cellId] = null;
      this.cellReservedState[cellId - 1] = null;
    }
  }
}
