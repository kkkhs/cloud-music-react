export interface Comment {
  hotComments: CommentContent[];
  total: number;
  cnum: number;
  more: boolean;
}

export interface CommentContent {
  user: CommentUser;
  commentId: number;
  content: string;
  timeStr: string;
  likedCount: number;
}

export interface CommentUser {
  userId: number;
  nickname: string;
  avatarUrl: string;
}
