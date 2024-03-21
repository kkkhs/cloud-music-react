export interface Song {
  id: number;
  name: string;
  fee: number;
  awardName: string;
  dt: number;
  lyric: string;
  al: {
    id: number;
    name: string;
    picUrl: string;
  };
  ar: {
    id: string;
    name: string;
  }[];
}
