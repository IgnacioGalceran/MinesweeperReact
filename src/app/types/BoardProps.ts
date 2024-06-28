import { Levels } from "./Levels";

export type BoardProps = {
  props: Levels;
  state: {
    setIsPlaying: any;
    setIsGameOver: any;
    isPlaying: boolean;
    isGameOver: boolean;
    wonGame: boolean;
    setWonGame: any;
  };
};
