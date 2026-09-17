import { EMouseType, EMoveType } from '~/game/types';

export const NONE = { x: 0, y: 0 };
export const RIGHT = { x: 1, y: 0 };
export const LEFT = { x: -1, y: 0 };
export const UP = { x: 0, y: -1 };
export const DOWN = { x: 0, y: 1 };

export const GAME_TICK_1 = 500;
export const GAME_TICK_2 = 300;

export const HEADER_HEIGHT = 60;
// export const VIEWPORT_MARGIN = 6.75;
// export const VIEPORT_SIZE = 526.5;
export const VIEWPORT_MARGIN = 6;
export const VIEPORT_SIZE = 526;
export const COEF = 1.345;

export const BUTTON_PADDING = 10;
export const BUTTON_DEFAULT_FONT_SIZE = 20;

export const MOUSE_FRAMES_CONFIG = {
  [EMouseType.EMPTY]: {
    [EMoveType.RUN]: {
      start: 0,
      end: 4,
    },
    [EMoveType.JUMP]: {
      start: 5,
      end: 8,
    },
    [EMoveType.STAND]: {
      start: 0,
      end: 0,
    },
  },
  [EMouseType.MINUS]: {
    [EMoveType.RUN]: {
      start: 9,
      end: 13,
    },
    [EMoveType.JUMP]: {
      start: 14,
      end: 17,
    },
    [EMoveType.STAND]: {
      start: 9,
      end: 9,
    },
  },
  [EMouseType.PLUS]: {
    [EMoveType.RUN]: {
      start: 18,
      end: 22,
    },
    [EMoveType.JUMP]: {
      start: 23,
      end: 26,
    },
    [EMoveType.STAND]: {
      start: 18,
      end: 18,
    },
  },
};
