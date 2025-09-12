import styled from "styled-components";
import { type FC } from "react";
import NavigationBar from "../../components/common/NavigationBar";
import LogCardListSlide from "../../components/home/LogCardListSlider";
import type { LogItem } from "../../components/common/CardListItem";
import LocationSlider from "../../components/home/LocationSlider";
import type { RegionItem } from "../../components/home/LocationSlider";
import PlaceCardSlider from "../../components/home/PlaceCardSlider";
import type { PlaceItem } from "../../components/home/PlaceCardSlider";
import Salgu from "../../assets/common/salgu.svg?react";
import SalguItem from "../../components/home/SalguItem";
import SalguOff from "../../assets/common/salgu_off.svg?react";
import Jeju from "../../assets/home/jeju.svg";
import { useState, useEffect } from "react";
import LogWriteButton from "../../components/home/LogWriteButton";

type Stage = { date: string; completed?: boolean };

type Props = {
  username?: string;
  progress?: number;
  stages?: Stage[];
  defaultMode?: "before" | "during";
  onModeChange?: (mode: "before" | "during") => void;
};

const data = [
  { date: "07/03", hasLog: "yes" as const },
  { date: "07/04", hasLog: "no" as const },
  { date: "07/05", hasLog: "yes" as const },
  { date: "07/06", hasLog: "no" as const },
  { date: "07/07", hasLog: "no" as const },
  { date: "07/05", hasLog: "yes" as const },
  { date: "07/06", hasLog: "no" as const },
  { date: "07/07", hasLog: "no" as const },
];

const regions: RegionItem[] = [
  { id: "jeju", location: "제주", image: Jeju },
  { id: "busan", location: "부산", image: "/imgs/regions/busan.jpg" },
  { id: "sokcho", location: "속초", image: "/imgs/regions/sokcho.jpg" },
  { id: "gangneung", location: "강릉", image: "/imgs/regions/gangneung.jpg" },
];

const mock: LogItem[] = [
  {
    id: "1",
    image: "",
    writer: "여행이좋아요",
    writerProfile: "",
    title: "25년 여름 제주는 아름다워",
    date: "250703-250807",
    likes: 17,
    comments: 25,
  },
  {
    id: "2",
    image: "",
    writer: "여행이좋아요",
    title: "산토리니 블루",
    date: "250703-250807",
    likes: 12,
    comments: 9,
  },
  {
    id: "3",
    image: "",
    writer: "여행이좋아요",
    title: "산토리니 블루",
    date: "250703-250807",
    likes: 12,
    comments: 9,
  },
];

const place: PlaceItem[] = [
  {
    id: "1",
    image: "",
    name: "강릉 옥수수빵",
    likes: 12,
    comments: 9,
  },
  {
    id: "2",
    image: "",
    name: "강릉 옥수수빵",
    likes: 12,
    comments: 9,
  },
  {
    id: "3",
    image: "",
    name: "강릉 옥수수빵",
    likes: 12,
    comments: 9,
  },
];

