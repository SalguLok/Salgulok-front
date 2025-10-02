// src/components/common/PostCard.tsx
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { getCommentsByPostId } from "../../api/community/community";
import CommentSvg from "../../assets/common/comment.svg";
import DefaultProfileImage from "../../assets/common/my_gray.svg";
import PresignedImage from "./PresignedImage";
import type { Post } from "../../types/post";

type Props = {
  post: Post;
  onClick?: (id: number) => void;
  onMenuClick?: (id: number) => void;
  canDelete?: boolean; // 삭제 가능 여부 (본인 글인지)
};

const Card = styled.div<{ clickable?: boolean }>`
  padding: 18px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: var(--white);
  cursor: ${({ clickable }) => (clickable ? "pointer" : "default")};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  margin-bottom: 8px;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  object-fit: cover;
`;

const AvatarPresigned = styled(PresignedImage)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  object-fit: cover;
`;

const Info = styled.div`
  flex: 1;
`;

const User = styled.div`
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 3px;
  color: #222;
  font-family: "Pretendard", sans-serif;
`;

const Meta = styled.div`
  font-size: 12px;
  margin-top: 3px;
  color: var(--gray-300);
  font-family: "Pretendard", sans-serif;
`;

const Menu = styled.button`
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
  margin-left: auto;
  
  &:hover {
    background-color: #f5f5f5;
    color: #666;
  }
`;

const Content = styled.div`
  font-size: 13px;
  line-height: 1.4;
  color: #333;
  margin-left: 40px;
  margin-top: 13px;
  margin-bottom: 10px;
  font-family: "Pretendard", sans-serif;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  margin-left: 40px;
`;

const CommentIcon = styled.span`
  display: flex;
  align-items: center;
`;

const Badge = styled.span`
  padding: 2px 11px;
  border-radius: 25px;
  border: 0.5px solid var(--main-pri);
  color: var(--main-pri);
  font-size: 12px;
`;

const CommentCount = styled.span`
  font-size: 13px;
  line-height: 1;
  font-family: "Pretendard", sans-serif;
  color: var(--black);
`;

export default function PostCard({ post, onClick, onMenuClick, canDelete = false }: Props) {
  const handleClick = () => onClick?.(post.id);
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMenuClick?.(post.id);
  };

  const { data: comments } = useQuery({
    queryKey: ["communityComments", post.id],
    queryFn: () => getCommentsByPostId(post.id),
    enabled: !!post.id,
  });

  return (
    <Card clickable={!!onClick} onClick={handleClick} role={onClick ? "button" : undefined}>
      <Header>
        {post.avatar ? (
          <AvatarPresigned objectKey={post.avatar} alt={post.user} />
        ) : (
          <Avatar src={DefaultProfileImage} alt={post.user} />
        )}
        <Info>
          <User>{post.user}</User>
          <Meta>{post.date}</Meta>
        </Info>
        {canDelete && (
          <Menu onClick={handleMenuClick}>⋮</Menu>
        )}
      </Header>

      <Content>{post.content}</Content>

      <Footer>
        <CommentIcon>
          <img src={CommentSvg} alt="댓글" width={15} height={15} />
        </CommentIcon>
        <CommentCount>{comments?.content?.length ?? 0}</CommentCount>
        {post.topic && <Badge>{post.topic}</Badge>}
      </Footer>
    </Card>
  );
}