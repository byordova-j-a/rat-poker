import Phaser from 'phaser';

export class Door extends Phaser.GameObjects.Container {
  private static textureKey = 'doorTexture';

  private static enxureTexture(scene: Phaser.Scene) {
    if (scene.textures.exists(Door.textureKey)) return;
    const g = scene.make.graphics();

    g.fillStyle(0x533a26, 1)
      .lineStyle(4, 0x322012, 1)
      .beginPath()
      .arc(44, 44, 40, Math.PI, 0, false)
      .lineTo(84, 106)
      .lineTo(4, 106)
      .closePath()
      .fillPath()
      .strokePath()
      .generateTexture('doorTexture', 88, 110)
      .destroy();
  }

  id: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, id: number) {
    Door.enxureTexture(scene);
    super(scene, x, y);
    this.id = id;

    const sprite = scene.add.sprite(44, 55, Door.textureKey);
    sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });

    sprite.on('pointerdown', () => {
      console.log(this.id);
      scene.registry.set('showedLevel', this.id);
      scene.registry.set('scene', { type: 'levelsMap', value: this.id });
    });

    const label = scene.add
      .text(44, 55, this.id.toString(), {
        fontSize: '32px',
        color: '#13f011',
        fontStyle: 'bold',
        stroke: '#322012',
        fontFamily: 'Arial',
        strokeThickness: 6,
        letterSpacing: 2,
      })
      .setOrigin(0.5);
    this.add([sprite, label]);
    scene.add.existing(this);
  }
}
