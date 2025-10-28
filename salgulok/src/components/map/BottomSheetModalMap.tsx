import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import LogCardList from "../common/CardListItem";
import Star from "../../assets/common/star.svg?react";
import Place from "../../assets/common/place.svg?react";

const HANDLE_H = 20; // Handle 영역 높이(Handle 컴포넌트 height와 일치)
const TABS_H = 48; // Tabs 영역(탭 버튼 + 밑줄) 대략 높이
const HEADER_H = HANDLE_H + TABS_H; // 고정 헤더 높이
const BODY_MIN_VIS = 25; // 최소로 시트가 작을 때 내용이 보일 여유 높이

type TabKey = "log" | "place";

const TYPE_KEYS: Record<number, string[]> = {
  12: [
    "infocenter",
    "restdate",
    "usetime",
    "parking",
    "accomcount",
    "chkbabycarriage",
    "chkcreditcard",
    "chkpet",
    "expguide",
    "expagerange",
    "infocenterculture",
  ],
  14: [
    "infocenter",
    "restdate",
    "usetime",
    "parking",
    "accomcountculture",
    "chkbabycarriageculture",
    "chkcreditcardculture",
    "chkpetculture",
    "discountinfo",
    "parkingculture",
    "parkingfee",
    "scale",
    "spendtime",
    "usetimeculture",
  ],
  15: [
    "infocenter",
    "restdate",
    "usetime",
    "parking",
    "agelimit",
    "bookingplace",
    "discountinfofestival",
    "eventenddate",
    "eventhomepage",
    "eventplace",
    "eventstartdate",
    "festivalgrade",
    "placeinfo",
    "playtime",
    "program",
    "spendtimefestival",
    "sponsor1",
    "sponsor1tel",
    "sponsor2",
    "sponsor2tel",
    "subevent",
    "usetimefestival",
  ],
  25: [
    "infocenter",
    "restdate",
    "usetime",
    "parking",
    "distance",
    "infocentertourcourse",
    "schedule",
    "taketime",
    "theme",
  ],
  28: [
    "infocenter",
    "restdate",
    "usetime",
    "parking",
    "accomcountleports",
    "chkbabycarriageleports",
    "chkcreditcardleports",
    "chkpetleports",
    "expagerangeleports",
    "infocenterleports",
    "openperiod",
    "parkingfeeleports",
    "parkingleports",
    "reservation",
    "restdateleports",
    "scaleleports",
    "usefeeleports",
    "usetimeleports",
  ],
  32: [
    "infocenter",
    "restdate",
    "usetime",
    "parking",
    "accomcountlodging",
    "benikia",
    "checkintime",
    "checkouttime",
    "chkcooking",
    "foodplace",
    "goodstay",
    "hanok",
    "infocenterlodging",
    "parkinglodging",
    "pickup",
    "roomcount",
    "roomtype",
    "reservationlodging",
    "reservationurl",
    "subfacility",
  ],
  38: [
    "infocenter",
    "restdate",
    "usetime",
    "parking",
    "chkbabycarriageshopping",
    "chkcreditcardshopping",
    "chkpetshopping",
    "culturecenter",
    "fairday",
    "infocentershopping",
    "opendateshopping",
    "opentime",
    "parkingshopping",
    "restdateshopping",
    "restroom",
    "saleitem",
    "saleitemcost",
    "scaleshopping",
    "shopguide",
  ],
  39: [
    "infocenter",
    "restdate",
    "usetime",
    "parking",
    "chkcreditcardfood",
    "discountinfofood",
    "firstmenu",
    "infocenterfood",
    "kidsfacility",
    "opendatefood",
    "opentimefood",
    "packing",
    "parkingfood",
    "reservationfood",
    "restdatefood",
    "scalefood",
    "seat",
    "smoking",
    "treatmenu",
    "lcnsno",
  ],
};

