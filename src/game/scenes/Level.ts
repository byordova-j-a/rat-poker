import { Scene } from 'phaser';
import { Mouse, gameControls, EActionType } from '~/game/scenes/Entities';
import {
  EMouseColor,
  ERotateDirection,
  TLocation,
  TPinwheelRotateMaxAmount,
  TPinwheelVanesMousePlace,
  TPinwheelVanesStateConfig,
  TPinwheelVanesConfig,
  TMouseProbability,
} from '../types';

import { GameState } from '~/game/GameState';
import { HEADER_HEIGHT, VIEWPORT_MARGIN, VIEPORT_SIZE } from '../constants';
import { setLevelParams } from '~/game/helpers/setLevelParams';
import { compareTwoPositions } from '~/game/helpers/compareTwoPositions';
import { updateLeaveMouseList } from '~/game/helpers/updateLeaveMouseList';
import { checkMouseQueue } from '~/game/helpers/checkMouseQueue';
import { updateArriveMouseList } from '~/game/helpers/updateArriveMouseList';
import { getMouseColor } from '~/game/helpers/getMouseColor';
import { addMouse } from '~/game/helpers/addMouse';
import { switchMouseTrap } from '~/game/helpers/switchMouseTrap';
import { pinWheelRotate } from '~/game/helpers/pinWheelRotate';
import { cautchMouse } from '~/game/helpers/cautchMouse';
import { onTick } from '~/game/helpers/onTick';
import { updateMousePosition } from '~/game/helpers/updateMousePosition';
import { bindKeys } from '~/game/helpers/bindKeys';
import { updateCellStateList } from '~/game/helpers/updateCellStateList';

export class Level extends Scene {
  gameTick: number = 500;

  mouseMapList = new Map<number, Mouse>();

  arriveMouseList: Mouse[] = [];
  leaveMouseList: Mouse[] = [];

  allMouseAmount: number = 0;
  necessaryMouseAmount: number = 20;

  maxArriveMouseListLength: number = 4;
  maxMouseQeueLength: number = 4;

  layoutGrid: TLocation[][] = [];
  flowGrid: TLocation[][] = [];

  levelGrid: number[][] = [];
  specialElementGrid: number[][] = [];

  map: Phaser.Tilemaps.Tilemap | null = null;

  cellStateList: (null | Mouse)[] = [];
  cellReservedState: (null | number)[] = [];

  isCellStateListUpdated: boolean = false;

  mouseTrapConfigList: {
    cellId: number;
    cellCoords: TLocation;
    previousCellCoords: TLocation;
    nextCellCoords: TLocation;
  }[] = [];

  activeTrapId: number = 0;
  entryCellId: number = 0;

  openedDoorTickAmount: number = 0;
  isDespawnDoorOpened: boolean = false;

  spawnCoords: TLocation = { x: 0, y: 0 };

  despawnCoords: TLocation = { x: 0, y: 0 };
  preDespawnCoords: TLocation = { x: 0, y: 0 };

  spawnPoint: TLocation = { x: 0, y: 0 };

  entryCoords: TLocation = { x: 0, y: 0 };
  exitCoords: TLocation = { x: 0, y: 0 };

  pinwheelCoords: TLocation = { x: 0, y: 0 };
  counterCoords: TLocation = { x: 0, y: 0 };

  mouseProbabilityConf: TMouseProbability<EMouseColor> = [];

  containerPinwheel: Phaser.GameObjects.Container | null = null;
  containerCounter: Phaser.GameObjects.Container | null = null;

  pinwheelVanesStateConfig: TPinwheelVanesStateConfig = {};

  pinwheelVanesConfigList: TPinwheelVanesConfig[] = [];
  pinwheelRotateMaxAmount: TPinwheelRotateMaxAmount = {
    [ERotateDirection.LEFT]: -1,
    [ERotateDirection.RIGHT]: -1,
  };
  pinwheelRotateAngel: number = 0;

