// components/log/LogCommentItem.tsx
import React from "react";
import CommentItem, { type BaseComment } from "../common/CommentItem";
import type { LogCommentResponse } from "../../api/log/logComment";

type Props = {
  comment: LogCommentResponse;
  onDelete?: (commentId: number) => void;
  canDelete?: boolean; // 삭제 가능 여부 (본인 댓글인지)
};

const LogCommentItem: React.FC<Props> = ({ comment, onDelete, canDelete = false }) => {
  // LogCommentResponse를 BaseComment로 변환
  const baseComment: BaseComment = {
    id: comment.id,
    authorId: comment.authorId,
    username: comment.authorName, // LogCommentResponse는 authorName 필드 사용
    content: comment.content,
    createdAt: comment.createdAt,
    authorProfileImg: comment.authorProfileImg,
  };

  return (
    <CommentItem 
      comment={baseComment}
      onDelete={onDelete}
      canDelete={canDelete}
    />
  );
};

export default LogCommentItem;