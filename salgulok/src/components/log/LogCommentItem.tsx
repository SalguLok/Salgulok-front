// components/log/LogCommentItem.tsx
import React from "react";
import styled from "styled-components";
import type { LogCommentResponse } from "../../api/log/logComment";
import PresignedImage from "../common/PresignedImage";
import DefaultProfileImage from "../../assets/common/profile_default.svg?react";
import { formatKst } from "../../utils/date";

type Props = {
  comment: LogCommentResponse;
  onDelete?: (commentId: number) => void;
  canDelete?: boolean; // 삭제 가능 여부 (본인 댓글인지)
};

const LogCommentItem: React.FC<Props> = ({ comment, onDelete, canDelete = false }) => {
  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      onDelete?.(comment.id);
    }
  };

  return (
    <Container>
      <Header>
        <ProfileImage>
          {comment.authorProfileImg ? (
            <PresignedImage 
              src={comment.authorProfileImg} 
              alt={comment.authorName} 
            />
          ) : (
            <DefaultProfileImage aria-hidden="true" />
          )}
        </ProfileImage>
        <CommentInfo>
          <AuthorName>{comment.authorName}</AuthorName>
          <CommentDate>
            {formatKst(comment.createdAt)}
          </CommentDate>
        </CommentInfo>
        {canDelete && (
          <DeleteButton 
            onClick={handleDelete}
            title="댓글 삭제"
          >
            삭제
          </DeleteButton>
        )}
      </Header>
      <CommentContent>{comment.content}</CommentContent>
    </Container>
  );
};

export default LogCommentItem;

const Container = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const ProfileImage = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  
  img, svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CommentInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #222;
`;

const CommentDate = styled.div`
  font-size: 12px;
  color: #888;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: #ffeaea;
  }
`;

const CommentContent = styled.div`
  font-size: 14px;
  line-height: 1.4;
  color: #333;
  margin-left: 40px;
`;
