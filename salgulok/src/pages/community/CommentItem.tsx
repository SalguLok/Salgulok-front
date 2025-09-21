// pages/community/CommentItem.tsx
import CommentItemComponent, { type BaseComment } from "../../components/common/CommentItem";
import type { CommentResponse } from "../../api/community/community";

type Props = { 
  comment: CommentResponse;
  onDelete?: (commentId: number) => void;
  canDelete?: boolean;
};

export default function CommentItem({ comment, onDelete, canDelete = false }: Props) {
  // CommentResponse를 BaseComment로 변환
  const baseComment: BaseComment = {
    id: comment.id,
    authorId: comment.authorId,
    username: comment.username,
    content: comment.content,
    createdAt: comment.createdAt || new Date().toISOString(), // 서버 시간이 있으면 사용, 없으면 현재 시간
    authorProfileImg: comment.authorProfileImg,
  };

  return (
    <CommentItemComponent 
      comment={baseComment}
      onDelete={onDelete}
      canDelete={canDelete}
    />
  );
}
