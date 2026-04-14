export type PostTier = 'free' | 'paid';

export type Author = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  subscribersCount?: number;
  isVerified?: boolean;
};

export type Post = {
  id: string;
  author: Author;
  title: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: PostTier;
  createdAt: string;
  body: string;
};
