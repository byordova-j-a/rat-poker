import type { Level } from '~/game/scenes/Level';
import { EMouseColor } from '~/game/types';

export function getMouseColor(this: Level) {
  const totalProbability = this.mouseProbabilityConf.reduce(
    (acc, probability) => (acc = acc + probability.weight),
    0
  );

  const random = Math.random() * totalProbability;

  let currentSum = 0;
  let isColorSetted = false;
  let mouseColor = EMouseColor.RED;

  this.mouseProbabilityConf.forEach(probability => {
    currentSum = currentSum + probability.weight;
    if (random < currentSum && !isColorSetted) {
      probability.weight = Math.max(1, probability.weight - Math.floor(Math.random() * 5));
      mouseColor = probability.key;
      isColorSetted = true;
    } else {
      probability.weight = probability.weight + Math.floor(Math.random() * 3);
    }
  });
  return mouseColor;
}
