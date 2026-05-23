import { TLocation } from '~/game/types';

export const compareTwoPositions = (positon1: TLocation, position2: TLocation) => {
  if (positon1.x === position2.x && positon1.y === position2.y) return true;
  return false;
};
