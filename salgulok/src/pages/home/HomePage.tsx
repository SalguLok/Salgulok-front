import styled from "styled-components";
import { type FC } from "react";
import NavigationBar from "../../components/common/NavigationBar";
import LogCardListSlide from "../../components/home/LogCardListSlider";
import type { LogItem } from "../../components/common/CardListItem";
import LocationSlider from "../../components/home/LocationSlider";
import regions from "../../data/regions";
import PlaceCardSlider from "../../components/home/PlaceCardSlider";
import type { PlaceItem } from "../../components/home/PlaceCardSlider";
import Salgu from "../../assets/common/salgu.svg?react";
import SalguItem from "../../components/home/SalguItem";
import {
  getPopularPlaceByRegion,
  getPopularPlace,
} from "../../api/place/place";
import { useState, useEffect, useMemo } from "react";
import LogWriteButton from "../../components/home/LogWriteButton";
import { useNavigate } from "react-router-dom";
import { getLogFillStates, getPopularLogs } from "../../api/log/log";
import { getUserTraveling } from "../../api/user/getUserTraveling";
import { getMyInfo } from "../../api/user/getMyProfile";

type Stage = { date: string; completed?: boolean };

type Props = {
  username?: string;
  progress?: number;
  stages?: Stage[];
  defaultMode?: "before" | "during";
  onModeChange?: (mode: "before" | "during") => void;
};

type LogDataItem = { date: string; hasLog: "yes" | "no" };
type UserTravelingResponse = {
  traveling: boolean;
  logId?: number;
};

