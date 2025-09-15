import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/common/NavigationBar";
import Header from "../../components/common/Header";
import PostCard from "../../components/common/PostCard";
import type { Post } from "../../types/post";


const dummyPosts: Post[] = [
  {
    id: 1,
    user: "월버",
    date: "2025.08.10",
    location: "제주",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    content:
      "세화 해변에 스노쿨링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노쿨링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노쿨링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노쿨링 장비 빌릴 수 있는 곳 있나요?",
    comments: 25,
    isHot: true,
  },
  {
    id: 2,
    user: "월버",
    date: "2025.08.10",
    location: "제주",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    content:
      "세화 해변에 스노쿨링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노쿨링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노쿨링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노쿨링 장비 빌릴 수 있는 곳 있나요?",
    comments: 25,
    isHot: true,
  },
];

const CommunityPage = () => {
  
  const navigate = useNavigate();
  const goDetail = (id: number) => navigate(`/community/${id}`);

  return (
    <>
    <Layout>
      <Header title="커뮤니티" />
      <Banner>
        <BannerText>
          <BannerTitle>제주, 전체 주제</BannerTitle>
          <BannerSub>여행 예정 350명, 여행 중 137명</BannerSub>
        </BannerText>
        <BannerRight>여행 중인 사람만</BannerRight>
        <BannerImage src="https://mblogthumb-phinf.pstatic.net/MjAyNDA2MThfMTMx/MDAxNzE4Njc0MDcwMTM5.39fnbeAr2b_0HiCDOfeAaa31R_Zf33CDSmokYr3hg7sg.igWNKGclsAXMUN1m5JpgiJwMrucJGotyKNKmhQLL-40g.JPEG/%EC%BD%94%EB%82%9C%ED%95%B4%EB%B3%8020.JPG?type=w800" alt="제주" />
      </Banner>
      <PostList>
        {dummyPosts.map((post) => (
          <PostCard key={post.id} post={post} onClick={() => goDetail(post.id)} />
        ))}
      </PostList>
      </Layout>
      
    <WriteButton onClick={() => navigate('/community/WritePage')}>
      <Plus>＋</Plus>
      글 작성
    </WriteButton>
    
    <NavigationBar />
     
    </>
  );
};

export default CommunityPage;


const Layout = styled.div`
  position: relative;
  background: var(--white);
  min-height: 100vh;
  margin: 0 auto;
  max-width: 375px;
  padding-bottom: 120px;
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
  font-family: 'pretendard', sans-serif;
  z-index: 2;
`;

const BannerTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  font-family: 'pretendard', sans-serif;
  margin-bottom: 8px;
`;

const BannerSub = styled.div`
  font-size: 11px;
  color: var(--black);
  font-family: 'pretendard', sans-serif;
`;

const BannerRight = styled.div`
  position: absolute;
  right: 24px;
  top: 24px;
  font-size: 14px;
  color: var(--black);
  font-family: 'pretendard', sans-serif;
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

const NAV_H = 76;         // 네비게이션 높이(프로젝트 값에 맞춰 조정)
const APP_W = 375;        // 프레임 너비

const WriteButton = styled.button`
  position: fixed;                             /* ✅ 스크롤해도 고정 */
  z-index: 1100;
  bottom: calc(${NAV_H}px + env(safe-area-inset-bottom) + 16px);

  /* 데스크톱에서도 '폰 프레임' 안쪽 오른쪽에 붙이기 */
  left: calc(50% + ${APP_W}px / 2 - 16px - 76px); /* 프레임 오른쪽 - 여백 - 버튼폭 */
  right: auto;

  @media (max-width: ${APP_W + 40}px) {
    left: auto; right: 16px;                   /* 작은 화면에선 일반 방식 */
  }

  width: 76px;
  height: 36px;
  padding: 0;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  border: none; border-radius: 20px;
  background: var(--main-pri); color: #fff;
  font-size: 13px; font-weight: 500; font-family: 'pretendard', sans-serif;
  cursor: pointer;
`;

const Plus = styled.span`
  font-size: 11px;
  line-height: 1;
  font-family: 'pretendard', sans-serif;
`;
