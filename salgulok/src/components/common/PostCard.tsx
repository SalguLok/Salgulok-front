// src/pages/community/PostCard.tsx
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { getCommentsByPostId } from "../../api/community/community";
import CommentSvg from "../../assets/common/comment.svg";
import type { Post } from "../../types/post";

type Props = {
  post: Post;
  onClick?: (id: number) => void;
};

const Card = styled.div<{ clickable?: boolean }>`
  padding: 20px;
  border-bottom: 1px solid var(--gray-100);
  background: var(--white);
  cursor: ${({ clickable }) => (clickable ? "pointer" : "default")};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;
const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
`;
const Info = styled.div`
  flex: 1;
`;
const User = styled.div`
  font-weight: 500;
  font-size: 13px;
`;
const Meta = styled.div`
  font-size: 11px;
  color: var(--gray-300);
`;
const Menu = styled.div`
  font-size: 20px;
  color: var(--gray-300);
`;

const Content = styled.div`
  font-size: 13px;
  color: var(--black);
  margin-bottom: 12px;
`;
const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
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
  font-size: 13px; /* ← 여기서 크기 조절 */
  line-height: 1;
  font-family: "pretendard", sans-serif;
  color: var(--black);
`;

export default function PostCard({ post, onClick }: Props) {
  const handleClick = () => onClick?.(post.id);

  const { data: comments } = useQuery({
    queryKey: ["communityComments", post.id],
    queryFn: () => getCommentsByPostId(post.id),
    enabled: !!post.id,
  });

  return (
    <Card clickable={!!onClick} onClick={handleClick} role={onClick ? "button" : undefined}>
      <Header>
        <Avatar src={post.avatar} alt={post.user} />
        <Info>
          <User>{post.user}</User>
          <Meta>{post.date}</Meta>
        </Info>
        <Menu>⋮</Menu>
      </Header>

      <Content>{post.content}</Content>

      <Footer>
        <CommentIcon>
          <img src={CommentSvg} alt="댓글" width={15} height={15} />
        </CommentIcon>
        <CommentCount>{comments?.length ?? 0}</CommentCount>
        {post.topic && <Badge>{post.topic}</Badge>}
      </Footer>
    </Card>
  );
}
