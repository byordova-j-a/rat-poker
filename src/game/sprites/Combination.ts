import Phaser from 'phaser';

export class Combination extends Phaser.GameObjects.Sprite {
  normalFrame: number = 0;
  whiteFrame: number = 0;
  id: number = 0;

  flashWhite(_parent, id: number) {
    console.log('flash' + id);
    if (this.id !== id) return;
    this.setFrame(this.whiteFrame);
    this.scene.time.delayedCall(200, () => {
      this.setFrame(this.normalFrame);
    });
  }
  constructor(params: { scene: Phaser.Scene; x: number; y: number; id: number }) {
    const { scene, x, y, id } = params;
    super(scene, x, y, 'combinations', id);
    this.normalFrame = 2 * (id - 1);
    this.whiteFrame = this.normalFrame + 1;
    this.id = id;
    this.setFrame(this.normalFrame);
    this.setDisplaySize(216, 34);
    this.setOrigin(0, 0);
    scene.registry.events.on('changedata-createdCombination', this.flashWhite, this);
    this.on('destroy', () => {
      scene.registry.events.off('changedata-createdCombination', this.flashWhite, this);
    });

    // this.setup(config);
  }
}