const LABELS: Record<string, string> = {
  infocenter: "문의처",
  restdate: "휴무일",
  usetime: "이용시간",
  parking: "주차",
  accomcount: "수용인원",
  chkbabycarriage: "유모차대여",
  chkcreditcard: "신용카드",
  chkpet: "반려동물",
  expguide: "체험안내",
  expagerange: "체험연령",
  infocenterculture: "문화센터 문의",
  accomcountculture: "수용인원",
  chkbabycarriageculture: "유모차대여",
  chkcreditcardculture: "신용카드",
  chkpetculture: "반려동물",
  discountinfo: "할인정보",
  parkingculture: "주차",
  parkingfee: "주차요금",
  scale: "규모",
  spendtime: "관람소요시간",
  usetimeculture: "관람시간",
  agelimit: "연령제한",
  bookingplace: "예매처",
  discountinfofestival: "할인정보",
  eventenddate: "행사종료",
  eventhomepage: "행사홈페이지",
  eventplace: "행사장소",
  eventstartdate: "행사시작",
  festivalgrade: "축제등급",
  placeinfo: "장소안내",
  playtime: "공연시간",
  program: "프로그램",
  spendtimefestival: "관람소요시간",
  sponsor1: "주최1",
  sponsor1tel: "주최1 연락처",
  sponsor2: "주최2",
  sponsor2tel: "주최2 연락처",
  subevent: "부대행사",
  usetimefestival: "이용시간",
  distance: "거리",
  infocentertourcourse: "문의처",
  schedule: "일정",
  taketime: "소요시간",
  theme: "테마",
  accomcountleports: "수용인원",
  chkbabycarriageleports: "유모차대여",
  chkcreditcardleports: "신용카드",
  chkpetleports: "반려동물",
  expagerangeleports: "체험연령",
  infocenterleports: "문의처",
  openperiod: "개장기간",
  parkingfeeleports: "주차요금",
  parkingleports: "주차",
  reservation: "예약안내",
  restdateleports: "휴무일",
  scaleleports: "규모",
  usefeeleports: "이용요금",
  usetimeleports: "이용시간",
  accomcountlodging: "객실/수용",
  benikia: "베니키아",
  checkintime: "체크인",
  checkouttime: "체크아웃",
  chkcooking: "취사",
  foodplace: "식음시설",
  goodstay: "굿스테이",
  hanok: "한옥",
  infocenterlodging: "문의처",
  parkinglodging: "주차",
  pickup: "픽업",
  roomcount: "객실수",
  roomtype: "객실형태",
  reservationlodging: "예약안내",
  reservationurl: "예약URL",
  subfacility: "부대시설",
  chkbabycarriageshopping: "유모차대여",
  chkcreditcardshopping: "신용카드",
  chkpetshopping: "반려동물",
  culturecenter: "문화센터",
  fairday: "정기휴무/장날",
  infocentershopping: "문의처",
  opendateshopping: "개장일",
  opentime: "영업시간",
  parkingshopping: "주차",
  restdateshopping: "휴무일",
  restroom: "화장실",
  saleitem: "판매품목",
  saleitemcost: "가격대",
  scaleshopping: "규모",
  shopguide: "쇼핑가이드",
  chkcreditcardfood: "신용카드",
  discountinfofood: "할인정보",
  firstmenu: "대표메뉴",
  infocenterfood: "문의처",
  kidsfacility: "아동시설",
  opendatefood: "개점일",
  opentimefood: "영업시간",
  packing: "포장",
  parkingfood: "주차",
  reservationfood: "예약",
  restdatefood: "휴무일",
  scalefood: "규모",
  seat: "좌석수",
  smoking: "흡연",
  treatmenu: "취급메뉴",
  lcnsno: "인허가번호",
};

const pretty = (v: unknown) => {
  if (typeof v !== "string") return v as any;
  const withNewlines = v.replace(/<br\s*\/?>/gi, "\n");
  const noTags = withNewlines.replace(/<\/?[^>]+>/g, "");
  return noTags.trim();
};

const isFilled = (v: unknown) => {
  if (v === null || v === undefined) return false;
  const sv = typeof v === "string" ? pretty(v) : v;
  if (typeof sv === "string") return sv.trim().length > 0;
  return true; // 숫자/불리언 등은 값이 있으면 표시
};

const pickEntriesByType = (intro?: Record<string, any>, ctype?: number) => {
  if (!intro || !ctype) return [];
  const allow = TYPE_KEYS[ctype] ?? [];
  return allow.map((k) => [k, intro[k]] as const).filter(([, v]) => v !== null);
};

type PlaceInfo = {
  title: string;
  imageUrl?: string;
  description?: string;
  address?: string;
  tel?: string;
  star?: number;
  introInfo?: Record<string, any>;
  contentTypeId?: number;
};

