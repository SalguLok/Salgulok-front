import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import NavigationBar from "../../components/common/NavigationBar";
import BottomButton from "../../components/common/BottomButton";
import Header from "../../components/common/Header";
import CommentSvg from "../../assets/common/comment.svg";

const dummyPosts = [
  {
    id: 1,
    user: "월버",
    date: "2025.08.10 제주",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg", // 예시 이미지
    content:
      "세화 해변에 스노쿨링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노쿨링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노쿨링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노쿨링 장비 빌릴 수 있는 곳 있나요?",
    comments: 25,
    isHot: true,
  },
  
  {
    id: 2,
    user: "월버",
    date: "2025.08.10 제주",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    content:
      "세화 해변에 스노쿨링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노쿨링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노쿨링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노쿨링 장비 빌릴 수 있는 곳 있나요?",
    comments: 25,
    isHot: true,
  },
];

const CommunityPage = () => {
  const navigate = useNavigate();
  
  return (
    <>
    <Container>
      <Header title="커뮤니티" />
      <Banner>
        <BannerText>
          <BannerTitle>제주, 전체 주제</BannerTitle>
          <BannerSub>여행 예정 350명, 여행 중 137명</BannerSub>
        </BannerText>
        <BannerRight>여행 중인 사람만</BannerRight>
        <BannerImage src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" alt="제주" />
      </Banner>
      <PostList>
        {dummyPosts.map((post) => (
          <PostItem key={post.id}>
            <PostHeader>
              <Avatar src={post.avatar} alt={post.user} />
              <PostInfo>
                <PostUser>{post.user}</PostUser>
                <PostMeta>{post.date}</PostMeta>
              </PostInfo>
              <PostMenu>⋮</PostMenu>
            </PostHeader>
            <PostContent>{post.content}</PostContent>
            <PostFooter>
              <CommentGroup>
                <CommentIcon>
                <img src={CommentSvg} alt="댓글" width={15} height={15} />
                </CommentIcon>
                <CommentCount>{post.comments}</CommentCount>
                <HotBadge>맛집</HotBadge>
              </CommentGroup>
            </PostFooter>
          </PostItem>
        ))}
      </PostList>
      <WriteButton>
        <BottomButton text="+ 글 작성" onClick={() => navigate("/community/WritePage")} />
      </WriteButton>
      </Container>
      <NavigationBar />
    </>
  );
};

export default CommunityPage;

// 스타일 정의
const Container = styled.div`
  background: var(--white);
  min-height: 100vh;
  padding-bottom: 120px; /* 하단 버튼/네비 공간 확보 */
`;

const Banner = styled.div`
  position: relative;
  margin: 20px 0 16px 0;
  height: 160px;
  background: #eee;
  overflow: hidden;
`;

const BannerText = styled.div`
  position: absolute;
  left: 24px;
  top: 24px;
  z-index: 2;
`;

const BannerTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const BannerSub = styled.div`
  font-size: 11px;
  color: var(--black);
`;

const BannerRight = styled.div`
  position: absolute;
  right: 24px;
  top: 24px;
  font-size: 14px;
  color: var(--black);
`;

const BannerImage = styled.img`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.95);
`;

const PostList = styled.div`
  margin: 0 0 80px 0;
`;

const PostItem = styled.div`
  background: var(--white);
  border-bottom: 1px solid var(--gray-100);
  padding: 20px;
`;

const PostHeader = styled.div`
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

const PostInfo = styled.div`
  flex: 1;
`;

const PostUser = styled.div`
  font-weight: 500;
  font-size: 13px;
`;

const PostMeta = styled.div`
  font-size: 11px;
  color: var(--gray-300);
`;

const PostMenu = styled.div`
  font-size: 20px;
  color: var(--gray-300);
  cursor: pointer;
`;

const PostContent = styled.div`
  font-size: 13px;
  margin-bottom: 12px;
  color: var(--black);
`;

const PostFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
`;
const CommentGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CommentIcon = styled.span`
  font-size: 15px;
`;

const CommentCount = styled.span`
  font-size: 13px;
  color: var(--black);
`;

const HotBadge = styled.span`
  margin-left: auto;
  padding: 2px 12px;
  border-radius: 16px;
  background: var(--main-pri);
  color: var(--white);
  font-size: 14px;
  font-weight: 600;
`;

const WriteButton = styled.div`
  position: absolute;
  bottom: 80px;
  right: 24px;  
  z-index: 100;
`;


