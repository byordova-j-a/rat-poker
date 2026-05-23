import type { Mouse } from '~/game/scenes/Entities';
export type TPosition = Record<'x' | 'y', number>;
export type TLocation = Record<'x' | 'y', number>;

export enum EMouseColor {
  RED = 'red',
  YELLOW = 'yellow',
  ORANGE = 'orange',
  GREEN = 'green',
  DARK_BLUE = 'dark-blue',
  PINK = 'pink',
}

export enum ERotateDirection {
  LEFT = 'left',
  RIGHT = 'right',
}

export enum EMoveType {
  RUN = 'run',
  STAND = 'stand',
  JUMP = 'jump',
}

export enum EMouseType {
  EMPTY = 'empy',
  MINUS = 'minus',
  PLUS = 'plus',
}

export type TPinwheelVanesConfig = {
  id: number;
  angle: number;
  mousePlacePoint: TLocation;
};

export type TPinwheelVanesStateConfig = {
  [key in number]: { mouse: null | Mouse } | undefined;
};

export type TMouseTrapConfig = {
  cellId: number;
  cellCoords: TLocation;
  previousCellCoords: TLocation;
  nextCellCoords: TLocation;
};

export type TLevelConfigCoords = {
  [key in
    | 'spawnCoords'
    | 'despawnCoords'
    | 'preDespawnCoords'
    | 'exitCoords'
    | 'entryCoords'
    | 'pinwheelCoords'
    | 'counterCoords']: TLocation;
};

export type TLevelConfigNumberGrids = {
  [key in 'levelGrid' | 'specialElementGrid']: number[][];
};
export type TLevelConfigLocationGrids = {
  [key in 'flowGrid']: TLocation[][];
};
export type TPinwheelRotateMaxAmount = { [key in ERotateDirection]: number };

export type TPinwheelVanesMousePlace = {
  [key in number]: undefined | Phaser.GameObjects.Container;
};
export type TMouseProbability<T extends string> = { key: T; weight: number }[];
export type TLevelConfig = {
  startPoint: TLocation;
  maxArriveMouseListLength: number;
  mouseColorList: EMouseColor[];
  entryCellId: number;
  necessaryMouseAmount: number;
  maxMouseQeueLength: number;
  cellAmount: number;
  pinwheelVanesConfigList: TPinwheelVanesConfig[];
  pinwheelRotateMaxAmount: TPinwheelRotateMaxAmount;
  pinwheelVanesStateConfig: TPinwheelVanesStateConfig;
  mouseTrapConfigList: TMouseTrapConfig[];
  gameTick: number;
} & TLevelConfigNumberGrids &
  TLevelConfigLocationGrids &
  TLevelConfigCoords;

export type TMouseStreak = {
  color: EMouseColor;
  amount: number;
};