type Props = {
  open?: boolean;
  initialHeight?: number;
  maxHeightRatio?: number;
  defaultTab?: TabKey;
  logs?: any[];
  place?: PlaceInfo | null;
  onBackdropClick?: () => void;
  autoSnapOnChange?: boolean;
  snapTarget?: "mid" | "max";
};

const BottomSheetModalMap: React.FC<Props> = ({
  open = true,
  initialHeight = 90,
  maxHeightRatio = 0.8,
  defaultTab = "log",
  logs = [],
  place,
  onBackdropClick,
  autoSnapOnChange = true,
  snapTarget = "mid",
}) => {
  const [tab, setTab] = useState<TabKey>(defaultTab);

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  const minH = HEADER_H + BODY_MIN_VIS;
  const maxH = Math.round(window.innerHeight * maxHeightRatio);
  const midH = Math.round((minH + maxH) / 1.7);
  const snapH = snapTarget === "max" ? maxH : midH;
  const [height, setHeight] = useState<number>(Math.max(initialHeight, minH));
  useEffect(() => {
    setHeight(Math.max(initialHeight, minH));
  }, [initialHeight, minH]);
  // const minH = 90;
  // const maxH = Math.round(window.innerHeight * maxHeightRatio);
  // const midH = Math.round((minH + maxH) / 1.7);
  // const snapH = snapTarget === "max" ? maxH : midH;
  //드래그 상태
  const startYRef = useRef(0);
  const startHRef = useRef(0);
  const draggingRef = useRef(false);

  const beginDrag = (clientY: number) => {
    draggingRef.current = true;
    startYRef.current = clientY;
    startHRef.current = height;

    //드래그 중 배경 스크롤 방지
    document.body.style.userSelect = "none";
  };

  const onMouseDown = (e: React.MouseEvent) => beginDrag(e.clientY);
  const onTouchStart = (e: React.TouchEvent) => beginDrag(e.touches[0].clientY);

  const onMove = (clientY: number) => {
    if (!draggingRef.current) return;
    const dy = startYRef.current - clientY;
    const next = Math.max(minH, Math.min(maxH, startHRef.current + dy));
    setHeight(next);
  };

  const onMouseMove = (e: MouseEvent) => onMove(e.clientY);
  const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientY);

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    document.body.style.userSelect = "";

    //가까운 스냅 포인트로
    const candidates = [minH, midH, maxH];
    const snapped =
      candidates.reduce((prev, cur) =>
        Math.abs(cur - height) < Math.abs(prev - height) ? cur : prev
      ) ?? height;
    setHeight(snapped);
  };

  const onMouseUp = () => endDrag();
  const onTouchEnd = () => endDrag();

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [height]);

  useEffect(() => {
    if (!open) return;
    if (!autoSnapOnChange) return;

    if (place || (Array.isArray(logs) && logs.length > 0)) {
      setHeight(snapH);
    }
  }, [open, place, logs?.length, defaultTab, autoSnapOnChange, snapH]);
  const showBackdrop = open && height > minH + 20;

  //탭 콘텐츠
  const content = useMemo(() => {
    if (tab === "place") {
      const introPairs = pickEntriesByType(
        place?.introInfo,
        place?.contentTypeId
      );
      return (
        <PlaceContainer>
          {place?.imageUrl ? (
            <PlaceImage src={place.imageUrl} alt={place.title} />
          ) : (
            ""
          )}
          <PlaceTitle>{place?.title ?? ""}</PlaceTitle>
          {place?.address && (
            <PlaceMeta>
              <Place /> {place.address}
            </PlaceMeta>
          )}
          {typeof place?.star === "number" && (
            <PlaceMeta>
              <Star width={13} height={13} /> {place.star.toFixed(1)}
            </PlaceMeta>
          )}
          {place?.tel && <PlaceMeta>☎ {place.tel}</PlaceMeta>}
          {isFilled(place?.description) && (
            <PlaceDesc>{pretty(place!.description)}</PlaceDesc>
          )}

          {introPairs.length > 0 && (
            <IntroGrid>
              {introPairs.map(([key, val]) => {
                const display = pretty(val);
                if (!isFilled(display)) return null; // 혹시 모를 빈값 방어
                return (
                  <IntroRow key={key}>
                    <IntroLabel>{LABELS[key] ?? key}</IntroLabel>
                    <IntroValue>{String(display)}</IntroValue>
                  </IntroRow>
                );
              })}
            </IntroGrid>
          )}
        </PlaceContainer>
      );
    }
    return (
      <LogContainer>
        <LogCardList items={logs} />
      </LogContainer>
    );
  }, [tab, logs, place]);

  if (!open) return null;

  return (
    <>
      {showBackdrop && (
        <Backdrop
          onClick={() => {
            onBackdropClick?.();
            setHeight(minH);
          }}
        />
      )}
      <Layout style={{ height }}>
        <HeaderWrap>
          <Handle onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
            <HandleBar />
          </Handle>

          <TabContainer>
            <Tabs>
              <TabButton $active={tab === "log"} onClick={() => setTab("log")}>
                살구로그
              </TabButton>
              <TabButton
                $active={tab === "place"}
                onClick={() => setTab("place")}
              >
                지역 정보
              </TabButton>
              <ActiveLine $tab={tab} />
            </Tabs>
          </TabContainer>
        </HeaderWrap>

        <Body>{content}</Body>
      </Layout>
    </>
  );
};

