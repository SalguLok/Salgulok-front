import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import BottomButton from "../../components/common/BottomButton";
import BottomSheet from "../../components/common/BottomSheet";
import { Chip, ChipRow } from "../../components/common/Chip";
import { useState, useMemo } from "react";
import dropdown from "../../assets/common/dropdown.svg";

const REGION_MAP: Record<string, string[]> = {
  서울: ["강남","역삼","삼성","신사","청담","압구정","서초","교대"],
  부산: ["해운대","광안리","서면","남포"],
  제주: ["제주시","애월","협재","성산","서귀포"],
  경기: ["수원","용인","성남","고양"],
  인천: ["연수","송도","청라"],
  강원: ["강릉","속초","춘천"],
  경상: ["대구","포항","경주"],
  전라: ["전주","여수","광주"],
  충청: ["대전","청주","천안"],
};
const TOPICS = ["맛집","카페","레저","공방","박물관","관광지"];

const WritePage = () => {
  
  
  const navigate = useNavigate();
  // 시트 열림 상태
  const [openRegion, setOpenRegion] = useState(false);
  const [openTopic, setOpenTopic] = useState(false);

  // 선택 상태
  const [region, setRegion] = useState<string | null>(null);
  const [subregion, setSubregion] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);

  const subregions = useMemo(() => region ? REGION_MAP[region] ?? [] : [], [region]);

  // 라벨
  const regionLabel = region ? (subregion ? `${region} · ${subregion}` : region) : "지역선택";
  const topicLabel  = topic ?? "주제";

  return (
    <>
    <Layout>
      <Header title="글쓰기" showBackButton={true} />
      
      {/* <SelectRow>
        <SelectBtn>
          지역선택
          <Icon>
            <img src={dropdown} alt="dropdown icon" />
          </Icon>
        </SelectBtn>
        <SelectBtn>
          주제
          <Icon>
            <img src={dropdown} alt="dropdown icon" />
          </Icon>
        </SelectBtn>
      </SelectRow> */}

      <SelectRow>
        <SelectBtn
          type="button"
          onClick={() => setOpenRegion(true)}
          aria-haspopup="dialog"
          aria-expanded={openRegion}
        >
          {regionLabel}
          <Icon><img src={dropdown} alt="dropdown icon" /></Icon>
        </SelectBtn>

        <SelectBtn
          type="button"
          onClick={() => setOpenTopic(true)}
          aria-haspopup="dialog"
          aria-expanded={openTopic}
        >
          {topicLabel}
          <Icon><img src={dropdown} alt="dropdown icon" /></Icon>
        </SelectBtn>
      </SelectRow>

      <InputTitle placeholder="제목을 입력해주세요" />
      <InputContent placeholder="여행자들과 어떤 이야기를 나누고 싶으신가요?" />

  
    </Layout>
      <WriteButton onClick={() => navigate('')}>
          등록
      </WriteButton> 

    {/* 지역 선택 바텀시트 */}
      <BottomSheet
        open={openRegion}
        title="지역선택"
        onClose={() => setOpenRegion(false)}
        primaryLabel="다음"
        onPrimary={() => setOpenRegion(false)}
        primaryDisabled={!region}  // 필요 시 세부도 강제하려면 `!region || !subregion`
      >
        <SectionTitle>지역선택</SectionTitle>
        <ChipRow>
          {Object.keys(REGION_MAP).map((r) => (
            <Chip
              key={r}
              selected={region === r}
              onClick={() => { setRegion(r); setSubregion(null); }}
            >
              {r}
            </Chip>
          ))}
        </ChipRow>

        <Divider />

        <SectionTitle>세부 선택</SectionTitle>
        <ChipRow>
          {subregions.map((s) => (
            <Chip
              key={s}
              selected={subregion === s}
              onClick={() => setSubregion(s)}
            >
              {s}
            </Chip>
          ))}
          {!region && <Hint>먼저 상단에서 지역을 선택하세요.</Hint>}
        </ChipRow>
      </BottomSheet>

      {/* 주제 선택 바텀시트 */}
      <BottomSheet
        open={openTopic}
        title="주제"
        onClose={() => setOpenTopic(false)}
        primaryLabel="다음"
        onPrimary={() => setOpenTopic(false)}
        primaryDisabled={!topic}
      >
        <ChipRow>
          {TOPICS.map((t) => (
            <Chip
              key={t}
              selected={topic === t}
              onClick={() => setTopic(t)}
            >
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
  margin: 0 auto;         /* 화면 가운데 정렬 */
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

const InputTitle = styled.input`
  width: 100%;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid var(--black);
  font-size: 16px;
  font-family: pretendard, sans-serif;
  padding: 16px 0 8px 0;
  margin-bottom: 8px;
  outline: none;
  color: var(--black);
  &::placeholder {
    color: var(--gray-400);
  }
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
  max-height: 75dvh;      /* 너무 커지지 않도록 상한 */
  overflow-y: hidden;    /* 상한 넘기 전까지 스크롤 숨김 */
  outline: none;

  &::placeholder { color: var(--gray-200); }
`;

const SectionTitle = styled.div`
  margin: 8px 0 10px; font-size: 18px; font-weight: 700;
`;
const Divider = styled.div`
  height: 10px; margin: 6px -20px; background: #f3f3f3;
`;
const Hint = styled.div`
  color: var(--gray-300); font-size: 14px;
`;

const BTN_W = 90;  // 버튼 너비
const GUTTER = 15;  // 프레임 오른쪽 여백

const WriteButton = styled.button`
  position: fixed; 
  z-index: 1100;

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
  display: flex; align-items: center; justify-content: center; gap: 8px;
  border: none; border-radius: 15px;
  background: var(--main-pri); color: #fff;
  font-size: 15px; font-weight: 400; font-family: 'pretendard', sans-serif;
  cursor: pointer;
`;

