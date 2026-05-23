import { Mouse } from '~/game/scenes/Entities';
import {
  EMouseType,
  EMouseColor,
  ERotateDirection,
  TLocation,
  TPinwheelVanesConfig,
  TPinwheelVanesStateConfig,
  TMouseTrapConfig,
  TLevelConfig,
} from '~/game/types';
import { NONE, RIGHT, LEFT, UP, DOWN } from '~/game/constants';

// export function setLevelParams(this: Level, levelConfig: TLevelConfig) {

export const LEVELS_CONFIG: { [key in number]: TLevelConfig } = {
  1: {
    startPoint: { x: 25, y: 70 },

    maxArriveMouseListLength: 2,
    mouseColorList: [EMouseColor.RED, EMouseColor.GREEN, EMouseColor.ORANGE, EMouseColor.YELLOW],
    entryCellId: 12,
    necessaryMouseAmount: 20,
    maxMouseQeueLength: 4,
    pinwheelVanesConfigList: [
      {
        id: 1,
        angle: 90,
        mousePlacePoint: { x: 0, y: -100 },
      },
      {
        id: 2,
        angle: 180,
        mousePlacePoint: { x: 100, y: 0 },
      },
      // { x: -5, y: 0, width: 10, height: 75 },
      // { x: 0, y: -5, width: -75, height: 10 },
    ],
    pinwheelRotateMaxAmount: {
      [ERotateDirection.LEFT]: 0,
      [ERotateDirection.RIGHT]: 1,
    },
    pinwheelVanesStateConfig: {
      1: { mouse: null },
      2: { mouse: null },
      // 2: undefined,
      3: undefined,
      4: undefined,
    },
    mouseTrapConfigList: [
      {
        cellCoords: { x: 4, y: 2 },
        cellId: 11,
        previousCellCoords: { x: 3, y: 2 },
        nextCellCoords: { x: 5, y: 2 },
      },
      {
        cellCoords: { x: 7, y: 5 },
        cellId: 5,
        previousCellCoords: { x: 7, y: 4 },
        nextCellCoords: { x: 7, y: 6 },
      },
    ],
    cellAmount: 18,
    gameTick: 500,

    levelGrid: [
      [13, 2, -1, -1, -1, -1, -1, -1],
      [-1, 5, 1, 2, -1, -1, -1, -1],
      [-1, -1, -1, 5, 3, 1, 1, -1],
      [-1, -1, 7, -1, -1, -1, -1, 7],
      [-1, -1, 7, -1, -1, -1, -1, 7],
      [-1, -1, 7, -1, -1, -1, -1, 3],
      [-1, -1, 4, 8, 9, 9, 9, 6],
      [14, -1, 1, 6, -1, -1, -1, -1],
      [13, 6, -1, -1, -1, -1, -1, -1],
    ],
    specialElementGrid: [
      [-1, 12, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, 12, -1, -1, -1, -1],
      [-1, -1, 10, -1, -1, -1, -1, 12],
      [-1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1],
      [-1, 10, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1],
    ],
    flowGrid: [
      [RIGHT, DOWN, NONE, NONE, NONE, NONE, NONE, NONE],
      [NONE, RIGHT, RIGHT, DOWN, NONE, NONE, NONE, NONE],
      [NONE, NONE, RIGHT, RIGHT, RIGHT, RIGHT, RIGHT, DOWN],
      [NONE, NONE, UP, NONE, NONE, NONE, NONE, DOWN],
      [NONE, NONE, UP, NONE, NONE, NONE, NONE, DOWN],
      [NONE, NONE, UP, NONE, NONE, NONE, NONE, DOWN],
      [NONE, NONE, UP, NONE, LEFT, LEFT, LEFT, LEFT],
      [LEFT, DOWN, LEFT, LEFT, LEFT, NONE, NONE, NONE],
      [LEFT, LEFT, NONE, NONE, NONE, NONE, NONE, NONE],
    ],

    spawnCoords: { x: 0, y: 0 },
    despawnCoords: { x: 0, y: 8 },
    preDespawnCoords: { x: 1, y: 8 },
    exitCoords: { x: 3, y: 6 },
    entryCoords: { x: 3, y: 2 },
    pinwheelCoords: { x: 4, y: 5 },
    counterCoords: { x: 0, y: 7 },
  },
};
