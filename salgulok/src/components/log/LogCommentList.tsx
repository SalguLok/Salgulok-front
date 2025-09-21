// components/log/LogCommentList.tsx
import React from "react";
import styled from "styled-components";
import type { LogCommentResponse } from "../../api/log/logComment";
import LogCommentItem from "./LogCommentItem";

type Props = {
  comments: LogCommentResponse[];
  currentUserId?: number; // 현재 로그인한 사용자 ID
  onDeleteComment?: (commentId: number) => void;
  isLoading?: boolean;
};

const LogCommentList: React.FC<Props> = ({ 
  comments, 
  currentUserId, 
  onDeleteComment, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Container>
        <LoadingText>댓글을 불러오는 중...</LoadingText>
      </Container>
    );
  }

  if (comments.length === 0) {
    return (
      <Container>
        <EmptyText>아직 댓글이 없습니다.</EmptyText>
      </Container>
    );
  }

  return (
    <Container>
      <CommentsList>
        {comments.map((comment) => (
          <LogCommentItem
            key={comment.id}
            comment={comment}
            canDelete={currentUserId === comment.authorId}
            onDelete={onDeleteComment}
          />
        ))}
      </CommentsList>
    </Container>
  );
};

export default LogCommentList;

const Container = styled.div`
  width: 100%;
`;

const LoadingText = styled.div`
  text-align: center;
  color: #666;
  padding: 20px;
  font-size: 14px;
  font-family: "Pretendard", sans-serif;
`;

const EmptyText = styled.div`
  text-align: center;
  color: #999;
  padding: 40px 20px;
  font-size: 14px;
  font-family: "Pretendard", sans-serif;
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0; /* LogCommentItem에서 border-bottom으로 구분 */
`;
