import Phaser from 'phaser';

export class UILabeledSlider extends Phaser.GameObjects.Container {
  labelText: Phaser.GameObjects.Text | null = null;
  constructor(params: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    label: string;
    sliderWidth: number;
    startSliderValue: number;
  }) {
    const { scene, x, y, label, sliderWidth, startSliderValue } = params;
    super(scene, x, y);
    const labelElement = scene.add
      .text(0, 0, label, {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#000000',
      })
      .setOrigin(0)
      .setResolution(2);

    const sliderContainer = scene.add.container(150, 10);

    const slider = scene.add.graphics();
    slider.fillStyle(0x444444);
    slider.fillRect(0, 0, sliderWidth, 4);
    slider.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(0, 0, sliderWidth, 4),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true,
    });

    const sliderPoint = scene.add
      .circle(startSliderValue * sliderWidth, 2, 5, 0x769be8)
      .setInteractive({ draggable: true, useHandCursor: true });

    slider.on('pointerdown', (_pointer: Phaser.Input.Pointer, localX: number) => {
      sliderPoint.x = localX;
      const volume = Math.round((localX * 100) / sliderWidth) / 100;
      this.emit('volum-updated', volume);
    });

    sliderPoint.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number) => {
      const clampedX = Phaser.Math.Clamp(dragX, 0, sliderWidth);
      sliderPoint.x = clampedX;
      const volume = Math.round((clampedX * 100) / sliderWidth) / 100;
      this.emit('volum-updated', volume);
    });

    sliderContainer.add([slider, sliderPoint]);
    this.add([labelElement, sliderContainer]);
  }
}
