import type { Level } from '~/game/scenes/Level';
import { NONE, RIGHT, LEFT, UP, DOWN } from '~/game/constants';
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
import { LEVELS_CONFIG } from '~/game/levelsConfig';

export function setLevelParams(this: Level, levelId: number) {
  const levelConfig = LEVELS_CONFIG[levelId];
  if (!levelConfig) return;
  const {
    startPoint,
    maxArriveMouseListLength,
    mouseColorList,
    entryCellId,
    necessaryMouseAmount,
    maxMouseQeueLength,
    pinwheelVanesConfigList,
    pinwheelRotateMaxAmount,
    pinwheelVanesStateConfig,
    mouseTrapConfigList,
    cellAmount,
    gameTick,

    levelGrid,
    specialElementGrid,
    flowGrid,

    spawnCoords,
    despawnCoords,
    preDespawnCoords,
    exitCoords,
    entryCoords,
    pinwheelCoords,
    counterCoords,
  } = levelConfig;
  this.gameTick = gameTick;

  this.mouseMapList = new Map<number, Mouse>();

  this.arriveMouseList = [];
  this.leaveMouseList = [];

  this.allMouseAmount = 0;
  this.necessaryMouseAmount = necessaryMouseAmount;

  this.maxArriveMouseListLength = maxArriveMouseListLength;
  this.maxMouseQeueLength = maxMouseQeueLength;

  this.layoutGrid = [];
  //ВАЖНО!1! надо, чтобы внутренние векторы остались UP и прочим - т.е, чтобы ссылались на них, иначе сравнение не работает
  this.flowGrid = [...flowGrid];
  //ВАЖНО!2! надо, чтобы внутренние векторы остались UP и прочим - т.е, чтобы ссылались на них, иначе сравнение не работает

  this.levelGrid = structuredClone(levelGrid);
  // console.log(this.levelGrid);
  this.specialElementGrid = structuredClone(specialElementGrid);

  this.levelGrid.forEach((column, idy) => {
    const layoutGridColumn: TLocation[] = [];

    column.forEach((_cellValue, idx) => {
      const position = { y: idy * 50 + startPoint.y, x: idx * 50 + startPoint.x };

      layoutGridColumn.push(position);
    });
    this.layoutGrid.push(layoutGridColumn);
  });
  console.log(this.layoutGrid);

  this.cellStateList = Array.from({ length: cellAmount }, () => {
    return null;
  });

  this.cellReservedState = Array.from({ length: cellAmount }, () => null);

  this.isCellStateListUpdated = false;

  this.mouseTrapConfigList = mouseTrapConfigList;

  this.activeTrapId = 0;
  this.entryCellId = entryCellId;

  this.openedDoorTickAmount = 0;
  this.isDespawnDoorOpened = false;

  //подумай, надо ли, может и без деструктуризации норм, если ты их не меняешь в ходе игры
  this.spawnCoords = { ...spawnCoords };

  this.despawnCoords = { ...despawnCoords };
  this.preDespawnCoords = { ...preDespawnCoords };
  const activeTrapCoords = this.mouseTrapConfigList[0].cellCoords;
  this.entryCoords = { ...entryCoords };
  this.exitCoords = { ...exitCoords };

  this.pinwheelCoords = { ...pinwheelCoords };
  this.counterCoords = { ...counterCoords };

  this.spawnPoint = this.layoutGrid[this.spawnCoords.y][this.spawnCoords.x];

  const despawnPoint = this.layoutGrid[this.despawnCoords.y][this.despawnCoords.x];
  const pinwheelsPoint = this.layoutGrid[this.pinwheelCoords.y][this.pinwheelCoords.x];
  const counterPoint = this.layoutGrid[this.counterCoords.y][this.counterCoords.x];

  const activeTrapPoint = this.layoutGrid[activeTrapCoords.y][activeTrapCoords.x];

  this.map = this.make.tilemap({
    tileWidth: 50,
    tileHeight: 50,
    width: 8,
    height: 9,
  });

  const tileSet = this.map.addTilesetImage('tileset', 'game-tiles');
  if (tileSet) {
    this.map
      .createBlankLayer('layer1', tileSet, startPoint.x - 25, startPoint.y - 25)!
      .putTilesAt(this.levelGrid, 0, 0);

    this.map
      .createBlankLayer('layer2', tileSet, startPoint.x - 25, startPoint.y - 25)!
      .putTilesAt(this.specialElementGrid, 0, 0);

    this.doorTile =
      this.map
        ?.getLayer('layer2')
        ?.tilemapLayer?.getTileAt(this.exitCoords.x, this.exitCoords.y, true) || null;
  }

  this.mouseProbabilityConf = mouseColorList.map(item => ({
    key: item,
    weight: 10,
  }));

  this.containerPinwheel = this.add.container(pinwheelsPoint.x, pinwheelsPoint.y);

  this.containerCounter = this.add.container(counterPoint.x, counterPoint.y);
  this.pinwheelVanesStateConfig = structuredClone(pinwheelVanesStateConfig);

  this.pinwheelVanesConfigList = pinwheelVanesConfigList;
  this.pinwheelRotateMaxAmount = { ...pinwheelRotateMaxAmount };
  this.pinwheelRotateAngel = 0;

  this.pinwheelVanesMousePlace = {
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
  };

  this.pinWheelVanesIdList = [1, 2, 3, 4];

  this.activeTrapMarker = this.add.circle(activeTrapPoint.x, activeTrapPoint.y, 5, 0xff0000);

  this.globalTicker = null;

  this.spawnDoorSprite = this.add
    .sprite(this.spawnPoint.x, this.spawnPoint.y - 3, 'door', 0)
    .setDisplaySize(39, 32);

  this.despawnDoorSprite = this.add
    .sprite(despawnPoint.x, despawnPoint.y - 3, 'door', 0)
    .setDisplaySize(39, 32)
    .setDepth(10);

  this.pinwheelVanesConfigList.forEach(({ angle, id, mousePlacePoint }) => {
    const vane = this.add
      .image(0, 0, 'pinwheelVanes', 0)
      .setDisplaySize(70, 10)
      .setAngle(angle)
      .setOrigin(1, 0.5);

    const mouseContainer = this.add.container(mousePlacePoint.x, mousePlacePoint.y);

    mouseContainer.add(this.add.image(0, 0, 'bubble').setName('bubble').setVisible(false));

    this.containerPinwheel!.add([vane, mouseContainer]);
    this.pinwheelVanesMousePlace[id] = mouseContainer;
    this.tweens.chain({
      targets: mouseContainer,
      loop: -1,
      tweens: [
        { x: '-=1', duration: 100 },
        { x: '+=2', duration: 100 },
        { x: '-=1', duration: 100 },
        { y: '-=1', duration: 100 },
        { y: '+=2', duration: 100 },
        { y: '-=1', duration: 100 },
      ],
    });
  });

  this.add.image(pinwheelsPoint.x, pinwheelsPoint.y, 'pinwheelCenter').setDisplaySize(20, 20);

  const rect2 = this.add.rectangle(0, 0, 39, 28, 0xffffff);
  const label = this.add.text(0, 0, `${this.necessaryMouseAmount}`, {
    fontSize: '30px',
    color: '#000000',
    fontFamily: 'Arial',
  });

  label.setResolution(2);
  label.setOrigin(0.5);
  label.setName('ratLabel');
  this.containerCounter.add([rect2, label]);
}