const HomePage: FC<Props> = ({ defaultMode = "before", onModeChange }) => {
  const [mode, setMode] = useState<"before" | "during">(defaultMode);
  const [popularPlaceItems, setPopularPlaceItems] = useState<PlaceItem[]>([]);
  const [regionPopularPlaceItems, setRegionPopularPlaceItems] = useState<
    PlaceItem[]
  >([]);
  const [logData, setLogData] = useState<LogDataItem[]>([]);
  const [isTraveling, setIsTraveling] = useState(false);
  const [logId, setLogId] = useState<number>();
  const [popularLogs, setPopularLogs] = useState<LogItem[]>([]);
  const [name, setName] = useState("");

  const toMMDD = (iso: string) => {
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    const [, mm, dd] = parts;
    return `${mm}/${dd}`;
  };
  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const handleModeChange = (next: "before" | "during") => {
    setMode(next);
    onModeChange?.(next);
  };
  // 유저 이름 빼오기
  const readMyInfo = async () => {
    try {
      const response = await getMyInfo();
      setName(response.nickname);
    } catch (err) {
      console.error(err);
    }
  };
  //유저 traveling 여부 API 연결
  const readUserIsTraveling = async () => {
    try {
      const res = (await getUserTraveling()) as { data?: unknown } | unknown;
      const data = res as any as UserTravelingResponse | undefined;
      if (data) {
        const travelingNow = !!data.traveling;
        setIsTraveling(travelingNow);
        setLogId(data.logId);

        if (travelingNow) {
          setMode("during");
          onModeChange?.("during");
        }
      } else {
        setIsTraveling(false);
      }
    } catch (err) {
      console.error(err);
      setIsTraveling(false);
    }
  };

  //살구록 작성여부 API 연결
  const readLogFillStates = async () => {
    if (logId == null) return;
    try {
      const response = await getLogFillStates(logId);
      const days = ((response as any)?.data?.days ??
        (response as any)?.days ??
        []) as Array<{ date?: string; hasTemplate?: boolean }>;

      setLogData(
        days.map((d) => ({
          date: toMMDD(String(d?.date ?? "")),
          hasLog: d?.hasTemplate ? "yes" : "no",
        }))
      );
      console.log("logData", logData);
    } catch (e) {
      console.error(e);
      setLogData([]);
    }
  };
  //살구록 작성 퍼센트 계산
  const progressPercent = useMemo(() => {
    const total = logData.length;
    if (!total) return 0;
    const filled = logData.filter((d) => d.hasLog === "yes").length;
    const percent = Math.round((filled / total) * 100);
    return Math.max(0, Math.min(100, percent));
  }, [logData]);

  //이름이 8자보다 길 경우 ...로 처리
  const shorten = (s: string | undefined, max = 9) => {
    const arr = Array.from(s ?? "");
    return arr.length > max ? arr.slice(0, max).join("") + "…" : s ?? "";
  };

  const toArray = (r: any) =>
    Array.isArray(r?.data) ? r.data : Array.isArray(r) ? r : [];

  //전체 인기장소 검색 API 연결
  const readPopularPlace = async () => {
    const response = await getPopularPlace();
    const payload = toArray(response);
    const mapped: PlaceItem[] = payload.map((p: any, i: number) => ({
      id: String(p.place_id ?? `place-${i}`),
      placeName: String(p.placeName),
      mapx: String(p.mapx),
      mapy: String(p.mapy),
      image: p.image_url || undefined,
      starCount: Number(p.starCount),
      comments: Number(p.commentCount ?? 0),
    }));
    setPopularPlaceItems(mapped);
  };
  const regionId = 1;

  const rangeToYYMMDDDash = (start: string, end: string) => {
    const fmt = (s: string) => {
      const [y, m, d] = s?.split("-") ?? ["", "", ""];
      if (!y || !m || !d) return s ?? "";
      return `${y.slice(2)}${m}${d}`;
    };
    return `${fmt(start)}-${fmt(end)}`;
  };

  //인기 살구록 API 연결
  const readPopularLogs = async () => {
    try {
      const response = await getPopularLogs();
      const payload = toArray(response);
      const mapped: LogItem[] = payload.map((item: any) => ({
        id: item.logId,
        image: String(item.imgUrl ?? ""),
        writer: String(item.writer ?? ""),
        writerProfile: item.writerProfile ? String(item.writerProfile) : "",
        title: String(item.title ?? ""),
        date: rangeToYYMMDDDash(
          String(item.startDate ?? ""),
          String(item.endDate ?? "")
        ),
        likes: Number(item.likes ?? 0),
      }));
      setPopularLogs(mapped);
    } catch (e) {
      console.error(e);
      setPopularLogs([]);
    }
  };

  //인기장소 지역별 검색 API 연결
  const readPopularPlaceByRegion = async () => {
    const response = await getPopularPlaceByRegion(regionId);
    const payload = toArray(response);
    const mapped: PlaceItem[] = payload.map((p: any, i: number) => ({
      id: String(p.place_id ?? `region-place-${i}`),
      placeName: String(p.placeName),
      mapx: String(p.mapx),
      mapy: String(p.mapy),
      image: p.image_url || undefined,
      starCount: Number(p.starCount),
      comments: Number(p.commentCount ?? 0),
    }));
    setRegionPopularPlaceItems(mapped);
  };
  const navigate = useNavigate();
  const currentPlaceItems =
    mode === "during" ? regionPopularPlaceItems : popularPlaceItems;

  useEffect(() => {
    readUserIsTraveling();
    readLogFillStates();
  }, [logId]);

  useEffect(() => {
    readPopularPlace();
    readPopularLogs();
  }, []);

  useEffect(() => {
    readPopularPlaceByRegion();
  }, [regionId]);

  useEffect(() => {
    readMyInfo();
  }, []);

  const placeItemsForDisplay = useMemo(
    () =>
      currentPlaceItems.map((it) => ({
        ...it,
        placeName: shorten(it.placeName, 8),
      })),
    [currentPlaceItems]
  );

  const salguItemsForDisplay = useMemo(() => {
    if (mode === "before") {
      return Array.from({ length: 6 }).map((_, i) => ({
        key: `placeholder-${i}`,
        date: "00/00",
        hasLog: "no" as const,
      }));
    }

    return logData.map((d) => ({
      key: d.date,
      date: d.date,
      hasLog: d.hasLog,
    }));
  }, [mode, logData]);

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
            {mode === "before" ? (
              <>
                안녕하세요 {name}님, <br />
                새로운 살구로그를 생성해보세요!
              </>
            ) : (
              <>
                안녕하세요 {name}님, <br />
                여행 중 순간을 살구로그에 기록해보세요!
              </>
            )}
          </Greeting>
        </GreetingContainer>
        <ProgressRow>
          <BarWrap>
            <Track>
              {Array.from({ length: 8 }).map((_, i) => (
                <Dot key={i} />
              ))}

              <Marker style={{ left: `calc(${progressPercent}% - 9px)` }}>
                {mode === "before" ? "" : <Salgu width={25} height={28} />}
              </Marker>
            </Track>
          </BarWrap>
          <GrowthText>
            {name}님의 살구나무는 <Em>{progressPercent}%</Em> 성장완료!
          </GrowthText>
        </ProgressRow>

        <SalguContainer>
          {salguItemsForDisplay.map((d) => (
            <SalguItem
              key={d.key}
              date={d.date} // "체류 전"에는 빈 문자열 => 날짜 표시 없음
              hasLog={d.hasLog}
              forceOff={mode === "before"} // 체류 전이면 전부 꺼진 상태로 강제
              onClick={() => console.log("clicked:", d.date)}
            />
          ))}
        </SalguContainer>
      </TopContainer>
      <TitleContainer>
        <Title>지역 추천</Title>
      </TitleContainer>
      <LocationSlider
        items={regions}
        onClick={(id) => console.log("region:", id)}
      />
      <TitleContainer>
        <Title>인기 살구로그</Title>
      </TitleContainer>
      <CardContainer>
        <LogCardListSlide
          items={popularLogs}
          onClick={(id) => console.log("open", id)}
          onToggleLike={(id) => console.log("like", id)}
        />
      </CardContainer>
      <TitleContainer>
        <Title>살구 도감</Title>
      </TitleContainer>
      <PlaceCardSlider
        items={placeItemsForDisplay}
        onClick={(id) => {
          const target = currentPlaceItems.find((it) => it.id === id);
          if (!target) return;

          navigate("/map", {
            state: {
              q: target.placeName,
              lat: target.mapx,
              lng: target.mapy,
              name: target.placeName,
            },
          });
        }}
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
  flex: 1;
  min-width: 0;
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

  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  touch-action: pan-x;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  padding-left: 20px;
  padding-right: 20px;

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
  color: var(--gray-400);
  font-size: 16px;
`;
const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
