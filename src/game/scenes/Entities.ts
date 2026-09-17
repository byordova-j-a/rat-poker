import Phaser from 'phaser';

import { EMouseColor, TPosition, EMouseType, EMoveType, TLocation } from '../types';

type TMouseConfig = {
  id: number;
  color: EMouseColor;
  gridPosition: TPosition;
};

export class Mouse extends Phaser.GameObjects.Sprite {
  id: number = -1;
  color: EMouseColor = EMouseColor.RED;
  gridPosition: TPosition = { x: 0, y: 0 };

  startPos: TPosition = { x: 0, y: 0 };
  endPos: TPosition = { x: 0, y: 0 };
  nextTarget: TPosition | null = null;

  moveType?: EMoveType;
  isDirectedToLeft: boolean = false;
  isCautched: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, config: TMouseConfig) {
    super(scene, x, y, `${config.color}-mouse`);
    this.startPos = { x, y };
    this.endPos = { x, y };

    scene.add.existing(this);
    scene.events.on('GAME_TICK', this.onGlobalTick, this);
    this.setDisplaySize(34, 35);
    this.setOrigin(0.5, 0.5);

    this.setup(config);
  }

  private setup(config: TMouseConfig) {
    const { id, color, gridPosition } = config;
    this.id = id;
    this.color = color;
    this.gridPosition = { ...gridPosition };
    this.updateDirectionProperties();
  }

  destroy(fromScene?: boolean) {
    if (this.scene && this.scene.events) {
      this.scene.events.off('GAME_TICK', this.onGlobalTick, this);
    }
    super.destroy(fromScene);
  }

  public setNextTarget(x: number, y: number) {
    this.nextTarget = { x, y };
  }
  public setGridPosition(x: number, y: number) {
    this.gridPosition = { x, y };
  }

  public updateCautchState(params: {
    isCautched: boolean;
    newStartPoint: TLocation;
    newEndPoint?: TLocation;
    coords: TLocation;
  }) {
    const { isCautched, newStartPoint, newEndPoint, coords } = params;
    this.isCautched = isCautched;
    this.setRoute(newStartPoint, newEndPoint || newStartPoint);
    this.gridPosition = { ...coords };
  }

  updateDirectionProperties() {
    const previousMoveType = this.moveType;
    if (this.isCautched) {
      this.moveType = EMoveType.STAND;
      this.isDirectedToLeft = false;
    } else {
      if (!(this.startPos.x === this.endPos.x && this.startPos.y === this.endPos.y)) {
        this.isDirectedToLeft =
          this.startPos.x < this.endPos.x || this.startPos.y < this.endPos.y ? false : true;
      }

      if (this.startPos.y === this.endPos.y) {
        this.moveType = EMoveType.RUN;
      } else if (this.startPos.x === this.endPos.x) this.moveType = EMoveType.JUMP;
    }
    this.setFlipX(this.isDirectedToLeft);

    if (this.moveType !== previousMoveType) {
      this.play(`${this.color}-mouse-${this.moveType}`, true);
    }
  }

  private onGlobalTick() {
    this.startPos = { ...this.endPos };

    if (this.nextTarget) {
      this.endPos = { ...this.nextTarget };
    }
    this.updateDirectionProperties();
  }

  public setRoute(start: TPosition, end: TPosition) {
    this.startPos = { ...start };
    this.endPos = { ...end };
    this.nextTarget = { ...end };
    this.updateDirectionProperties();
  }

  protected preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    const ticker = (this.scene as any).globalTicker;

    let progress = ticker.getValue();
    if (progress === 1) {
      progress = 0;
    }
    this.x = Phaser.Math.Linear(this.startPos.x, this.endPos.x, progress);
    this.y = Phaser.Math.Linear(this.startPos.y, this.endPos.y, progress);
  }
}

export enum EControls {
  LEFT1 = 'left1',
  LEFT2 = 'left2',
  RIGHT1 = 'right1',
  RIGHT2 = 'right2',
  CHANGE_TRAP = 'change-trap',
  CAUTCH = 'cautch',
}
export enum EActionType {
  LEFT = 'left',
  RIGHT = 'right',
  CAUTCH = 'cautch',
  CHANGE_TRAP = 'change_trap',
}

