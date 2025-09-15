// components/community/PostCard.tsx
import styled from "styled-components";
import Card from "../../components/common/Card";

export type Post = {
  id: number;
  user: string;
  date: string;
  avatar: string;
  content: string;
  comments: number;
  isHot?: boolean;
};

type Props = {
  post: Post;
  onClick?: (id: number) => void;
};

const PostCard = ({ post, onClick }: Props) => (
  <Card clickable onClick={() => onClick?.(post.id)}>
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
      <span>💬 {post.comments}</span>
      {post.isHot && <Badge>맛집</Badge>}
    </Footer>
  </Card>
);

export default PostCard;

const Header = styled.div`display:flex;align-items:center;margin-bottom:8px;`;
const Avatar = styled.img`width:36px;height:36px;border-radius:50%;margin-right:12px;`;
const Info = styled.div`flex:1;`;
const User = styled.div`font-size:13px;font-weight:600;`;
const Meta = styled.div`font-size:11px;color:var(--gray-300);`;
const Menu = styled.div`font-size:20px;color:var(--gray-300);`;
const Content = styled.div`font-size:13px;color:var(--black);margin:8px 0 12px;`;
const Footer = styled.div`display:flex;gap:8px;align-items:center;justify-content:flex-end;`;
const Badge = styled.span`
  margin-left:auto;padding:2px 11px;border-radius:25px;
  border:0.5px solid var(--main-pri);color:var(--main-pri);font-size:12px;
`;