// export function setLevelParams1(this: Level, id: number) {
//   const levelConfig = LEVELS_CONFIG[id];
//   if (!levelConfig) return;
//   const {
//     startPoint,
//     maxArriveMouseListLength,
//     mouseColorList,
//     entryCellId,
//     necessaryMouseAmount,
//     maxMouseQeueLength,
//     pinwheelVanesConfigList,
//     pinwheelRotateMaxAmount,
//     pinwheelVanesStateConfig,
//     mouseTrapConfigList,
//     cellAmount,
//     gameTick,

//     levelGrid,
//     specialElementGrid,
//     flowGrid,

//     spawnCoords,
//     despawnCoords,
//     preDespawnCoords,
//     exitCoords,
//     entryCoords,
//     pinwheelCoords,
//     counterCoords,
//   } = levelConfig;
//   const { width, height } = this.scale;

//   this.levelData = 0;
//   this.gameTick = gameTick;
//   this.mouseMapList = new Map<number, Mouse>();
//   this.allMouseAmount = 0;

//   this.arriveMouseList = [];
//   this.leaveMouseList = [];
//   this.isCellStateListUpdated = false;
//   this.activeTrapId = 0;
//   this.openedDoorTickAmount = 0;
//   this.isDespawnDoorOpened = false;
//   this.pinwheelRotateAngel = 0;

