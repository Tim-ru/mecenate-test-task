import { type InfiniteData } from '@tanstack/react-query';
import { type PostComment, type PostCommentsPage } from '@/features/comments/model/types';

export function dedupeCommentsById(comments: PostComment[]) {
  const seen = new Set<string>();

  return comments.filter((comment) => {
    if (seen.has(comment.id)) {
      return false;
    }

    seen.add(comment.id);
    return true;
  });
}

export function prependCommentToPages(
  oldData: InfiniteData<PostCommentsPage> | undefined,
  comment: PostComment,
) {
  if (!oldData) {
    return oldData;
  }

  if (oldData.pages.length === 0) {
    return {
      ...oldData,
      pages: [{ comments: [comment], hasMore: false, nextCursor: null }],
    };
  }

  const firstPage = oldData.pages[0];
  const alreadyExists = oldData.pages.some((page) =>
    page.comments.some((existingComment) => existingComment.id === comment.id),
  );
  if (alreadyExists) {
    return oldData;
  }

  return {
    ...oldData,
    pages: [
      {
        ...firstPage,
        comments: [comment, ...firstPage.comments],
      },
      ...oldData.pages.slice(1),
    ],
  };
}
