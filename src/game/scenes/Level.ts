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
import { NONE, RIGHT, LEFT, UP, DOWN } from '../constants';
import { GameState } from '~/game/GameState';
import { HEADER_HEIGHT, VIEWPORT_MARGIN } from '../constants';
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

  // initFields() {
  //   this.gameTick = 500;

  //   this.mouseMapList = new Map<number, Mouse>();

  //   this.arriveMouseList = [];
  //   this.leaveMouseList = [];

  //   this.allMouseAmount = 0;
  //   this.necessaryMouseAmount = 20;

  //   this.maxArriveMouseListLength = 4;
  //   this.maxMouseQeueLength = 4;

  //   this.layoutGrid = [];
  //   this.flowGrid = [];

  //   this.levelGrid = [];
  //   this.specialElementGrid = [];

  //   this.cellStateList = [];
  //   this.cellReservedState = [];

  //   this.isCellStateListUpdated = false;

  //   this.mouseTrapConfigList = [];

  //   this.map = null;

  //   this.activeTrapId = 0;
  //   this.entryCellId = 0;

  //   this.openedDoorTickAmount = 0;
  //   this.isDespawnDoorOpened = false;

  //   this.spawnCoords = { x: 0, y: 0 };

  //   this.despawnCoords = { x: 0, y: 0 };
  //   this.preDespawnCoords = { x: 0, y: 0 };

  //   this.spawnPoint = { x: 0, y: 0 };

  //   this.entryCoords = { x: 0, y: 0 };
  //   this.exitCoords = { x: 0, y: 0 };

  //   this.pinwheelCoords = { x: 0, y: 0 };
  //   this.counterCoords = { x: 0, y: 0 };

  //   this.mouseProbabilityConf = [];

  //   this.containerPinwheel = null;
  //   this.containerCounter = null;

  //   this.pinwheelVanesStateConfig = {};

  //   this.pinwheelVanesConfigList = [];
  //   this.pinwheelRotateMaxAmount = {
  //     [ERotateDirection.LEFT]: -1,
  //     [ERotateDirection.RIGHT]: -1,
  //   };
  //   this.pinwheelRotateAngel = 0;

  //   // this.doorLayer = null;
  //   // this.isExitDoorOpen = false;

  //   this.pinwheelVanesMousePlace = {
  //     1: undefined,
  //     2: undefined,
  //     3: undefined,
  //     4: undefined,
  //   };

  //   // pinWheelPaddingConfig: { [key in number]: TLocation } = {
  //   //   1: { x: 0, y: -100 },
  //   //   2: { x: 100, y: 0 },
  //   //   3: { x: 0, y: -100 },
  //   //   4: { x: 0, y: -100 },
  //   // };

  //   this.pinWheelVanesIdList = [1, 2, 3, 4];

  //   this.activeTrapMarker = null;

  //   this.globalTicker = null;

  //   this.doorTile = null;
  //   this.spawnDoorSprite = null;
  //   this.despawnDoorSprite = null;
  // }

  // setLevelParams() {
  //   const { width, height } = this.scale;
  //   this.add.image(width / 2, height / 2, 'bg1').setDisplaySize(width, height);

  //   const startLocation = { x: 25, y: 70 };
  //   this.maxArriveMouseListLength = 2;

  //   this.levelGrid = [
  //     [13, 2, -1, -1, -1, -1, -1, -1],
  //     [-1, 5, 1, 2, -1, -1, -1, -1],
  //     [-1, -1, -1, 5, 3, 1, 1, -1],
  //     [-1, -1, 7, -1, -1, -1, -1, 7],
  //     [-1, -1, 7, -1, -1, -1, -1, 7],
  //     [-1, -1, 7, -1, -1, -1, -1, 3],
  //     [-1, -1, 4, 8, 9, 9, 9, 6],
  //     [14, -1, 1, 6, -1, -1, -1, -1],
  //     [13, 6, -1, -1, -1, -1, -1, -1],
  //   ];

  //   this.specialElementGrid = [
  //     [-1, 12, -1, -1, -1, -1, -1, -1],
  //     [-1, -1, -1, 12, -1, -1, -1, -1],
  //     [-1, -1, 10, -1, -1, -1, -1, 12],
  //     [-1, -1, -1, -1, -1, -1, -1, -1],
  //     [-1, -1, -1, -1, -1, -1, -1, -1],
  //     [-1, -1, -1, -1, -1, -1, -1, -1],
  //     [-1, -1, -1, -1, -1, -1, -1, -1],
  //     [-1, 10, -1, -1, -1, -1, -1, -1],
  //     [-1, -1, -1, -1, -1, -1, -1, -1],
  //   ];

  //   this.spawnCoords = { x: 0, y: 0 };
  //   this.despawnCoords = { x: 0, y: 8 };
  //   this.preDespawnCoords = { x: 1, y: 8 };

  //   this.exitCoords = { x: 3, y: 6 };
  //   this.entryCoords = { x: 3, y: 2 };

  //   this.pinwheelCoords = { x: 4, y: 5 };
  //   this.counterCoords = { x: 0, y: 7 };

  //   this.map = this.make.tilemap({
  //     // data: this.levelGrid,
  //     tileWidth: 50,
  //     tileHeight: 50,
  //     width: 8,
  //     height: 9,
  //   });

  //   const tileSet = this.map.addTilesetImage('tileset', 'game-tiles');
  //   if (tileSet) {
  //     // const layer1 = this.map.createLayer(0, tileSet, startLocation.x - 25, startLocation.y - 25);
  //     const layer1 = this.map.createBlankLayer(
  //       'layer1',
  //       tileSet,
  //       startLocation.x - 25,
  //       startLocation.y - 25
  //     );

  //     const layer2 = this.map.createBlankLayer(
  //       'layer2',
  //       tileSet,
  //       startLocation.x - 25,
  //       startLocation.y - 25
  //     );
  //     // this.doorLayer = this.map.createBlankLayer(
  //     //   'doorLayer',
  //     //   tileSet,
  //     //   startLocation.x - 25,
  //     //   startLocation.y - 25
  //     // );
  //     // const layer1 = map.createBlankLayer('layer1', tileSet);
  //     layer1!.putTilesAt(this.levelGrid, 0, 0);
  //     layer2!.putTilesAt(this.specialElementGrid, 0, 0);

  //     this.doorTile =
  //       this.map
  //         ?.getLayer('layer2')
  //         ?.tilemapLayer?.getTileAt(this.exitCoords.x, this.exitCoords.y, true) || null;

  //     // const scale = 50 / 39;

  //     // Применяем масштаб к слою
  //     // layer!.setScale(scale);
  //   }

  //   // this.visualEffectGrid = [
  //   //   [null, DOWN, null, null, null, null, null, null, null, null],
  //   //   [null, RIGHT, RIGHT, RIGHT, DOWN, null, null, null, null, null],
  //   //   [null, null, null, RIGHT, RIGHT, RIGHT, RIGHT, RIGHT, DOWN, null],
  //   //   [null, null, null, UP, null, null, null, null, DOWN, null],
  //   //   [null, null, null, UP, null, null, null, null, DOWN, null],
  //   //   [null, null, null, UP, null, null, null, null, DOWN, null],
  //   //   [null, null, null, UP, LEFT, LEFT, LEFT, LEFT, LEFT, null],
  //   //   [null, null, null, null, null, null, null, null, null, null],
  //   // ];

  //   this.flowGrid = [
  //     [RIGHT, DOWN, NONE, NONE, NONE, NONE, NONE, NONE],
  //     [NONE, RIGHT, RIGHT, DOWN, NONE, NONE, NONE, NONE],
  //     [NONE, NONE, RIGHT, RIGHT, RIGHT, RIGHT, RIGHT, DOWN],
  //     [NONE, NONE, UP, NONE, NONE, NONE, NONE, DOWN],
  //     [NONE, NONE, UP, NONE, NONE, NONE, NONE, DOWN],
  //     [NONE, NONE, UP, NONE, NONE, NONE, NONE, DOWN],
  //     [NONE, NONE, UP, NONE, LEFT, LEFT, LEFT, LEFT],
  //     [LEFT, DOWN, LEFT, LEFT, LEFT, NONE, NONE, NONE],
  //     [LEFT, LEFT, NONE, NONE, NONE, NONE, NONE, NONE],
  //   ];

  //   this.cellStateList = Array.from({ length: 18 }, () => {
  //     return null;
  //   });

  //   this.cellReservedState = Array.from({ length: 18 }, () => null);

  //   this.mouseProbabilityConf = [
  //     EMouseColor.RED,
  //     EMouseColor.GREEN,
  //     EMouseColor.ORANGE,
  //     EMouseColor.YELLOW,
  //   ].map(item => ({
  //     key: item,
  //     weight: 10,
  //   }));

  //   // this.mouseTrapConfigList = [
  //   //   { x: 5, y: 2, id: 11, previousPosition: {x:0,y:0} },
  //   //   { x: 8, y: 5, id: 5, previousPosition: {x:0,y:0} },
  //   // ];

  //   this.entryCellId = 12;

  //   this.necessaryMouseAmount = 20;
  //   this.maxMouseQeueLength = 4;

  //   this.pinwheelVanesConfigList = [
  //     {
  //       id: 1,
  //       angle: 90,
  //       mousePlacePoint: { x: 0, y: -100 },
  //     },
  //     {
  //       id: 2,
  //       angle: 180,
  //       mousePlacePoint: { x: 100, y: 0 },
  //     },
  //     // { x: -5, y: 0, width: 10, height: 75 },
  //     // { x: 0, y: -5, width: -75, height: 10 },
  //   ];

  //   this.pinwheelRotateMaxAmount = {
  //     [ERotateDirection.LEFT]: 0,
  //     [ERotateDirection.RIGHT]: 1,
  //   };

  //   this.pinwheelVanesStateConfig = {
  //     1: { mouse: null },
  //     2: { mouse: null },
  //     // 2: undefined,
  //     3: undefined,
  //     4: undefined,
  //   };

  //   this.levelGrid.forEach((column, idy) => {
  //     const layoutGridColumn: TLocation[] = [];

  //     column.forEach((cellValue, idx) => {
  //       const position = { y: idy * 50 + startLocation.y, x: idx * 50 + startLocation.x };

  //       layoutGridColumn.push(position);

  //       let color = cellValue === 2 ? 0x0bbd7b : 0x167a4e;
  //       if (cellValue === 3) color = 0xffffff;
  //       if (cellValue === 4) color = 0x40d2ff;
  //       if (cellValue !== 1) {
  //         // this.add.rectangle(position.x, position.y, 50, 50, color);
  //         // const icon = this.add.image(position.x, position.y, 'game-tiles', 1);
  //         // Его тоже можно растянуть до 50px
  //         // icon.setDisplaySize(50, 50);
  //       }
  //     });
  //     this.layoutGrid.push(layoutGridColumn);
  //   });
  //   this.spawnPoint = this.layoutGrid[this.spawnCoords.y][this.spawnCoords.x];
  //   const despawnPoint = this.layoutGrid[this.despawnCoords.y][this.despawnCoords.x];

  //   this.spawnDoorSprite = this.add
  //     .sprite(this.spawnPoint.x, this.spawnPoint.y - 3, 'door', 0)
  //     .setDisplaySize(39, 32);
  //   // .setDepth(0);
  //   // this.spawnDoorSprite.play('door-open');

  //   this.despawnDoorSprite = this.add
  //     .sprite(despawnPoint.x, despawnPoint.y - 3, 'door', 0)
  //     .setDisplaySize(39, 32)
  //     .setDepth(10);
  //   this.mouseTrapConfigList = [
  //     {
  //       cellCoords: { x: 4, y: 2 },
  //       cellId: 11,
  //       previousCellCoords: { x: 3, y: 2 },
  //       nextCellCoords: { x: 5, y: 2 },
  //     },
  //     {
  //       cellCoords: { x: 7, y: 5 },
  //       cellId: 5,
  //       previousCellCoords: { x: 7, y: 4 },
  //       nextCellCoords: { x: 7, y: 6 },
  //     },
  //   ];

  //   const activeTrapPosition = this.mouseTrapConfigList[0].cellCoords;
  //   const activeTrapPoint = this.layoutGrid[activeTrapPosition.y][activeTrapPosition.x];
  //   this.activeTrapMarker = this.add.circle(activeTrapPoint.x, activeTrapPoint.y, 5, 0xff0000);

  //   const pinwheelsPoint = this.layoutGrid[this.pinwheelCoords.y][this.pinwheelCoords.x];

  //   const counterPoint = this.layoutGrid[this.counterCoords.y][this.counterCoords.x];

  //   this.containerPinwheel = this.add.container(pinwheelsPoint.x, pinwheelsPoint.y);

  //   this.containerCounter = this.add.container(counterPoint.x, counterPoint.y);

  //   let graphics = this.make.graphics();

  //   const innerRadius = 10;
  //   const outerRadius = 15;
  //   const startAngle = Phaser.Math.DegToRad(180); // Начало дуги
  //   const endAngle = Phaser.Math.DegToRad(240);

  //   graphics

  //     // .fillStyle(0x00ff00, 1)
  //     // // Параметры: x, y, radius
  //     // .fillCircle(10, 10, 10);
  //     .lineStyle(2, 0x000000, 1)
  //     .strokeCircle(21, 21, 19)
  //     .lineStyle(2, 0xffffff, 1)
  //     .strokeCircle(21, 21, 20)
  //     .fillStyle(0xffffff, 1)
  //     .beginPath()
  //     .arc(21, 21, outerRadius, startAngle, endAngle, false)
  //     .arc(21, 21, innerRadius, endAngle, startAngle, true)
  //     .closePath()
  //     .fillPath();

  //   graphics.generateTexture('bubble', 42, 42);
  //   // console.log(this.layoutGrid);
  //   // console.log(this.layoutGrid[0][6]);

  //   // const rect = this.add.graphics();
  //   // rect.fillStyle(0xff0000, 1);
  //   this.pinwheelVanesConfigList.forEach(({ angle, id, mousePlacePoint }) => {
  //     // rect.fillRect(coords.x, coords.y, width, height);
  //     const vane = this.add
  //       .image(0, 0, 'pinwheelVanes', 0)
  //       .setDisplaySize(70, 10)
  //       .setAngle(angle)
  //       .setOrigin(1, 0.5);

  //     const mouseContainer = this.add.container(mousePlacePoint.x, mousePlacePoint.y);

  //     mouseContainer.add(
  //       this.add.image(0, 0, 'bubble').setName('bubble').setVisible(false)
  //       // this.add
  //       //   .graphics()
  //       //   .setName('bubble')
  //       //   .lineStyle(2, 0x000000, 1)
  //       //   .strokeCircle(0, 0, 19)
  //       //   .lineStyle(2, 0xffffff, 1)
  //       //   .strokeCircle(0, 0, 20)
  //       //   .fillStyle(0xffffff, 1)
  //       //   .beginPath()
  //       //   .arc(0, 0, outerRadius, startAngle, endAngle, false)
  //       //   .arc(0, 0, innerRadius, endAngle, startAngle, true)
  //       //   .closePath()
  //       //   .fillPath()
  //       //   .setVisible(false)
  //     );

  //     this.containerPinwheel!.add([vane, mouseContainer]);
  //     this.pinwheelVanesMousePlace[id] = mouseContainer;
  //     this.tweens.chain({
  //       targets: mouseContainer,
  //       loop: -1,
  //       tweens: [
  //         { x: '-=1', duration: 100 },
  //         { x: '+=2', duration: 100 },
  //         { x: '-=1', duration: 100 },
  //         { y: '-=1', duration: 100 },
  //         { y: '+=2', duration: 100 },
  //         { y: '-=1', duration: 100 },
  //       ],
  //     });
  //   });

  //   this.add.image(pinwheelsPoint.x, pinwheelsPoint.y, 'pinwheelCenter').setDisplaySize(20, 20);

  //   // rect.fillStyle(0x00ff00, 1);
  //   // // Параметры: x, y, radius
  //   // rect.fillCircle(0, 0, 10);

  //   // const mouseContainer1 = this.add.container(0, -100);
  //   // const rect1 = this.add.graphics();
  //   // rect1.fillStyle(0x00ff00, 1);
  //   // rect1.fillCircle(0, 0, 10);
  //   // mouseContainer1.add(rect1);

  //   // this.containerPinwheel.add([rect]);

  //   // this.pinwheelVanesMousePlace = {
  //   //   1: mouseContainer1,
  //   //   2: undefined,
  //   //   3: undefined,
  //   //   4: undefined,
  //   // };

  //   const rect2 = this.add.rectangle(0, 0, 39, 28, 0xffffff);
  //   const label = this.add.text(0, 0, `${this.necessaryMouseAmount}`, {
  //     fontSize: '30px',
  //     color: '#000000',
  //     fontFamily: 'Arial',
  //   });

  //   label.setResolution(2);
  //   label.setOrigin(0.5);
  //   label.setName('ratLabel');
  //   this.containerCounter.add([rect2, label]);
  // }

  // updateMousePosition(mouse: Mouse, newX: number, newY: number) {
  //   mouse.setNextTarget(this.layoutGrid[newY][newX].x, this.layoutGrid[newY][newX].y);
  //   mouse.setGridPosition(newX, newY);
  // }

  // updateLeaveMouseList() {
  //   let isMouseDeleted = false;

  //   const result = this.leaveMouseList.some(mouse => {
  //     if (compareTwoPositions(mouse.gridPosition, this.preDespawnCoords)) {
  //       if (!this.isDespawnDoorOpened) {
  //         this.isDespawnDoorOpened = true;
  //         this.despawnDoorSprite?.play('open-door');
  //       }
  //       return true;
  //     }
  //     return false;
  //   });
  //   if (!result && this.isDespawnDoorOpened) {
  //     this.isDespawnDoorOpened = false;
  //     this.despawnDoorSprite?.play('close-door');
  //   }
  //   this.leaveMouseList.forEach(mouse => {
  //     const { x, y } = mouse.gridPosition;
  //     if (compareTwoPositions(mouse.gridPosition, this.despawnCoords)) {
  //       isMouseDeleted = true;
  //       return;
  //     }

  //     const direction = this.flowGrid[y][x];
  //     const newX = x + direction.x;
  //     const newY = y + direction.y;
  //     const a = this.flowGrid[y][x];

  //     // if (a) {
  //     //   const aDirection = a.x === 1 || a.y === 1 ? false : true;
  //     //   const moveType = a.y ? EMoveType.JUMP : EMoveType.RUN;
  //     //   mouse.syncVisuals({ moveType, isDirectedToLeft: aDirection });
  //     // }
  //     //

  //     this.updateMousePosition(mouse, newX, newY);
  //   });

  //   if (isMouseDeleted) {
  //     const mouse = this.leaveMouseList.shift();
  //     if (!mouse) return;
  //     this.mouseMapList.delete(mouse.id);
  //     mouse.destroy();
  //     if (this.necessaryMouseAmount) {
  //       this.necessaryMouseAmount--;
  //       (this.containerCounter?.getByName('ratLabel') as Phaser.GameObjects.Text).setText(
  //         `${this.necessaryMouseAmount}`
  //       );
  //     }
  //   }
  // }

  // checkMouseQueue() {
  //   if (this.openedDoorTickAmount) {
  //     this.openedDoorTickAmount--;
  //     if (!this.openedDoorTickAmount) {
  //       this.flowGrid[this.exitCoords.y][this.exitCoords.x] = NONE;
  //       if (this.doorTile) {
  //         if (this.doorTile.index !== -1) this.doorTile.index = -1;
  //       }
  //     }
  //   }
  //   if (this.openedDoorTickAmount) return;

  //   const firstItem = this.cellStateList[0];
  //   if (!firstItem) return;

  //   const specialPosition = this.cellStateList.slice(1, this.maxMouseQeueLength);

  //   const queueList: { color: string; amount: number }[] = [];
  //   let colorObj: { color: string; amount: number } = { color: firstItem.color, amount: 1 };
  //   let isStop: boolean = false;

  //   let totalAmount = 1;

  //   const result = specialPosition.some(position => {
  //     if (!position) {
  //       queueList.push(colorObj);
  //       return true;
  //     }
  //     const { color } = position;
  //     if (colorObj.color === color) {
  //       colorObj.amount++;
  //       totalAmount++;
  //     } else {
  //       queueList.push(colorObj);
  //       colorObj = { color, amount: 1 };
  //       totalAmount++;
  //     }
  //     return false;
  //   });
  //   if (!result) {
  //     queueList.push(colorObj);
  //   }

  //   if (queueList.length >= 1) {
  //     const { amount } = queueList[0];
  //     if (amount >= 3) {
  //       if (totalAmount === 3) return;
  //       this.flowGrid[this.exitCoords.y][this.exitCoords.x] = DOWN;
  //       this.openedDoorTickAmount = amount;
  //       return;
  //     }
  //     if (queueList.length > 1) {
  //       this.flowGrid[this.exitCoords.y][this.exitCoords.x] = LEFT;
  //       queueList.some(({ amount }, id) => {
  //         if (amount >= 3 || id === queueList.length - 1) return true;

  //         console.log('m,');
  //         this.openedDoorTickAmount = this.openedDoorTickAmount + amount;
  //         return false;
  //       });
  //     }
  //   }
  // }

  // updateArriveMouseList() {
  //   let isNewMouseAdded = false;
  //   this.arriveMouseList.forEach((mouse, idx) => {
  //     const { x, y } = mouse.gridPosition;

  //     const direction = this.flowGrid[y][x];
  //     const newX = x + direction.x;
  //     const newY = y + direction.y;

  //     const isMouseGoingToLeaveList = compareTwoPositions({ x: newX, y: newY }, this.entryCoords);

  //     if (
  //       (!idx && isMouseGoingToLeaveList && this.cellReservedState[this.entryCellId]) ||
  //       (idx &&
  //         compareTwoPositions({ x: newX, y: newY }, this.arriveMouseList[idx - 1].gridPosition))
  //     ) {
  //       return;
  //     }

  //     this.updateMousePosition(mouse, newX, newY);
  //     if (!idx && isMouseGoingToLeaveList) {
  //       this.cellReservedState[this.entryCellId] = mouse.id;
  //       isNewMouseAdded = true;
  //     }
  //   });
  //   if (isNewMouseAdded) this.arriveMouseList.shift();
  //   // console.log(this.cellStateList);
  // }

  // setMouseColor() {
  //   const totalProbability = this.mouseProbabilityConf.reduce(
  //     (acc, probability) => (acc = acc + probability.weight),
  //     0
  //   );

  //   const random = Math.random() * totalProbability;

  //   let currentSum = 0;
  //   let isColorSetted = false;
  //   let mouseColor = EMouseColor.RED;

  //   this.mouseProbabilityConf.forEach(probability => {
  //     currentSum = currentSum + probability.weight;
  //     if (random < currentSum && !isColorSetted) {
  //       probability.weight = Math.max(1, probability.weight - Math.floor(Math.random() * 5));
  //       mouseColor = probability.key;
  //       isColorSetted = true;
  //     } else {
  //       probability.weight = probability.weight + Math.floor(Math.random() * 3);
  //     }
  //   });
  //   return mouseColor;
  // }
  // onTick() {
  //   const copyCellStateList: (null | Mouse)[] = this.cellStateList.map(() => null);

  //   const copyCellReservedState: (null | number)[] = this.cellReservedState.map(() => null);

  //   if (this.doorTile) {
  //     if (this.flowGrid[this.exitCoords.y][this.exitCoords.x] === DOWN) {
  //       console.log(this.doorTile.index);
  //       if (this.doorTile.index === -1) this.doorTile.index = 11;
  //     }
  //   }

  //   // this.cellStateList.forEach((cellState, idx) => {
  //   //   if (!cellState) return;

  //   this.cellReservedState.forEach((cellState, idx) => {
  //     if (!cellState) return;
  //     const mouse = this.mouseMapList.get(cellState);
  //     if (!mouse) return;

  //     const { x, y } = mouse.gridPosition;
  //     const direction = this.flowGrid[y][x];

  //     // const moveType = this.levelGrid[y][x] === 2 ? 'jump' : 'run';
  //     // let aDirection = 'right';
  //     // if (this.flowGrid[y][x].x === -1 || this.flowGrid[y][x].y === -1)
  //     //   aDirection === 'left';
  //     const a = this.flowGrid[y][x];

  //     // if (a) {
  //     //   const aDirection = a.x === 1 || a.y === 1 ? false : true;
  //     //   const moveType = a.y ? EMoveType.JUMP : EMoveType.RUN;
  //     //   mouse.syncVisuals({ moveType, isDirectedToLeft: aDirection });
  //     // }
  //     // const a = direction === T;
  //     // // if (direction === LEFT || )

  //     const newX = x + direction.x;
  //     const newY = y + direction.y;

  //     const mouseNewIdx = idx ? idx - 1 : this.cellReservedState.length - 1;

  //     switch (this.flowGrid[y][x]) {
  //       case NONE: {
  //         // copyCellStateList[idx] = cellState;
  //         copyCellReservedState[idx] = cellState;
  //         break;
  //       }

  //       case DOWN: {
  //         if (!idx) {
  //           // this.leaveMouseList.push( cellState);
  //           this.leaveMouseList.push(mouse);
  //           break;
  //         }
  //       }
  //       case LEFT:
  //       case RIGHT:
  //       case UP:
  //       default: {
  //         if (!idx || !copyCellReservedState[mouseNewIdx]) {
  //           this.updateMousePosition(mouse, newX, newY);
  //           // copyCellStatet[cellStateNewIdx] = cellState;
  //           copyCellReservedState[mouseNewIdx] = cellState;
  //           return;
  //         }

  //         // copyCellStateList[idx] = cellState;
  //         copyCellReservedState[idx] = cellState;
  //       }
  //     }
  //   });

  //   // this.cellStateList = copyCellStateList;
  //   this.cellReservedState = copyCellReservedState;
  //   // console.log(copyCellReservedState);
  //   // console.log(this.cellStateList);

  //   this.updateLeaveMouseList();
  //   // this.checkMouseQueue();

  //   this.updateArriveMouseList();

  //   // console.log('updating');
  // }

  // addMouse() {
  //   // console.log('addmouse');
  //   if (this.arriveMouseList.length >= this.maxArriveMouseListLength) return;
  //   const color = this.getMouseColor();

  //   const newMouse = new Mouse(this, this.spawnPoint.x, this.spawnPoint.y, {
  //     color,
  //     id: ++this.allMouseAmount,
  //     gridPosition: { x: 0, y: 0 },
  //   });

  //   this.arriveMouseList.push(newMouse);
  //   this.mouseMapList.set(this.allMouseAmount, newMouse);
  //   // if (this.spawnDoorSprite) this.spawnDoorSprite.play('door-open');
  // }

  // cautchMouse() {
  //   console.log('cautch');
  //   const { cellId, cellCoords, previousCellCoords, nextCellCoords } =
  //     this.mouseTrapConfigList[this.activeTrapId];
  //   const { x, y } = cellCoords;
  //   // console.log(this.mouseTrapConfigList[this.activeTrapId]);

  //   const currentPinWheelId = this.pinWheelVanesIdList[this.activeTrapId];
  //   // console.log(this.activeTrapId);
  //   // console.log(currentPinWheelId);

  //   const pinwheelState = this.pinwheelVanesStateConfig[currentPinWheelId];
  //   // console.log(pinwheelState);

  //   if (pinwheelState === undefined) return;
  //   const cautchedMouse = pinwheelState.mouse;

  //   let newMouse;
  //   const state = this.cellReservedState[cellId];
  //   newMouse = this.cellStateList[cellId];

  //   const pos = this.pinwheelVanesMousePlace[currentPinWheelId];
  //   // console.log(pos?.x);
  //   // console.log(pos?.y);
  //   // console.log(this.containerPinwheel?.x);
  //   // console.log(pos?.y);
  //   // if (this.isCellStateListUpdated) {
  //   //   newMouse = this.cellStateList[id];
  //   // } else {
  //   //   if (!state) newMouse = null;
  //   //   else {
  //   //     newMouse = this.cellStateList[id];
  //   //   }
  //   // }

  //   // if (newMouse) {
  //   //   newMouse.syncVisuals({ moveType: EMoveType.STAND, isDirectedToLeft: false });
  //   // }
  //   if (cautchedMouse) {
  //     if (newMouse) {
  //       // console.log('mouse');
  //       // console.log(newMouse.x, newMouse.y);
  //       // this.containerPinwheel?.add(newMouse);
  //       // newMouse.forceSetLocation(paddingX, paddingY);
  //       newMouse.updateCautchState(true, { x: 0, y: 0 });
  //       pos?.addAt(newMouse, 0);
  //       // newMouse.isCautched = true;
  //       // newMouse.forceSetPosition(0, 0);

  //       pinwheelState.mouse = newMouse;
  //     } else {
  //       pinwheelState.mouse = null;
  //       // if (pos?.getByName('bubble'))
  //       const bubble = pos!.getByName('bubble');
  //       if (bubble instanceof Phaser.GameObjects.Image) {
  //         bubble.visible = false;
  //       }
  //     }

  //     pos?.remove(cautchedMouse);

  //     const previousPosition = this.layoutGrid[previousCellCoords.y][previousCellCoords.x];
  //     const nextLocation = this.layoutGrid[nextCellCoords.y][nextCellCoords.x];

  //     if (this.isCellStateListUpdated) {
  //       cautchedMouse.updateCautchState(false, previousPosition, this.layoutGrid[y][x]);
  //     } else {
  //       cautchedMouse.updateCautchState(false, this.layoutGrid[y][x], nextLocation);
  //     }

  //     if (this.isCellStateListUpdated) {
  //       cautchedMouse.setGridPosition(x, y);
  //       this.cellStateList[cellId] = cautchedMouse;
  //       this.cellReservedState[cellId] = cautchedMouse.id;
  //     } else {
  //       cautchedMouse.setGridPosition(nextCellCoords.x, nextCellCoords.y);
  //       this.cellStateList[cellId] = cautchedMouse;
  //       this.cellReservedState[cellId - 1] = cautchedMouse.id;
  //     }

  //     return;
  //   }
  //   if (newMouse) {
  //     newMouse.updateCautchState(true, { x: 0, y: 0 });
  //     pinwheelState.mouse = newMouse;
  //     // newMouse.forceSetPosition(0, 0);
  //     pos?.addAt(newMouse, 0);
  //     const bubble = pos!.getByName('bubble');
  //     if (bubble instanceof Phaser.GameObjects.Image) {
  //       bubble.visible = true;
  //     }

  //     if (this.isCellStateListUpdated) {
  //       this.cellStateList[cellId] = null;
  //       this.cellReservedState[cellId] = null;
  //     } else {
  //       this.cellReservedState[cellId - 1] = null;
  //       this.cellStateList[cellId] = null;
  //     }
  //   }
  // }

  // pinWheelRotate(direction: ERotateDirection) {
  //   this.pinwheelRotateMaxAmount;

  //   if (!this.pinwheelRotateMaxAmount[direction]) return;

  //   let angleSign;
  //   let lastElement;
  //   if (direction === ERotateDirection.LEFT) {
  //     this.pinwheelRotateAngel = this.pinwheelRotateAngel - 90;
  //     angleSign = '-';
  //     lastElement = this.pinWheelVanesIdList.shift();
  //     if (lastElement) {
  //       this.pinWheelVanesIdList.push(lastElement);
  //     }
  //   } else {
  //     this.pinwheelRotateAngel = this.pinwheelRotateAngel + 90;
  //     angleSign = '+';
  //     lastElement = this.pinWheelVanesIdList.pop();

  //     if (lastElement) {
  //       this.pinWheelVanesIdList.unshift(lastElement);
  //     }
  //   }
  //   this.tweens.add({
  //     targets: this.containerPinwheel,
  //     angle: this.pinwheelRotateAngel,
  //     duration: this.gameTick / 4,
  //     repeat: 0,
  //   });

  //   Object.values(this.pinwheelVanesMousePlace).forEach(item => {
  //     if (!item) return;
  //     this.tweens.add({
  //       targets: item,
  //       angle: -this.pinwheelRotateAngel,
  //       duration: this.gameTick / 4,
  //       repeat: 0,
  //     });
  //   });

  //   if (this.pinwheelRotateMaxAmount[direction] < 0) return;

  //   Object.values(ERotateDirection).forEach(item => {
  //     if (item === direction) this.pinwheelRotateMaxAmount[item]--;
  //     else this.pinwheelRotateMaxAmount[item]++;
  //   });
  // }

  // switchMouseTrap() {
  //   if (this.mouseTrapConfigList.length <= 1) return;

  //   if (this.activeTrapId === this.mouseTrapConfigList.length - 1) {
  //     this.activeTrapId = 0;
  //   } else {
  //     this.activeTrapId++;
  //   }
  //   const activeTrapCoords = this.mouseTrapConfigList[this.activeTrapId].cellCoords;
  //   const activeTrapPoint = this.layoutGrid[activeTrapCoords.y][activeTrapCoords.x];
  //   // console.log(activeTrapPoint);
  //   this.activeTrapMarker?.setPosition(activeTrapPoint.x, activeTrapPoint.y);
  // }

  constructor() {
    super('Level');
  }

  create() {
    const { width, height } = this.scale;
    const levelId = GameState.currentLevel;
    if (!levelId) return;
    const size = height - HEADER_HEIGHT - 2 * VIEWPORT_MARGIN;
    this.cameras.main.setViewport(VIEWPORT_MARGIN, HEADER_HEIGHT + VIEWPORT_MARGIN, size, size);
    this.add.image(size / 2, size / 2, 'bg1').setDisplaySize(size, size);
    this.cameras.main.setViewport(VIEWPORT_MARGIN, HEADER_HEIGHT + VIEWPORT_MARGIN, size, size);
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
