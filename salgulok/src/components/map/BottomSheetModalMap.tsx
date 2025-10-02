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

type PlaceInfo = {
  title: string;
  imageUrl?: string;
  description?: string;
  address?: string;
  tel?: string;
  star?: number;
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
      return (
        <PlaceContainer>
          {place?.imageUrl ? (
            <PlaceImage src={place.imageUrl} alt={place.title} />
          ) : (
            <ImagePlaceholder />
          )}
          <PlaceTitle>{place?.title ?? ""}</PlaceTitle>
          {place?.address && (
            <PlaceMeta>
              <Place />
              {place.address}
            </PlaceMeta>
          )}
          {typeof place?.star === "number" && (
            <PlaceMeta>
              <Star width={13} height={13} /> {place.star.toFixed(1)}
            </PlaceMeta>
          )}
          {place?.tel && <PlaceMeta>☎ {place.tel}</PlaceMeta>}
          {place?.description ? (
            <PlaceDesc>{place.description}</PlaceDesc>
          ) : null}
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

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 12px;
  background: #ffff;
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
