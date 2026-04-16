import { type Post } from '@/entities/post/model/types';

export type Comment = {
  id: string;
  postId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    bio?: string;
    subscribersCount?: number;
    isVerified?: boolean;
  };
  text: string;
  likesCount?: number;
  isLiked?: boolean;
  createdAt: string;
};

export type PostDetailResponse = {
  ok: boolean;
  data: {
    post: Post;
  };
};

export type LikeResponse = {
  ok: boolean;
  data: {
    isLiked: boolean;
    likesCount: number;
  };
};

export type CommentsResponse = {
  ok: boolean;
  data: {
    comments: Comment[];
    nextCursor: string | null;
    hasMore: boolean;
  };
};
