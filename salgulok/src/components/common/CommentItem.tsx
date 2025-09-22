// components/common/CommentItem.tsx
import React from "react";
import styled from "styled-components";
import PresignedImage from "./PresignedImage";
import DefaultProfileImage from "../../assets/common/profile_default.svg?react";
import { formatKst } from "../../utils/date";

// 범용 댓글 타입 정의
export interface BaseComment {
  id: number;
  authorId: number;
  username: string;
  content: string;
  createdAt: string;
  authorProfileImg?: string;
}

type Props = {
  comment: BaseComment;
  onDelete?: (commentId: number) => void;
  canDelete?: boolean; // 삭제 가능 여부 (본인 댓글인지)
};

const CommentItem: React.FC<Props> = ({ comment, onDelete, canDelete = false }) => {
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
            <PresignedImage objectKey={comment.authorProfileImg} alt={comment.username} />
          ) : (
            <DefaultProfileImage aria-hidden="true" />
          )}
        </ProfileImage>
        
        <CommentInfo>
          <AuthorName>{comment.username}</AuthorName>
          <CommentDate>{formatKst(comment.createdAt)}</CommentDate>
        </CommentInfo>
        
        {canDelete && (
          <MenuButton onClick={handleDelete} aria-label="댓글 삭제">
            ⋮
          </MenuButton>
        )}
      </Header>
      
      <CommentContent>{comment.content}</CommentContent>
    </Container>
  );
};

export default CommentItem;

// ===== 스타일 =====
const Container = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
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
  font-family: "Pretendard", sans-serif;
`;

const CommentDate = styled.div`
  font-size: 12px;
  color: var(--gray-300);
  font-family: "Pretendard", sans-serif;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto; /* 오른쪽 끝으로 밀기 */
  
  &:hover {
    background-color: #f5f5f5;
    color: #666;
  }
`;

const CommentContent = styled.div`
  font-size: 13px;
  line-height: 1.4;
  color: #333;
  margin-left: 40px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-family: "Pretendard", sans-serif;
`;
