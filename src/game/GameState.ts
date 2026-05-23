export const GameState: {
  mainScene: string;
  launchedScene: string | null;
  setLaunchedScene: (val: string | null) => void;
  setMainScene: (val: string) => void;
  currentLevel: number | null;
} = {
  mainScene: 'MainMenu',
  launchedScene: null,
  currentLevel: null,
  setMainScene(newScene: string) {
    this.mainScene = newScene;
  },
  setLaunchedScene(newScene: string | null) {
    this.launchedScene = newScene;
  },
};
