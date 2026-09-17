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

  startPoint: TPosition = { x: 0, y: 0 };
  endPoint: TPosition = { x: 0, y: 0 };
  nextPoint: TPosition | null = null;

  moveType: EMoveType = EMoveType.RUN;
  isDirectedToLeft: boolean = false;
  isCautched: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, config: TMouseConfig) {
    super(scene, x, y, `${config.color}-mouse`);
    this.startPoint = { x, y };
    this.endPoint = { x, y };

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

  public setNextPoint(x: number, y: number) {
    this.nextPoint = { x, y };
  }
  public setGridPosition(x: number, y: number) {
    this.gridPosition = { x, y };
  }

  public updateCautchState(isCautched: boolean, newStartPoint: TLocation, newEndPoint?: TLocation) {
    this.isCautched = isCautched;
    this.setRoute(newStartPoint, newEndPoint || newStartPoint);
  }

  updateDirectionProperties() {
    const previousMoveType = this.moveType;
    if (this.isCautched) {
      this.moveType = EMoveType.STAND;
      this.isDirectedToLeft = false;
    } else {
      if (!(this.startPoint.x === this.endPoint.x && this.startPoint.y === this.endPoint.y)) {
        this.isDirectedToLeft =
          this.startPoint.x < this.endPoint.x || this.startPoint.y < this.endPoint.y ? false : true;
      }

      if (this.startPoint.y === this.endPoint.y) {
        this.moveType = EMoveType.RUN;
      } else if (this.startPoint.x === this.endPoint.x) this.moveType = EMoveType.JUMP;
    }
    this.setFlipX(this.isDirectedToLeft);

    if (this.moveType !== previousMoveType) {
      this.play(`${this.color}-mouse-${this.moveType}`, true);
    }
  }

  private onGlobalTick() {
    this.startPoint = { ...this.endPoint };

    if (this.nextPoint) {
      this.endPoint = { ...this.nextPoint };
    }
    this.updateDirectionProperties();
  }

  public setRoute(start: TPosition, end: TPosition) {
    this.startPoint = { ...start };
    this.endPoint = { ...end };
    this.nextPoint = { ...end };
    this.updateDirectionProperties();
  }

  protected preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    const ticker = (this.scene as any).globalTicker;

    let progress = ticker.getValue();
    if (progress === 1) {
      progress = 0;
    }
    this.x = Phaser.Math.Linear(this.startPoint.x, this.endPoint.x, progress);
    this.y = Phaser.Math.Linear(this.startPoint.y, this.endPoint.y, progress);
  }
}