const HomePage: FC<Props> = ({
  username = "윌버",
  progress = 70,
  stages = [
    { date: "00/00" },
    { date: "00/00" },
    { date: "00/00" },
    { date: "00/00" },
    { date: "00/00" },
  ],
  defaultMode = "before",
  onModeChange,
}) => {
  const [mode, setMode] = useState<"before" | "during">(defaultMode);
  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const handleModeChange = (next: "before" | "during") => {
    setMode(next);
    onModeChange?.(next);
  };

  return (
    <Layout>
      <TopContainer>
        <ButtonContainer>
          <Button
            $active={mode === "before"}
            onClick={() => handleModeChange("before")}
          >
            체류 전
          </Button>{" "}
          <Button
            $active={mode === "during"}
            onClick={() => handleModeChange("during")}
          >
            체류 중
          </Button>
        </ButtonContainer>
        <GreetingContainer>
          <Greeting>
            안녕하세요 {username}님, <br />
            새로운 살구로그를 생성해보세요!
          </Greeting>
        </GreetingContainer>
        <ProgressRow>
          <BarWrap>
            <Track>
              {Array.from({ length: 8 }).map((_, i) => (
                <Dot key={i} />
              ))}

              <Marker style={{ left: `calc(${progress}% - 9px)` }}>
                {mode === "before" ? "" : <Salgu width={25} height={28} />}
              </Marker>
            </Track>
          </BarWrap>
          <GrowthText>
            {username}님의 살구나무는 <Em>{progress}%</Em> 성장완료!
          </GrowthText>
        </ProgressRow>

        <SalguContainer>
          {data.map((d) => (
            <SalguItem
              key={d.date}
              date={d.date}
              hasLog={d.hasLog}
              forceOff={mode === "before"}
              onClick={() => console.log("clicked:", d.date)}
            />
          ))}
        </SalguContainer>
      </TopContainer>
      <TitleContainer>
        <Title>지역 추천</Title>
        <More>더보기</More>
      </TitleContainer>
      <LocationSlider
        items={regions}
        onClick={(id) => console.log("region:", id)}
      />
      <TitleContainer>
        <Title>인기 살구로그</Title>
        <More>더보기</More>
      </TitleContainer>
      <CardContainer>
        <LogCardListSlide
          items={mock}
          onClick={(id) => console.log("open", id)}
          onToggleLike={(id) => console.log("like", id)}
        />
      </CardContainer>
      <TitleContainer>
        <Title>살구 도감</Title>
        <More>더보기</More>
      </TitleContainer>
      <PlaceCardSlider
        items={place}
        onClick={(id) => console.log("open", id)}
      />
      {mode === "before" && <LogWriteButton />}

      <NavigationBar />
    </Layout>
  );
};

export default HomePage;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 100px;
`;
const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffeadd;
`;
const ButtonContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 119px;
  height: 32px;
  background: white;
  border: 1px solid var(--main-pri);
  border-radius: 999px;
  margin: 20px 20px;
  margin-left: auto;
  padding: 2px;
`;
const Button = styled.button<{ $active?: boolean }>`
  width: 59px;
  height: 31px;
  border: 0;
  background: ${({ $active }) => ($active ? "var(--main-pri)" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#000000")};
  font-size: 13px;
  border-radius: 999px;
  cursor: pointer;
`;
const GreetingContainer = styled.div`
  display: flex;
  margin: 10px 20px 30px 20px;
`;
const Greeting = styled.text`
  font-size: 20px;
  font-weight: 500;
`;
const ProgressRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  margin: 6px 0 20px;
`;

const BarWrap = styled.div`
  flex: 1; /* 가운데 트랙은 남은 공간을 채움 */
  min-width: 0; /* 텍스트 때문에 줄바꿈될 때 수축 허용 */
`;

const Track = styled.div`
  position: relative;
  height: 10px;
  border-radius: 999px;
  background: #ffd3b3;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 37px;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  opacity: 0.9;
`;

const Marker = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  pointer-events: none;
`;

const GrowthText = styled.span`
  white-space: nowrap;
  font-size: 12px;
  color: #555;
  margin-left: auto;
`;

const Em = styled.b`
  color: var(--main-pri);
  font-weight: 700;
`;

const SalguContainer = styled.div`
  display: flex;
  border-radius: 25px;
  background-color: var(--white);

  height: 105px;
  margin: 0px 20px 20px 20px;
  display: flex;
  flex-direction: row;
  gap: 16px;

  /* 가로 슬라이드 */
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  touch-action: pan-x;

  /* 스크롤바 숨김 */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* 왼쪽 여백만, 오른쪽은 0 → 끝에 공백 없음 */
  padding-left: 20px;
  padding-right: 20px;

  /* 스냅 기준도 왼쪽만 */
  scroll-padding-left: 20px;
  scroll-padding-right: 20px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 30px 20px 10px 20px;
`;
const Title = styled.text`
  font-size: 20px;
  font-weight: 600;
`;
const More = styled.text`
color:var(--gray-400);
font-size:font-size: 16px;`;
const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
