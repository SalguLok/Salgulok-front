import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import NavigationBar from "../../components/common/NavigationBar";
import Header from "../../components/common/Header";
import PostCard from "../../components/common/PostCard";
import ConfirmModal from "../../components/common/ConfirmModal";
import Pagination from "../../components/common/Pagination";
import { getPosts } from "../../api/community/community";
import type { GetPostsParams, Topic } from "../../api/community/community";
import DefaultProfileImage from "../../assets/common/profile_default.svg";
import { formatKst } from "../../utils/date";

//region 선택
import BottomSheet from "../../components/common/BottomSheet";
import { Chip, ChipRow } from "../../components/common/Chip";
import regions from "../../data/regions"; // regions 데이터 임포트

const topics: Topic[] = ['동행', '맛집', '숙소', '교통', '기타'];

const CommunityPage = () => {
  const navigate = useNavigate();
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

  // ConfirmModal 상태
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isSuccessModal, setIsSuccessModal] = useState(false);


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
  const currentRegion = filters.regionId === undefined ? "전체" : regions.find(r => r.id === filters.regionId)?.nameKo ?? "전체";
  const currentTopic = filters.topic ?? "전체 주제";


  // 필터 변경 핸들러
  const handleRegionChange = (newRegionId?: number) => {
    setFilters(prev => ({ ...prev, regionId: newRegionId, page: 0 }));
    setOpenRegionFilter(false); // 지역 선택 BottomSheet 닫기
    setOpenTopicFilter(true); // 주제 선택 BottomSheet 자동 열기
  };

  const handleTopicChange = (newTopic?: Topic) => {
    setFilters(prev => ({ ...prev, topic: newTopic, page: 0 }));
    setOpenTopicFilter(false); // 주제 선택 BottomSheet 닫기
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page: page - 1 })); // 1-based를 0-based로 변환
  };

  // 게시글 삭제 핸들러
  const handlePostMenuClick = (postId: number) => {
    // 게시글 작성자 확인
    const post = postsPage?.content?.find(p => p.id === postId);
    if (!post) {
      setConfirmMessage("게시글을 찾을 수 없습니다.");
      setIsSuccessModal(true);
      setConfirmOpen(true);
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setConfirmMessage("로그인이 필요합니다.");
      setIsSuccessModal(true);
      setConfirmOpen(true);
      return;
    }

    if (parseInt(userId) !== post.authorId) {
      setConfirmMessage("본인이 작성한 글만\n삭제할 수 있습니다.");
      setIsSuccessModal(true);
      setConfirmOpen(true);
      return;
    }

    // 작성자 확인 통과 시 삭제 확인 모달 표시
    setSelectedPostId(postId);
    setIsSuccessModal(false);
    setConfirmMessage("게시글을 삭제하시겠습니까?");
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (isSuccessModal) {
      // 성공 모달 닫기
      setConfirmOpen(false);
      setIsSuccessModal(false);
    } else if (selectedPostId) {
      // TODO: 게시글 삭제 API 호출
      console.log("게시글 삭제:", selectedPostId);
      // 삭제 성공 시 성공 모달 표시
      setConfirmMessage("게시글이 삭제되었습니다.");
      setIsSuccessModal(true);
      setConfirmOpen(true);
      setSelectedPostId(null);
    }
  };

  return (
    <>
      <Layout>
        <Header title="커뮤니티" showBackButton={true} />
        
        {/* 배너 섹션 */}
        <Banner>
          <BannerGradient />
          <BannerText>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BannerTitle onClick={() => setOpenRegionFilter(true)}>
                {currentRegion}
              </BannerTitle>
              <span>,</span>
              <BannerTitle onClick={() => setOpenTopicFilter(true)}>
                {currentTopic}
              </BannerTitle>
            </div>
            <BannerSub>여행 예정 350명, 여행 중 137명</BannerSub>
          </BannerText>
          <BannerImage
            src={filters.regionId === undefined ? "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800" : regions.find(r => r.id === filters.regionId)?.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"}
            alt={currentRegion}
          />
        </Banner>

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
              onMenuClick={handlePostMenuClick}
            />
          ))}
        </PostList>

        {/* Pagination */}
        {postsPage && postsPage.totalPages > 1 && (
          <div style={{ marginBottom: '80px' }}>
            <Pagination
              totalPages={postsPage.totalPages}
              currentPage={(filters.page ?? 0) + 1} // 0-based를 1-based로 변환
              onPageChange={handlePageChange}
            />
          </div>
        )}
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
          {regions.map(r => (
            <Chip
              key={r.id}
              onClick={() => handleRegionChange(r.id === 0 ? undefined : r.id)}
              selected={filters.regionId === (r.id === 0 ? undefined : r.id)}
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

      {/* 게시글 삭제 확인 모달 */}
      <ConfirmModal
        open={confirmOpen}
        message={confirmMessage}
        confirmText="확인"
        cancelText={isSuccessModal ? undefined : "취소"}
        showCancel={!isSuccessModal}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
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
  padding-bottom: 30px;
`;

// 배너 섹션
const Banner = styled.div`
  position: relative;
  margin: 12px 0 16px 0;
  height: 180px;
  background: #eee;
  overflow: hidden;
  z-index: 100;
  cursor: pointer; /* 클릭 가능한 요소임을 시각적으로 알려줌 */
`;

const BannerText = styled.div`
  position: absolute;
  left: 24px;
  top: 24px;
  font-family: 'pretendard', sans-serif;
  z-index: 3;
  display: flex;
  flex-direction: column;
`;

const BannerTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-family: 'pretendard', sans-serif;
  background: none;
  border: none;
  cursor: pointer;
  color: black;
  display: flex;
  align-items: center;
  &:hover {
    opacity: 0.8;
  }
`;

const BannerSub = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: black;
  font-family: 'pretendard', sans-serif;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const BannerGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to bottom, 
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.98) 15%,
    rgba(255, 255, 255, 0.95) 30%,
    rgba(255, 255, 255, 0.9) 45%,
    rgba(255, 255, 255, 0.8) 60%,
    rgba(255, 255, 255, 0.6) 75%,
    rgba(255, 255, 255, 0.3) 90%,
    transparent 100%
  );
  z-index: 2;
`;

const PostList = styled.div`
  margin: 0 0 40px 0;
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
  padding: 5px 25px 0px 20px;
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
