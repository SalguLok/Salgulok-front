// components/log/LogCommentSection.tsx
import React from "react";
import styled from "styled-components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLogComments, createLogComment, deleteLogComment } from "../../api/log/logComment";
import LogCommentList from "./LogCommentList";
import CommentInputBar from "../common/CommentInputBar";

type Props = {
  logId: number;
  currentUserId?: number; // 현재 로그인한 사용자 ID
};

const LogCommentSection: React.FC<Props> = ({ logId, currentUserId }) => {
  const queryClient = useQueryClient();

  // 댓글 목록 조회
  const { data: commentsData, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["logComments", logId],
    queryFn: () => getLogComments(logId, { page: 0, size: 20, sort: 'createdAt' }),
    enabled: !!logId,
  });

  const comments = commentsData?.content || [];

  // 댓글 생성 뮤테이션
  const createCommentMutation = useMutation({
    mutationFn: ({ content }: { content: string }) => {
      console.log("[댓글생성] API 호출", { logId, content });
      return createLogComment(logId, { content });
    },
    onSuccess: (data) => {
      console.log("[댓글생성] 성공", data);
      queryClient.invalidateQueries({ queryKey: ["logComments", logId] });
    },
    onError: (error) => {
      console.error("[댓글생성] 실패:", error);
      // @ts-ignore
      const status = error?.response?.status;
      // @ts-ignore
      const data = error?.response?.data;
      console.error("[댓글생성] 상세 에러:", { logId, status, data, error });
      alert(`댓글 생성에 실패했습니다. ${status ? `(${status})` : ""}`);
    },
  });

  // 댓글 삭제 뮤테이션
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => {
      console.log("[댓글삭제] mutate 호출", { logId, commentId });
      return deleteLogComment(logId, commentId);
    },
    onSuccess: (_, commentId) => {
      console.log("[댓글삭제] 성공", { logId, commentId });
      alert("댓글이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["logComments", logId] });
    },
    onError: (error, commentId) => {
      // @ts-ignore
      const status = error?.response?.status;
      // @ts-ignore
      const data = error?.response?.data;
      console.error("[댓글삭제] 실패", { logId, commentId, status, data, error });
      alert(`댓글 삭제에 실패했습니다. ${status ? `(${status})` : ""}`);
    }
  });

  const handleCreateComment = (content: string) => {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    createCommentMutation.mutate({ content: trimmedContent });
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(commentId);
  };

  return (
    <Container>
      <CommentsHeader>
        댓글 {comments.length}개
      </CommentsHeader>
      
      <LogCommentList
        comments={comments}
        currentUserId={currentUserId}
        onDeleteComment={handleDeleteComment}
        isLoading={isCommentsLoading}
      />

      <CommentInputWrapper>
        <CommentInputBar 
          placeholder="댓글을 입력하세요..."
          onSubmit={handleCreateComment}
          disabled={createCommentMutation.isPending}
        />
      </CommentInputWrapper>
    </Container>
  );
};

export default LogCommentSection;

const Container = styled.div`
  border-top: 1px solid #eee;
  padding-top: 20px;
`;

const CommentsHeader = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin: 0 0 16px 0;
  font-family: "Pretendard", sans-serif;
`;

const CommentInputWrapper = styled.div`
  margin-top: 20px;
  padding-top: 16px;
`;
