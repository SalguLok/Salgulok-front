import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "../../components/common/Header";
import BottomSheet from "../../components/common/BottomSheet";
import { Chip, ChipRow } from "../../components/common/Chip";
import { useState } from "react";
import dropdown from "../../assets/common/dropdown.svg?react";
import { createPost } from "../../api/community/community";
import type { PostCreateRequest, Topic } from "../../api/community/community";

const REGIONS = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "충청",
  "전라",
  "경상",
  "강원",
  "제주",
];

const TOPICS: Topic[] = ["동행", "맛집", "숙소", "교통", "기타"];

const WritePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [openRegion, setOpenRegion] = useState(false);
  const [openTopic, setOpenTopic] = useState(false);

  const [region, setRegion] = useState<string | null>(null);
  const regionMap: Record<string, number> = {
    서울: 1,
    부산: 2,
    대구: 3,
    인천: 4,
    광주: 5,
    대전: 6,
    울산: 7,
    세종: 8,
    경기: 9,
    충청: 10,
    전라: 11,
    경상: 12,
    강원: 13,
    제주: 14,
  };
  const [topic, setTopic] = useState<Topic | null>(null);
  const [content, setContent] = useState("");

  const regionLabel = region ?? "지역선택";
  const topicLabel = topic ?? "주제";

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      navigate(`/community/${data.postId}`);
    },
    onError: (error) => {
      console.error("게시글 생성 실패:", error);
      alert("게시글 생성에 실패했습니다.");
    },
  });

  const handleSubmit = () => {
    if (!topic || !content.trim() || !region) {
      alert("지역, 주제, 내용을 모두 입력해주세요.");
      return;
    }
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("사용자 정보를 가져올 수 없습니다. 다시 로그인해주세요.");
      return;
    }

    const postData: PostCreateRequest = {
      topic,
      content,
      authorId: parseInt(userId),
      regionId: region ? regionMap[region] : 0,
    };
    console.log("[게시글 생성] payload", postData);
    createPostMutation.mutate(postData);
  };

  return (
    <>
      <Header title="글쓰기" showBackButton={true} />
      <Layout>
        <SelectRow>
          <SelectBtn
            type="button"
            onClick={() => setOpenRegion(true)}
            aria-haspopup="dialog"
            aria-expanded={openRegion}
          >
            {regionLabel}
            <Icon>
              <img src={dropdown} alt="dropdown icon" />
            </Icon>
          </SelectBtn>

          <SelectBtn
            type="button"
            onClick={() => setOpenTopic(true)}
            aria-haspopup="dialog"
            aria-expanded={openTopic}
          >
            {topicLabel}
            <Icon>
              <img src={dropdown} alt="dropdown icon" />
            </Icon>
          </SelectBtn>
        </SelectRow>

        <InputContent
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="여행자들과 어떤 이야기를 나누고 싶으신가요?"
        />
      </Layout>
      <WriteButton
        onClick={handleSubmit}
        disabled={createPostMutation.isPending}
      >
        {createPostMutation.isPending ? "등록 중..." : "등록"}
      </WriteButton>

      {/* 지역 선택 바텀시트 */}
      <BottomSheet
        open={openRegion}
        title="지역선택"
        onClose={() => setOpenRegion(false)}
        primaryLabel="선택"
        onPrimary={() => setOpenRegion(false)}
        primaryDisabled={!region}
      >
        <ChipRow>
          {REGIONS.map((r) => (
            <Chip key={r} selected={region === r} onClick={() => setRegion(r)}>
              {r}
            </Chip>
          ))}
        </ChipRow>
      </BottomSheet>

      {/* 주제 선택 바텀시트 */}
      <BottomSheet
        open={openTopic}
        title="주제"
        onClose={() => setOpenTopic(false)}
        primaryLabel="선택"
        onPrimary={() => setOpenTopic(false)}
        primaryDisabled={!topic}
      >
        <ChipRow>
          {TOPICS.map((t) => (
            <Chip key={t} selected={topic === t} onClick={() => setTopic(t)}>
              {t}
            </Chip>
          ))}
        </ChipRow>
      </BottomSheet>
    </>
  );
};

export default WritePage;

const APP_W = 375; // 폰 프레임 너비(px)

const Layout = styled.div`
  min-height: 100vh;
  background: var(--white);
  padding: 0 20px;
  align-items: center;
  position: relative;

  max-width: ${APP_W}px;
  margin: 0 auto; /* 화면 가운데 정렬 */
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
`;

const SelectRow = styled.div`
  display: flex;
  gap: 12px;
  margin: 24px 0 24px 0;
`;

const SelectBtn = styled.button`
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
`;

const InputContent = styled.textarea`
  width: 100%;
  border: none;
  font-size: 13px;
  font-family: pretendard, sans-serif;
  color: var(--black);
  resize: none;
  line-height: 1.6;
  min-height: 300px;
  max-height: 75dvh; /* 너무 커지지 않도록 상한 */
  overflow-y: hidden; /* 상한 넘기 전까지 스크롤 숨김 */
  outline: none;

  &::placeholder {
    color: var(--gray-200);
  }
`;

const BTN_W = 90; // 버튼 너비
const GUTTER = 15; // 프레임 오른쪽 여백

const WriteButton = styled.button`
  position: fixed;
  z-index: 1000;

  /* 하단 여백 + iOS 안전영역 */
  bottom: calc(16px + env(safe-area-inset-bottom));

  /* 프레임 오른쪽 안쪽에 붙이기:
     50% (중앙) + 프레임의 절반 - 여백 - 버튼폭 */
  left: calc(50% + ${APP_W}px / 2 - ${GUTTER}px - ${BTN_W}px);
  right: auto;

  /* 작은 화면(프레임=화면폭)에서는 일반 right 기준으로 */
  @media (max-width: ${APP_W + GUTTER * 2}px) {
    left: auto;
    right: ${GUTTER}px;
  }

  width: 90px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 15px;
  background: var(--main-pri);
  color: #fff;
  font-size: 15px;
  font-weight: 400;
  font-family: "pretendard", sans-serif;
  cursor: pointer;
`;