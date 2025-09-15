// pages/community/CommunityDetailPage.tsx
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/common/Header";
import type { Post, Comment } from "../../types/post";

// 더미 데이터
const dummyPost: Post = {
  id: 1,
  user: "월버",
  date: "2025.08.10",
  location: "제주",
  avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  content:
    "세화 해변에 스노클링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노클링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노클링 장비 빌릴 수 있는 곳 있나요?",
  comments: 2, // 실제 댓글 개수
};

const dummyComments: Comment[] = [
  {
    id: 1,
    postId: 1,
    user: "월버",
    date: "2분 전",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    content: "세화 해변에 스노클링 장비 빌릴 수 있는 곳 있나요?",
  },
  {
    id: 2,
    postId: 1,
    user: "월버",
    date: "2분 전",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    content:
      "세화 해변에 스노클링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노클링 장비 빌릴 수 있는 곳 있나요?",
  },
];

const CommunityDetailPage = () => {
  //const { postId } = useParams();
  const post = dummyPost;
  const comments = dummyComments;

  return (

    <Layout>
         <Header title="커뮤니티" showBackButton={true} />
         <Wrap>
       
      {/* 게시글 */}
      <PostSection>
        <HeaderPost>
          <Avatar src={post.avatar} alt={post.user} />
          <div>
            <User>{post.user}</User>
            <Meta>
              {post.date} · {post.location}
            </Meta>
          </div>
          <Menu>⋮</Menu> {/* 👈 메뉴 버튼 추가 */}
        </HeaderPost>
        <Body>{post.content}</Body>
      </PostSection>

      {/* 댓글 */}
      <CommentTitle>댓글 {post.comments}</CommentTitle>
      {comments.map((c) => (
        <CommentBox key={c.id}>
          <HeaderPost>
            <Avatar src={c.avatar} alt={c.user} />
            <div>
              <User>{c.user}</User>
              <Meta>{c.date}</Meta>
            </div>
            <Menu>⋮</Menu> {/* 👈 메뉴 버튼 추가 */}
          </HeaderPost>
          <CommentBody>{c.content}</CommentBody>
        </CommentBox>
      ))}
    </Wrap>
    </Layout>
    
  );
};

export default CommunityDetailPage;

// style
const Layout = styled.div`
  position: relative;
  background: var(--white);
  min-height: 100vh;
  margin: 0 auto;
  max-width: 375px;
  padding-bottom: 120px;
`;

const Wrap = styled.div`
  max-width: 375px;
  margin: 0 auto;
  padding: 16px 20px 100px;
`;

const PostSection = styled.div`
  border-bottom: 1px solid var(--gray-100);
  padding-bottom: 16px;
  margin-bottom: 16px;
`;

const HeaderPost = styled.div`
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

const User = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const Meta = styled.div`
  font-size: 12px;
  color: var(--gray-300);
  margin-top: 2px;
`;

const Body = styled.p`
  font-size: 13px;
  line-height: 1.6;
  margin-top: 12px;
`;

const CommentTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  margin: 16px 0 8px;
`;

const CommentBox = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid var(--gray-100);
`;

const CommentBody = styled.p`
  font-size: 13px;
  margin-left: 48px; /* 아바타 오른쪽 정렬 유지 */
  margin-top: 6px;
`;

const Menu = styled.div`
  font-size: 18px;
  color: var(--gray-400);
  cursor: pointer;
  margin-left: auto; /* 아바타+텍스트 오른쪽 끝으로 밀기 */
`;
