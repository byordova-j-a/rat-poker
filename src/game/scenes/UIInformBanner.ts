import Phaser from 'phaser';
import { UIButton } from '~/game/scenes/UIButton';
import { GameState } from '~/game/GameState';
import { LEVELS_CONFIG } from '~/game/levelsConfig';
import { Combination } from '~/game/sprites/Combination';
import { COEF, HEADER_HEIGHT } from '~/game/constants';

export class UIInformBanner extends Phaser.GameObjects.Container {
  // content: Phaser.GameObjects.Container | null = null;
  isVisible: boolean = false;
  labelElement: Phaser.GameObjects.Text | null = null;
  combinationContainer: Phaser.GameObjects.Container | null = null;
  combList: Combination[] = [];
  button: UIButton | null = null;
  levelElement: Phaser.GameObjects.Text | null = null;
  scoreElement: Phaser.GameObjects.Text | null = null;
  constructor(params: { scene: Phaser.Scene }) {
    const { scene } = params;
    const { width, height } = scene;
    super(scene, 0, 0);
    // scene.registry.events.on('changedata-createdCombination', () => {
    //   console.log('12345');
    // });
    scene.registry.events.on(
      'changedata-scene',
      (_parent, value: { type: string; value: number }) => {
        console.log('chhh');
        console.log(value.type);
        if (!value.value) {
          this.isVisible = false;
          this.setVisible(false);
          return;
        }
        this.levelElement?.setText(value.value.toString().padStart(2, '0'));
        this.scoreElement?.setText((value.value * 105 + 625).toString().padStart(5, '0'));

        this.isVisible = true;
        this.setVisible(true);
        const inform = LEVELS_CONFIG[value.value]?.inform || {};
        const points = inform.points || value.value * 5;
        const combinationIdList = inform.combinationIdList || [(value.value % 9) + 1];

        if (value.type === 'levelsMap') {
          console.log(combinationIdList);

          // this.combinationContainer?.removeAll(true);
          // const comb1 = this.scene.add
          //   .image(0, 0, 'combinations', 0)
          //   .setDisplaySize(216, 34)
          //   .setOrigin(0, 0);
          // const comb1 = new Combination({ scene: this.scene, x: 100, y: 0, id: 1 });
          // const comb2 = new Combination({ scene: this.scene, x: 0, y: 34, id: 2 });
          // // const comb2 = this.scene.add
          // //   .image(0, 34, 'combinations', 2)
          // //   .setDisplaySize(216, 34)
          // //   .setOrigin(0, 0);
          // this.combinationContainer?.add([comb1, comb2]);
          this.combList.forEach(combElem => {
            if (combinationIdList.includes(combElem.id)) combElem.setVisible(true);
            else combElem.setVisible(false);
          });
          this.button?.setVisible(true);
        }
        if (value.type === 'level') {
          // text = `level ${value.value}
          // Очки: ${points}
          //  Комбинации: ${combinationIdList}`;
          this.button?.setVisible(false);
        }
        // this.labelElement?.setText(text);

        // if (!value && !this.isVisible) return;
        // if (!value) {
        //   this.isVisible = false;
        //   this.setVisible(false);
        // }
        // if (value) {
        //   const inform = LEVELS_CONFIG[value]?.inform || {};
        //   console.log(inform);
        //   const points = inform.points || value * 5;
        //   const combinationIdList = inform.combinationIdList || [3, 5, value];
        //   this.labelElement?.setText(`level ${value}
        //   Очки: ${points}
        //    Комбинации: ${combinationIdList}`);
        //   this.combinationContainer?.removeAll(true);
        //   const comb1 = this.scene.add
        //     .image(0, 0, 'combinations', 0)
        //     .setDisplaySize(216, 34)
        //     .setOrigin(0, 0);
        //   const comb2 = this.scene.add
        //     .image(0, 34, 'combinations', 2)
        //     .setDisplaySize(216, 34)
        //     .setOrigin(0, 0);
        //   this.combinationContainer?.add([comb1, comb2]);
        // }
        // const text = !value ? 'Игра' : `Уровень: ${value}`;

        // const mouse = this.add.image(10, 10, 'red-mouse', 0).setDisplaySize(20, 20);

        // this.textElem1!.setText(text);
      }
    );

    // scene.registry.events.on('changedata-currentLevel', (_parent, value: number | null) => {
    //   console.log(value);
    //   console.log(this.isVisible);

    //   if (!value && !this.isVisible) return;
    //   if (!value) {
    //     this.isVisible = false;
    //     this.setVisible(false);
    //   }
    //   if (value) {
    //     this.isVisible = true;
    //     this.setVisible(true);
    //     console.log('34q234');
    //     const inform = LEVELS_CONFIG[value]?.inform || {};
    //     console.log(inform);
    //     const points = inform.points || value * 5;
    //     const combinationIdList = inform.combinationIdList || [3, 5, value];
    //     this.labelElement?.setText(`level ${value}
    //        Комбинации: ${combinationIdList}`);
    //     this.combinationContainer?.removeAll(true);
    //     const comb1 = this.scene.add
    //       .image(0, 0, 'combinations', 0)
    //       .setDisplaySize(216, 34)
    //       .setOrigin(0, 0);
    //     const comb2 = this.scene.add
    //       .image(0, 34, 'combinations', 2)
    //       .setDisplaySize(216, 34)
    //       .setOrigin(0, 0);
    //     this.combinationContainer?.add([comb1, comb2]);
    //   }
    //   // const text = !value ? 'Игра' : `Уровень: ${value}`;

    //   // const mouse = this.add.image(10, 10, 'red-mouse', 0).setDisplaySize(20, 20);

    //   // this.textElem1!.setText(text);
    // });

    // if (!levelId) {
    //   return;
    // }
    // this.content = this.scene.add.container(0, 0);

    // let bg = this.scene.add.graphics();
    // bg.fillStyle(0x4f3232, 1);
    // bg.fillRect(0, 0, 300, 400);
    // this.labelElement = scene.add
    //   .text(0, 50, ``, {
    //     fontSize: '16px',
    //     fontFamily: 'Arial',
    //     color: '#000000',
    //   })
    //   .setOrigin(0)
    //   .setResolution(2);
    this.button = new UIButton({
      scene,
      x: 0,
      y: 526 - 40,
      label: 'Играть',
      width: 224,
      pointerdownHandler: () => {
        scene.registry.set('currentLevel', 1);
        scene.registry.set('showedLevel', null);
        GameState.currentLevel = 1;
        scene.scene.launch('Level');
        scene.scene.stop('LevelsMap');
        scene.registry.set('scene', { type: 'level', value: 1 });
      },
    });

    this.combinationContainer = this.scene.add.container((224 - 216) / 2, 86);
    const comb1 = new Combination({ scene: this.scene, x: 0, y: 0, id: 1 });
    const comb2 = new Combination({ scene: this.scene, x: 0, y: 34, id: 2 });
    const comb3 = new Combination({ scene: this.scene, x: 0, y: 34 * 2, id: 3 });
    const comb4 = new Combination({ scene: this.scene, x: 0, y: 34 * 3, id: 4 });
    const comb5 = new Combination({ scene: this.scene, x: 0, y: 34 * 4, id: 5 });
    const comb6 = new Combination({ scene: this.scene, x: 0, y: 34 * 5, id: 6 });
    const comb7 = new Combination({ scene: this.scene, x: 0, y: 34 * 6, id: 7 });
    const comb8 = new Combination({ scene: this.scene, x: 0, y: 34 * 7, id: 8 });
    const comb9 = new Combination({ scene: this.scene, x: 0, y: 34 * 8, id: 9 });
    this.combList = [comb1, comb2, comb3, comb4, comb5, comb6, comb7, comb8, comb9];
    this.combinationContainer.add(this.combList);
    this.levelElement = scene.add
      .text(128, 12, ``, {
        fontSize: '22px',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        color: '#13f011',
        letterSpacing: 2,
      })
      .setOrigin(0.5, 0)
      .setResolution(2);
    this.scoreElement = scene.add
      .text(128, 46, ``, {
        fontSize: '22px',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        color: '#13f011',
        letterSpacing: 2,
      })
      .setOrigin(0.5, 0)
      .setResolution(2);
    // const comb1 = new Combination({ scene: this.scene, x: 0, y: 0, id: 1 });
    // const comb2 = new Combination({ scene: this.scene, x: 0, y: 0, id: 1 });

    // const slider = scene.add.graphics();
    // slider.fillStyle(0x444444);
    // slider.fillRect(0, 0, sliderWidth, 4);
    // slider.setInteractive({
    //   hitArea: new Phaser.Geom.Rectangle(0, 0, sliderWidth, 4),
    //   hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    //   useHandCursor: true,
    // });

    // const sliderPoint = scene.add
    //   .circle(startSliderValue * sliderWidth, 2, 5, 0x769be8)
    //   .setInteractive({ draggable: true, useHandCursor: true });

    // slider.on('pointerdown', (_pointer: Phaser.Input.Pointer, localX: number) => {
    //   sliderPoint.x = localX;
    //   const volume = Math.round((localX * 100) / sliderWidth) / 100;
    //   this.emit('volum-updated', volume);
    // });

    // sliderPoint.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number) => {
    //   const clampedX = Phaser.Math.Clamp(dragX, 0, sliderWidth);
    //   sliderPoint.x = clampedX;
    //   const volume = Math.round((clampedX * 100) / sliderWidth) / 100;
    //   this.emit('volum-updated', volume);
    // });

    // sliderContainer.add([slider, sliderPoint]);
    console.log((224 * COEF - 224) / 2);
    const levelBanner = this.scene.add.image(112, 43, 'levelBanner').setDisplaySize(224, 86);
    this.add([
      // bg,
      // this.labelElement,

      this.button,
      this.combinationContainer,
      levelBanner,
      this.levelElement,
      this.scoreElement,
    ]);
    this.setVisible(false);
    // scene.add.existing(this);
  }
}
