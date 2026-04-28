export type CommentAuthor = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  subscribersCount?: number;
  isVerified?: boolean;
};

export type PostComment = {
  id: string;
  postId: string;
  author: CommentAuthor;
  text: string;
  likesCount?: number;
  isLiked?: boolean;
  createdAt: string;
};

export type PostCommentsPage = {
  comments: PostComment[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type PostCommentsResponse = {
  ok: boolean;
  data: PostCommentsPage;
};
