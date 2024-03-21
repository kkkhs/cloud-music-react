// 歌手列表
export interface Singer {
  id: number;
  name: string;
  img1v1Url: string;
  picUrl: string;
  fansGroup: { text: string };
}

// 歌手详情页
export interface Artist {
  artist: {
    id: number;
    name: string;
    cover: string;
    avatar?: string;
    alias?: string[];
    identify?: { imageDesc: string };
    identities?: string[];
    identifyTag?: string[];
    briefDesc?: string;
    musicSize?: number;
  };
  identify: {
    imageUrl: string;
    imageDesc: string;
    actionUrl: string;
  };
  videoCount: number;
  user: {};
}

export interface Follows {
  fansCnt: string;
}
