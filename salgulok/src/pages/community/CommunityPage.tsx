import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NavigationBar from "../../components/common/NavigationBar";
import HeaderLeft from "../../components/common/HeaderLeft";
import PostCard from "../../components/common/PostCard";
import { getPosts, deletePost } from "../../api/community/community";
import type { GetPostsParams, Topic } from "../../api/community/community";
import DefaultProfileImage from "../../assets/common/my_gray.svg";
import { formatKst } from "../../utils/date";

//region 선택
import BottomSheet from "../../components/common/BottomSheet";
import { Chip, ChipRow } from "../../components/common/Chip";
import dropdown from "../../assets/common/dropdown.svg";
import regions from "../../data/regions"; // regions 데이터 임포트

const topics: Topic[] = ['동행', '맛집', '숙소', '교통', '기타'];

const CommunityPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const goDetail = (id: number) => navigate(`/community/${id}`);
  const [searchParams] = useSearchParams();
  const initialRegionId = searchParams.get("region_id");


  // const [filters, setFilters] = useState<GetPostsParams>({ page: 0, size: 10 });
  const [filters, setFilters] = useState<GetPostsParams>({
    page: 0,
    size: 10,
    regionId: initialRegionId ? parseInt(initialRegionId) : undefined,
  });

  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    const regionIdFromParams = searchParams.get("region_id");
    const newRegionId = regionIdFromParams ? parseInt(regionIdFromParams, 10) : undefined;

    setFilters(prev => {
      if (prev.regionId !== newRegionId) {
        console.log(`CommunityPage: Syncing regionId from URL: ${newRegionId}`);
        return { ...prev, regionId: newRegionId, page: 0 };
      }
      return prev;
    });
  }, [searchParams]);

  const {
    data: postsPage,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["communityPosts", filters],
    queryFn: () => getPosts(filters),
  });

  // 현재 필터에 해당하는 지역 및 주제 이름 찾기
  const currentRegion = regions.find(r => r.id === filters.regionId)?.nameKo ?? "전체 지역";
  const currentTopic = filters.topic ?? "전체 주제";

  // 게시글 삭제 뮤테이션
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      alert("게시글이 삭제되었습니다.");
    },
    onError: (error) => {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제에 실패했습니다.");
    },
  });

  // 더보기 버튼 클릭 핸들러
  const handleMenuClick = (postId: number) => {
    console.log("더보기 버튼 클릭됨, postId:", postId);
    
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 해당 게시글 찾기
    const post = postsPage?.content.find(p => p.id === postId);
    console.log("찾은 게시글:", post);
    
    if (!post) {
      alert("게시글을 찾을 수 없습니다.");
      return;
    }

    // 작성자 본인인지 확인 (userId와 authorId 비교)
    console.log("게시글 작성자 ID:", post.authorId);
    console.log("현재 사용자 ID:", currentUserId);
    const isAuthor = post.authorId === parseInt(currentUserId);
    console.log("작성자 본인 여부:", isAuthor);
    
    if (!isAuthor) {
      alert("본인이 작성한 게시글만 삭제할 수 있습니다.");
      return;
    }

    if (window.confirm("정말 삭제하시겠습니까?")) {
      console.log("삭제 확인됨, 삭제 API 호출");
      deletePostMutation.mutate(postId);
    }
  };

  // 필터 변경 핸들러
  const handleRegionChange = (newRegionId?: number) => {
    setFilters(prev => ({ ...prev, regionId: newRegionId, page: 0 }));
  };

  const handleTopicChange = (newTopic?: Topic) => {
    setFilters(prev => ({ ...prev, topic: newTopic, page: 0 }));
  };

  // const toggleStatus = () => {
  //   setFilters(prev => ({
  //     ...prev,
  //     status: prev.status === 'staying' ? undefined : 'staying',
  //     page: 0,
  //   }));
  // };

  return (
    <>
      <Layout>
        <HeaderLeft title="커뮤니티" />
        <Banner onClick={() => setOpenFilter(true)}>
          <BannerText>
            <BannerTitle>
              {currentRegion}, {currentTopic}
              <Icon>
                <img src={dropdown} alt="dropdown icon" />
              </Icon>
            </BannerTitle>
            <BannerSub>여행 예정 350명, 여행 중 137명</BannerSub>
          </BannerText>
          {/* <StatusButton
            $active={filters.status === 'staying'}
            onClick={(e) => {
              e.stopPropagation(); // 배너 클릭 이벤트 전파 방지
              toggleStatus();
            }}
          >
            여행 중인 사람만
          </StatusButton> */}
          <BannerImage
            src="https://mblogthumb-phinf.pstatic.net/MjAyNDA2MThfMTMx/MDAxNzE4Njc0MDcwMTM5.39fnbeAr2b_0HiCDOfeAaa31R_Zf33CDSmokYr3hg7sg.igWNKGclsAXMUN1m5JpgiJwMrucJGotyKNKmhQLL-40g.JPEG/%EC%BD%94%EB%82%9C%ED%95%B4%EB%B3%8020.JPG?type=w800"
            alt="제주"
          />
        </Banner>
        <PostList>
          {isLoading && <div>로딩 중...</div>}
          {error && <div>에러가 발생했습니다.</div>}
          {(postsPage?.content ?? []).map(post => (
            <PostCard
              key={post.id}
              post={{
                id: post.id,
                user: post.username ?? '익명',
                date: formatKst(post.createdAt) || '-',
                location: post.region,
                topic: post.topic,
                content: post.content,
                avatar: post.authorProfileImg || DefaultProfileImage, // 작성자 프로필 이미지
                comments: 0, // 백엔드 응답에 없어 임시 처리
                isHot: false, // 백엔드 응답에 없어 임시 처리
              }}
              onClick={() => goDetail(post.id)}
              onMenuClick={handleMenuClick}
            />
          ))}
        </PostList>
      </Layout>

      <WriteButton onClick={() => navigate("/community/WritePage")}>
        <Plus>＋</Plus>
        글 작성
      </WriteButton>

      <NavigationBar />
      <BottomSheet
        open={openFilter}
        title="필터"
        onClose={() => setOpenFilter(false)}
        primaryLabel="적용"
        onPrimary={() => setOpenFilter(false)}
      >
        <FilterSection>
          <FilterTitle>지역</FilterTitle>
          <ChipRow>
            <Chip
              onClick={() => handleRegionChange(undefined)}
              selected={filters.regionId === undefined}
            >
              전체
            </Chip>
            {regions.map(r => (
              <Chip
                key={r.id}
                onClick={() => handleRegionChange(r.id)}
                selected={filters.regionId === r.id}
              >
                {r.nameKo}
              </Chip>
            ))}
          </ChipRow>
        </FilterSection>
        <FilterSection>
          <FilterTitle>주제</FilterTitle>
          <ChipRow>
            <Chip
              onClick={() => handleTopicChange(undefined)}
              selected={filters.topic === undefined}
            >
              전체
            </Chip>
            {topics.map(t => (
              <Chip
                key={t}
                onClick={() => handleTopicChange(t)}
                selected={filters.topic === t}
              >
                {t}
              </Chip>
            ))}
          </ChipRow>
        </FilterSection>
      </BottomSheet>
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
  margin: 0px 0 16px 0;
  height: 160px;
  background: #eee;
  overflow: hidden;
  cursor: pointer; /* 클릭 가능한 요소임을 시각적으로 알려줌 */
`;

const BannerText = styled.div`
  position: absolute;
  left: 24px;
  top: 24px;
  font-family: 'pretendard', sans-serif;
  z-index: 2;
  display: flex;
  flex-direction: column;
`;

const BannerTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  font-family: 'pretendard', sans-serif;
  margin-bottom: 8px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px; /* 아이콘과의 간격 */
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
`;

const BannerSub = styled.div`
  font-size: 11px;
  color: var(--black);
  font-family: 'pretendard', sans-serif;
`;

// const StatusButton = styled.button<{$active?: boolean}>`
//   position: absolute;
//   right: 24px;
//   top: 24px;
//   font-size: 14px;
//   font-family: 'pretendard', sans-serif;
//   background: ${({$active}) => $active ? 'var(--main-pri)' : 'rgba(0,0,0,0.3)'};
//   color: var(--white);
//   border: none;
//   border-radius: 12px;
//   padding: 4px 12px;
//   cursor: pointer;
//   z-index: 2;
// `;

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

const FilterSection = styled.div`
  margin-bottom: 24px;
`;

const FilterTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  padding-left: 4px;
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
