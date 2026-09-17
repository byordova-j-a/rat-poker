export const GameState: {
  mainScene: string;
  launchedScene: string | null;
  setLaunchedScene: (val: string | null) => void;
  setMainScene: (val: string) => void;
  currentLevel: number | null;
  levelList: { id: number; score: number; isAvailable: boolean; preview: string }[];
  showedLevel: number | null;
} = {
  mainScene: 'MainMenu',
  launchedScene: null,
  currentLevel: null,
  showedLevel: null,
  levelList: [
    { id: 1, score: 0, isAvailable: true, preview: '' },
    { id: 2, score: 0, isAvailable: false, preview: '' },
    { id: 3, score: 0, isAvailable: false, preview: '' },
    { id: 4, score: 0, isAvailable: false, preview: '' },
    { id: 5, score: 0, isAvailable: false, preview: '' },
    { id: 6, score: 0, isAvailable: false, preview: '' },
    { id: 7, score: 0, isAvailable: false, preview: '' },
    { id: 8, score: 0, isAvailable: false, preview: '' },
    { id: 9, score: 0, isAvailable: false, preview: '' },
    { id: 10, score: 0, isAvailable: false, preview: '' },
    { id: 11, score: 0, isAvailable: false, preview: '' },
    { id: 12, score: 0, isAvailable: false, preview: '' },
    { id: 13, score: 0, isAvailable: false, preview: '' },
    { id: 14, score: 0, isAvailable: false, preview: '' },
    { id: 15, score: 0, isAvailable: false, preview: '' },
    { id: 16, score: 0, isAvailable: false, preview: '' },
    { id: 17, score: 0, isAvailable: false, preview: '' },
    { id: 18, score: 0, isAvailable: false, preview: '' },
    { id: 19, score: 0, isAvailable: false, preview: '' },
    { id: 20, score: 0, isAvailable: false, preview: '' },
  ],
  setMainScene(newScene: string) {
    this.mainScene = newScene;
  },
  setLaunchedScene(newScene: string | null) {
    this.launchedScene = newScene;
  },
};
