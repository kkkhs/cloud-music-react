export interface User {
  userId: number;
  userType: number;
  nickname: string;
  avatarImgId: number;
  avatarUrl: string;
  backgroundImgId: number;
  backgroundUrl: string;
  signature?: null;
  createTime: number;
  userName: string;
  accountType: number;
  gender: number;
  description?: null;
  vipType: number;
  followed: boolean;
  mutual: boolean;
  authenticated: boolean;
  lastLoginTime: number;
  remarkName?: null;
  avatarDetail?: null;
  anchor: boolean;
}
