import { Levels } from "./Levels";

export type BoardProps = {
  props: Levels;
  state: {
    setIsPlaying: any;
    isPlaying: boolean;
  };
};
