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
    createdAt: new Date().toISOString(), // Community 댓글에는 날짜 정보가 없으므로 현재 시간 사용
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