//   this.pinwheelVanesMousePlace = {
//     1: undefined,
//     2: undefined,
//     3: undefined,
//     4: undefined,
//   };

//   this.pinWheelVanesIdList = [1, 2, 3, 4];

//   this.globalTicker = null;

//   this.add.image(width / 2, height / 2, 'bg1').setDisplaySize(width, height);

//   this.maxArriveMouseListLength = maxArriveMouseListLength;
//   // const startLocation = startPoint;

//   this.levelGrid = structuredClone(levelGrid);

//   this.specialElementGrid = structuredClone(specialElementGrid);

//   this.spawnCoords = { ...spawnCoords };
//   this.despawnCoords = { ...despawnCoords };
//   this.preDespawnCoords = { ...preDespawnCoords };

//   this.exitCoords = { ...exitCoords };
//   this.entryCoords = { ...entryCoords };

//   this.pinwheelCoords = { ...pinwheelCoords };
//   this.counterCoords = { ...counterCoords };

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
//       startPoint.x - 25,
//       startPoint.y - 25
//     );

//     const layer2 = this.map.createBlankLayer(
//       'layer2',
//       tileSet,
//       startPoint.x - 25,
//       startPoint.y - 25
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

//   //ВАЖНО!!! надо, чтобы внутренние векторы остались UP и прочим - т.е, чтобы ссылались на них, иначе твоё сравнение идёт нафиг
//   this.flowGrid = [...flowGrid];
//   //ВАЖНО!!!
//   console.log(structuredClone(flowGrid));
//   console.log(flowGrid);
//   this.cellStateList = Array.from({ length: cellAmount }, () => {
//     return null;
//   });

//   this.cellReservedState = Array.from({ length: cellAmount }, () => null);

//   this.mouseProbabilityConf = mouseColorList.map(item => ({
//     key: item,
//     weight: 10,
//   }));

//   // this.mouseTrapConfigList = [
//   //   { x: 5, y: 2, id: 11, previousPosition: {x:0,y:0} },
//   //   { x: 8, y: 5, id: 5, previousPosition: {x:0,y:0} },
//   // ];

//   this.entryCellId = entryCellId;

//   this.necessaryMouseAmount = necessaryMouseAmount;
//   this.maxMouseQeueLength = maxMouseQeueLength;

//   this.pinwheelVanesConfigList = pinwheelVanesConfigList;

//   this.pinwheelRotateMaxAmount = pinwheelRotateMaxAmount;

//   this.pinwheelVanesStateConfig = pinwheelVanesStateConfig;

//   this.levelGrid.forEach((column, idy) => {
//     const layoutGridColumn: TLocation[] = [];

//     column.forEach((cellValue, idx) => {
//       const position = { y: idy * 50 + startPoint.y, x: idx * 50 + startPoint.x };

//       layoutGridColumn.push(position);

//       // let color = cellValue === 2 ? 0x0bbd7b : 0x167a4e;
//       // if (cellValue === 3) color = 0xffffff;
//       // if (cellValue === 4) color = 0x40d2ff;
//       // if (cellValue !== 1) {
//       //   // this.add.rectangle(position.x, position.y, 50, 50, color);
//       //   // const icon = this.add.image(position.x, position.y, 'game-tiles', 1);
//       //   // Его тоже можно растянуть до 50px
//       //   // icon.setDisplaySize(50, 50);
//       // }
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
//   this.mouseTrapConfigList = mouseTrapConfigList;

//   const activeTrapCoords = this.mouseTrapConfigList[0].cellCoords;
//   const activeTrapPoint = this.layoutGrid[activeTrapCoords.y][activeTrapCoords.x];
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