export default BottomSheetModalMap;

const Layout = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 20;
  background: #fff;
  border-radius: 18px 18px 0 0;
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  transition: height 180ms ease;
  will-change: height;
  display: flex;
  flex-direction: column;
  width: 375px;
  padding-bottom: 80px;
`;
const HeaderWrap = styled.div`
  flex: 0 0 ${HEADER_H}px; /* 헤더 전체 고정 높이 */
  display: flex;
  flex-direction: column;
  padding-top: 5px; /* 살짝 띄우고 싶으면 여기서만 조정 */
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 15;
  background: rgba(0, 0, 0, 0.25);
`;
const Handle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${HANDLE_H}px;
  cursor: grab;
`;

const HandleBar = styled.div`
  width: 54px;
  height: 5px;
  border-radius: 3px;
  background: #e6e6e6;
`;

const TabContainer = styled.div`
  padding: 4px 12px 0;
`;

const Tabs = styled.div`
  position: relative;
  display: flex;
  gap: 16px;
  padding: 0px 8px 0 8px;
  height: ${TABS_H}px;
  margin-bottom: 10px;
`;

const TabButton = styled.button<{ $active?: boolean }>`
  background: transparent;
  border: 0;
  padding: 8px 3px 0px 3px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? "#e57a5b" : "#888")};
  cursor: pointer;
`;

const ActiveLine = styled.div<{ $tab: TabKey }>`
  position: absolute;
  left: ${({ $tab }) => ($tab === "log" ? "9px" : "80px")};
  bottom: 0;
  height: 2px;
  width: 53px;
  margin-bottom: 2px;
  background: var(--main-pri);
  transition: left 180ms ease;
`;

const Body = styled.div`
  flex: 1;
  overflow: auto;
  padding: 12px;
  flex: 1;
  overflow: auto;
  padding: 12px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    /* Chrome/Safari */
    display: none;
  }
`;

const LogContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-itmes: center;
  justify-content: center;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PlaceMeta = styled.p`
  display: flex;
  gap: 5px;
  margin: 4px 0 0;
  color: #666;
  font-size: 13px;
  margin: 0 10px;
  align-items: center;
`;

const PlaceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const PlaceImage = styled.img`
  width: 335px;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  background: #f2f2f2;
  align-self: center;
  margin-bottom: 10px;
`;

const PlaceTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  margin: 0 10px;
`;

const PlaceDesc = styled.p`
  margin: 0;
  color: #666;
  line-height: 1.4;
  margin: 0 10px;
`;

const IntroGrid = styled.div`
  display: grid;
  grid-template-columns: 110px 1fr;
  row-gap: 6px;
  column-gap: 8px;
  padding: 4px 10px 0 10px;
`;
const IntroRow = styled.div`
  display: contents;
`;
const IntroLabel = styled.div`
  font-size: 13px;
  color: #888;
`;
const IntroValue = styled.div`
  font-size: 12px;
  white-space: pre-wrap;
  color: #333;
  line-height: 17px;
`;
