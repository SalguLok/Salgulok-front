import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NavigationBar from "../../components/common/NavigationBar";
import Header from "../../components/common/Header";
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

  const [filters, setFilters] = useState<GetPostsParams>({
    page: 0,
    size: 10,
    regionId: initialRegionId ? parseInt(initialRegionId) : undefined,
    sort: 'createdAt,desc', // 최신순 정렬 추가
  });

  const [openRegionFilter, setOpenRegionFilter] = useState(false);
  const [openTopicFilter, setOpenTopicFilter] = useState(false);
  const [onlyTraveling, setOnlyTraveling] = useState(false);

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

  return (
    <>
      <Layout>
        <Header title="커뮤니티" showBackButton={true} />
        <FilterBar>
          <FilterItem onClick={() => setOpenRegionFilter(true)}>
            <FilterText>{currentRegion}</FilterText>
            <DropdownIcon src={dropdown} alt="dropdown" />
          </FilterItem>
          <FilterItem onClick={() => setOpenTopicFilter(true)}>
            <FilterText>{currentTopic}</FilterText>
            <DropdownIcon src={dropdown} alt="dropdown" />
          </FilterItem>
        </FilterBar>
        <CheckboxContainer>
          <CheckboxWrapper>
            <input
              type="checkbox"
              id="onlyTraveling"
              checked={onlyTraveling}
              onChange={(e) => setOnlyTraveling(e.target.checked)}
            />
            <label htmlFor="onlyTraveling">여행 중인 사람만</label>
          </CheckboxWrapper>
        </CheckboxContainer>
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
      {/* 지역 선택 BottomSheet */}
      <BottomSheet
        open={openRegionFilter}
        title="지역"
        onClose={() => setOpenRegionFilter(false)}
        primaryLabel="적용"
        onPrimary={() => setOpenRegionFilter(false)}
      >
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
      </BottomSheet>

      {/* 주제 선택 BottomSheet */}
      <BottomSheet
        open={openTopicFilter}
        title="주제"
        onClose={() => setOpenTopicFilter(false)}
        primaryLabel="적용"
        onPrimary={() => setOpenTopicFilter(false)}
      >
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

const FilterBar = styled.div`
  display: flex;
  padding: 15px 0px 0px 21px;
  gap: 12px;
`;

const FilterItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 12px;
  height: 30px;
  border: 1px solid var(--gray-200);
  border-radius: 20px;
  background: var(--white);
  color: var(--black);
  font-size: 13px;
  font-family: pretendard, sans-serif;
  cursor: pointer;
  gap: 8px;
  
  &:hover {
    border-color: var(--gray-300);
  }
`;

const FilterText = styled.span`
  font-size: 13px;
  color: var(--black);
  font-family: pretendard, sans-serif;
`;

const DropdownIcon = styled.img`
  width: 10px;
  height: 10px;
  opacity: 0.6;
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

const CheckboxContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px 25px 0px 20px;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--gray-500);
  font-family: 'Pretendard', sans-serif;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    border: 1px solid var(--gray-300);
    border-radius: 3px;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    position: relative;
    background: var(--white);

    &:checked {
      background-color: var(--main-pri);
      border-color: var(--main-pri);
    }

    &:checked::after {
      content: '✓';
      font-size: 12px;
      color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  label {
    cursor: pointer;
    user-select: none;
  }
`;