  pinwheelVanesMousePlace: TPinwheelVanesMousePlace = {
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
  };

  pinWheelVanesIdList: number[] = [1, 2, 3, 4];

  activeTrapMarker: Phaser.GameObjects.Arc | null = null;

  globalTicker: Phaser.Tweens.Tween | null = null;

  createdCombinationId: number = 0;

  doorTile: Phaser.Tilemaps.Tile | null = null;
  spawnDoorSprite: Phaser.GameObjects.Sprite | null = null;
  despawnDoorSprite: Phaser.GameObjects.Sprite | null = null;
  setLevelParams: (levelId: number) => void = setLevelParams;
  updateLeaveMouseList: () => void = updateLeaveMouseList;
  checkMouseQueue: () => void = checkMouseQueue;
  updateArriveMouseList: () => void = updateArriveMouseList;
  getMouseColor: () => EMouseColor = getMouseColor;
  addMouse: () => void = addMouse;
  switchMouseTrap: () => void = switchMouseTrap;
  pinWheelRotate: (direction: ERotateDirection) => void = pinWheelRotate;
  cautchMouse: () => void = cautchMouse;
  onTick: () => void = onTick;
  updateMousePosition: (mouse: Mouse, newX: number, newY: number) => void = updateMousePosition;
  updateCellStateList: () => void = updateCellStateList;
  bindKeys: () => void = bindKeys;

  constructor() {
    super('Level');
  }

  create() {
    const { width, height } = this.scale;
    const levelId = GameState.currentLevel;
    if (!levelId) return;
    const size = height - HEADER_HEIGHT - 2 * VIEWPORT_MARGIN;
    this.cameras.main.setViewport(
      VIEWPORT_MARGIN,
      HEADER_HEIGHT + VIEWPORT_MARGIN,
      VIEPORT_SIZE,
      VIEPORT_SIZE
    );
    this.add
      .image(VIEPORT_SIZE / 2, VIEPORT_SIZE / 2, 'bg1')
      .setDisplaySize(VIEPORT_SIZE, VIEPORT_SIZE);
    this.cameras.main.setViewport(
      VIEWPORT_MARGIN,
      HEADER_HEIGHT + VIEWPORT_MARGIN,
      VIEPORT_SIZE,
      VIEPORT_SIZE
    );
    GameState.setMainScene('Level');

    gameControls.initScene(this);

    this.setLevelParams(levelId);

    this.tweens.addCounter({
      duration: this.gameTick * 5,
      repeat: 0,
      onComplete: () => {
        this.spawnDoorSprite?.play('open-door');

        this.tweens.addCounter({
          duration: this.gameTick * 6,
          repeat: -1,
          onRepeat: () => {
            this.spawnDoorSprite?.play('open-door');
          },
        });
      },
    });

    this.tweens.addCounter({
      duration: this.gameTick * 7,
      repeat: 0,
      onComplete: () => {
        this.spawnDoorSprite?.play('close-door');

        this.tweens.addCounter({
          duration: this.gameTick * 6,
          repeat: -1,
          onRepeat: () => {
            this.spawnDoorSprite?.play('close-door');
          },
        });
      },
    });

    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: this.gameTick * 6,
      repeat: -1,
      onRepeat: () => {
        this.addMouse();
      },
    });

    this.globalTicker = this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: this.gameTick,
      repeat: -1,
      onRepeat: () => {
        this.onTick();
        this.events.emit('GAME_TICK');
        this.isCellStateListUpdated = false;
        if (this.createdCombinationId) {
          this.registry.set('createdCombination', this.createdCombinationId);
          this.createdCombinationId = 0;
        }
      },
    });

    this.tweens.addCounter({
      duration: this.gameTick / 2,
      repeat: 0,
      onComplete: () => {
        this.updateCellStateList();

        this.tweens.addCounter({
          duration: this.gameTick,
          repeat: -1,
          onRepeat: () => {
            this.updateCellStateList();
          },
        });
      },
    });

    this.bindKeys();
  }
}