const defaultControlsConfig = {
  [EControls.LEFT1]: { label: 'KeyA', code: 65, action: EActionType.LEFT },
  [EControls.LEFT2]: { label: 'LeftArrow', code: 37, action: EActionType.LEFT },
  [EControls.RIGHT1]: { label: 'keyD', code: 68, action: EActionType.RIGHT },
  [EControls.RIGHT2]: { label: 'RightArrow', code: 39, action: EActionType.RIGHT },
  [EControls.CAUTCH]: { label: 'Space', code: 32, action: EActionType.CAUTCH },
  [EControls.CHANGE_TRAP]: { label: 'KeyQ', code: 81, action: EActionType.CHANGE_TRAP },
};

type TControl = {
  label: string;
  code: number;
  action: EActionType;
};

// type TControlsConfig = {
//   [key in EControls]: TControl;
// };
const invalidKeyCodeList = [
  112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 145, 19, 27, 45, 36, 33, 46, 35, 34,
  9, 20, 16, 17, 91, 92, 93,
];
class GameControls {
  keyBinds: { [key in EControls]: TControl };
  keys: { [key in EControls]?: Phaser.Input.Keyboard.Key } = {};
  scene: Phaser.Scene | null = null;
  [EControls.CHANGE_TRAP]: TControl = defaultControlsConfig[EControls.CHANGE_TRAP];
  constructor() {
    const savedKeyBindsJson = window.localStorage.getItem('keyBinds');
    const savedKeyBinds: { [key in EControls]: TControl } | null = JSON.parse(
      savedKeyBindsJson || 'null'
    );
    this.keyBinds = savedKeyBinds || defaultControlsConfig;
  }

  initScene(scene: Phaser.Scene) {
    if (this.scene && this.keys) {
      console.log(this.scene?.input?.keyboard?.keys);
      Object.entries(this.keys).forEach(([keyType, keyObj]) => {
        // const keyObj = scene.input.keyboard?.addKey(keyBind.value);
        if (keyObj) {
          keyObj.removeAllListeners();
          this.scene?.input.keyboard?.removeKey(keyObj.keyCode);
        }
        // this.keys[keyType as EControls] = keyObj;
        // keyObj?.on('down', () => {
        //   scene.events.emit(`input_${keyBind.action}`);
        // });
      });
    }
    this.scene = scene;
    this.keys = {};

    Object.entries(this.keyBinds).forEach(([keyType, keyBind]) => {
      const keyObj = scene.input.keyboard?.addKey(keyBind.code);
      this.keys[keyType as EControls] = keyObj;
      keyObj?.on('down', () => {
        console.log('3');
        scene.events.emit(`input_${keyBind.action}`);
      });
    });
    console.log(this.scene?.input?.keyboard?.keys);
  }

  updateKey(params: { keyType: EControls; keyCode: number; keyLabel: string }): {
    success: boolean;
    errorMessage: string;
  } {
    const { keyType, keyCode, keyLabel } = params;
    console.log('9999');
    console.log(keyLabel);
    // console.log(keyType);
    const scene = this.scene;
    const keyObj = this.keys[keyType];
    const keyBind = this.keyBinds[keyType];

    if (invalidKeyCodeList.includes(keyCode))
      return { success: false, errorMessage: 'Недопустимая клавиша' };

    if (keyBind.code === keyCode) return { success: true, errorMessage: '' };

    const isDuble = Object.values(this.keyBinds).some(keyBind => {
      if (keyCode === keyBind.code) return true;
      return false;
    });

    if (isDuble) return { success: false, errorMessage: 'Клавиша занята' };

    keyBind.label = keyLabel;
    keyBind.code = keyCode;

    window.localStorage.setItem('keyBinds', JSON.stringify(this.keyBinds));

    if (!keyObj || !scene) {
      return { success: true, errorMessage: '' };
    }
    // console.log(keyCode);

    // console.log(',');

    const newKeyObj = scene.input.keyboard?.addKey(keyBind.code);
    // console.log(newKeyObj);
    // console.log(keyBind);
    // console.log(newKeyObj);
    this.keys[keyType as EControls] = newKeyObj;
    newKeyObj?.on('down', () => {
      // console.log('fff');
      scene.events.emit(`input_${keyBind.action}`);

      // console.log(`input_${keyBind.action}`);
    });

    keyObj.removeAllListeners();
    console.log(this.scene?.input?.keyboard?.keys);
    this.scene?.input.keyboard?.removeKey(keyObj.keyCode);
    console.log(this.scene?.input?.keyboard?.keys);

    return { success: true, errorMessage: '' };
  }
}

export const gameControls = new GameControls();
