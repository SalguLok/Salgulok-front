import styled from "styled-components";
import NavigationBar from "../../components/common/NavigationBar.tsx";
import BottomSheetModalMap from "../../components/map/BottomSheetModalMap.tsx";
import { useEffect, useRef, useState } from "react";
import Search from "../../assets/common/search.svg?react";
import { getPlaceSearch, getLogsByPlace } from "../../api/place/place.ts";
import { useLocation } from "react-router-dom";
import Overlay from "./Overlay.tsx";

type APIPlace = {
  place_id: number;
  placeName: string;
  mapx: number;
  mapy: number;
  content_type_id: number;
  image_url?: string;
  addr1?: string;
  addr2?: string;
  tel?: string;
  overview?: string;
  star?: number;
};

type PlaceSearchItem = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  imageUrl?: string;
  tel?: string;
  overview?: string;
  star?: number;
};

type SheetTab = "log" | "place";

const toArray = (res: any): APIPlace[] =>
  Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

const normalize = (list: APIPlace[]): PlaceSearchItem[] =>
  Array.from(
    new Map(
      list.map((it) => {
        const item: PlaceSearchItem = {
          id: it.place_id,
          name: it.placeName,
          lat: it.mapy,
          lng: it.mapx,
          address: [it.addr1, it.addr2].filter(Boolean).join(" "),
          imageUrl: it.image_url,
          tel: it.tel,
          overview: it.overview,
          star: it.star,
        };
        return [item.id, item] as const;
      })
    ).values()
  );

const MapPage = () => {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<PlaceSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [placeLogs, setPlaceLogs] = useState<
    Array<{
      id: string;
      image: string;
      writer: string;
      writerProfile?: string | null;
      title: string;
      isPublic?: boolean;
      date: string;
      likes: number;
      comments?: number;
    }>
  >([]);

  // 바텀시트에 넘길 선택된 장소 & 탭
  const [selectedPlace, setSelectedPlace] = useState<{
    title: string;
    imageUrl?: string;
    description?: string;
    address?: string;
    tel?: string;
    star?: number;
  } | null>(null);
  const [sheetTab, setSheetTab] = useState<SheetTab>("log");

  // 지도/마커 ref
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);

  // 지도 정보 표시용(디버그)
  const [mapPoint, setMapPoint] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });
  const [location, setLocation] = useState("");

  // Location state
  const { state } = useLocation() as {
    state?: { q?: string; lat?: number; lng?: number; name?: string };
  };
  const initialQ = state?.q;
  const initialLat = state?.lat;
  const initialLng = state?.lng;
  const initialName = state?.name;

  //날짜 포맷
  const yymmdd = (iso: string | undefined) => {
    if (!iso) return "";
    // iso: "2025-09-25"
    const [y, m, d] = iso.split("-");
    return `${y.slice(2)}${m}${d}`;
  };

  const mapLogsResponse = (res: any) => {
    const list = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res)
      ? res
      : [];
    return list.map((it: any) => ({
      id: String(it.logId),
      image: it.imgUrl ?? "",
      writer: it.writer ?? "",
      writerProfile: it.writerProfile ?? null,
      title: it.title ?? "",
      isPublic: true as const,
      date: `${yymmdd(it.startDate)}-${yymmdd(it.endDate)}`,
      likes: it.likes ?? 0,
      comments: 0,
    }));
  };

  // 검색 API
  const readPlaceSearch = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setSearchResult([]);
      setError(null);
      return [];
    }
    try {
      setLoading(true);
      setError(null);
      const response = await getPlaceSearch(trimmed);
      const normalized = normalize(toArray(response));
      setSearchResult(normalized);
      if (normalized.length === 0) setError("검색 결과가 없습니다.");
      return normalized;
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "검색 중 오류가 발생했습니다.");
      setSearchResult([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 디바운스 검색 (입력할 때만 리스트 보여주고, 블러 시 닫힘)
  useEffect(() => {
    if (!showResults) return;
    const t = setTimeout(() => void readPlaceSearch(query), 250);
    return () => clearTimeout(t);
  }, [query, showResults]);

  // 지도 초기화 + 클릭 이벤트
  useEffect(() => {
    if (!mapDivRef.current || !(window as any).naver?.maps) return;

    const m = new window.naver.maps.Map(mapDivRef.current, {
      center: new window.naver.maps.LatLng(37.5665, 126.978),
      zoom: 13,
    });
    mapRef.current = m;

    window.naver.maps.Event.addListener(m, "click", (e: any) => {
      const lng = e.coord.x;
      const lat = e.coord.y;
      setMapPoint({ x: lng, y: lat });

      const pos = new window.naver.maps.LatLng(lat, lng);
      if (!markerRef.current) {
        markerRef.current = new window.naver.maps.Marker({
          map: m,
          position: pos,
        });
      } else {
        markerRef.current.setPosition(pos);
      }

      window.naver.maps.Service.reverseGeocode(
        {
          coords: pos,
          orders: [
            window.naver.maps.Service.OrderType.ADDR,
            window.naver.maps.Service.OrderType.ROAD_ADDR,
          ].join(","),
        },
        (status: number, response: any) => {
          if (status !== window.naver.maps.Service.Status.OK) return;
          const addr = response?.v2?.address?.jibunAddress ?? "";
          setLocation(addr);
          setSelectedPlace({
            title: "선택한 위치",
            address: addr,
            description: "",
          });
          setSheetTab("place");
          setShowResults(false);
        }
      );
    });
  }, []);

  // 초기 진입 처리(좌표 우선 → 검색어)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const focus = (lat: number, lng: number, title: string) => {
      const pos = new window.naver.maps.LatLng(lat, lng);
      map.setCenter(pos);
      map.setZoom(15);
      if (!markerRef.current) {
        markerRef.current = new window.naver.maps.Marker({
          map,
          position: pos,
        });
      } else {
        markerRef.current.setPosition(pos);
      }
      setMapPoint({ x: lng, y: lat });
      setLocation(title);
      setSelectedPlace({ title, description: "", address: "" });
      setSheetTab("place");
      setShowResults(false);
      setQuery(title);
    };

    if (typeof initialLat === "number" && typeof initialLng === "number") {
      const title = initialName || initialQ || "선택한 위치";
      +focus(initialLat, initialLng, title);
      return;
    }

    if (initialQ) {
      setQuery(initialQ);
      setShowResults(true);
      (async () => {
        const list = await readPlaceSearch(initialQ);
        const exact = list.find((r) => r.name === initialQ) ?? list[0];
        if (exact) {
          const pos = new window.naver.maps.LatLng(exact.lat, exact.lng);
          map.setCenter(pos);
          map.setZoom(15);
          if (!markerRef.current) {
            markerRef.current = new window.naver.maps.Marker({
              map,
              position: pos,
            });
          } else {
            markerRef.current.setPosition(pos);
          }
          setMapPoint({ x: exact.lng, y: exact.lat });
          setLocation(exact.address || exact.name);
          setSelectedPlace({
            title: exact.name,
            imageUrl: exact.imageUrl,
            description: exact.overview,
            address: exact.address,
            tel: exact.tel,
            star: exact.star,
          });
          setSheetTab("place");
          setShowResults(false);

          try {
            const response = await getLogsByPlace(exact.id);
            setPlaceLogs(mapLogsResponse(response));
          } catch (e) {
            console.error(e);
            setPlaceLogs([]);
          }
        }
      })();
    }
  }, [mapRef.current]);

  // 검색 결과 클릭
  const focusResult = async (r: PlaceSearchItem) => {
    const map = mapRef.current;
    if (!map) return;

    const pos = new window.naver.maps.LatLng(r.lat, r.lng);
    map.setCenter(pos);
    map.setZoom(15);

    if (!markerRef.current) {
      markerRef.current = new window.naver.maps.Marker({ map, position: pos });
    } else {
      markerRef.current.setPosition(pos);
    }

    setMapPoint({ x: r.lng, y: r.lat });
    setLocation(r.address || r.name);
    setSelectedPlace({
      title: r.name,
      imageUrl: r.imageUrl,
      description: r.overview,
      address: r.address,
      tel: r.tel,
      star: r.star,
    });
    setSheetTab("place");
    setShowResults(false);

    try {
      const response = await getLogsByPlace(r.id);
      setPlaceLogs(mapLogsResponse(response));
    } catch (e) {
      console.error(e);
      setPlaceLogs([]);
    }
  };

  return (
    <Layout>
      <MapContainer>
        <MapCanvas ref={mapDivRef} />
      </MapContainer>

      <Overlay>
        <OverlayTop
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <SearchBar>
            <Search width={18} height={18} />
            <SearchInput
              placeholder="장소를 검색하세요 (예: 제주도)"
              value={query}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setShowResults(true);
                  void readPlaceSearch(query);
                }
              }}
            />
          </SearchBar>

          {showResults && (
            <ResultsContainer>
              {loading && <ResultWrapper>검색 중…</ResultWrapper>}
              {error && <ErrorWrapper>{error}</ErrorWrapper>}
              {!loading &&
                !error &&
                searchResult.length === 0 &&
                query.trim() && (
                  <ResultWrapper>검색 결과가 없습니다.</ResultWrapper>
                )}
              {!loading &&
                !error &&
                searchResult.map((r) => (
                  <ResultWrapper key={r.id} onMouseDown={() => focusResult(r)}>
                    <RowTop>
                      <strong>{r.name}</strong>
                      {typeof r.star === "number" && (
                        <Star>{r.star.toFixed(1)} ★</Star>
                      )}
                    </RowTop>
                    <small>{r.address}</small>
                    {r.tel && <small>{r.tel}</small>}
                  </ResultWrapper>
                ))}
            </ResultsContainer>
          )}
        </OverlayTop>
      </Overlay>

      <Info>
        <div>lng: {mapPoint.x}</div>
        <div>lat: {mapPoint.y}</div>
        <div>주소: {location}</div>
      </Info>

      <div style={{ position: "relative", zIndex: 10 }}>
        <BottomSheetModalMap
          logs={placeLogs}
          place={selectedPlace}
          defaultTab={sheetTab}
        />
      </div>

      <div style={{ position: "relative", zIndex: 20 }}>
        <NavigationBar />
      </div>
    </Layout>
  );
};

export default MapPage;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;
const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  isolation: isolate;
`;
const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  z-index: 1;
`;
const OverlayTop = styled.div`
  position: fixed;
  width: 335px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid var(--gray-300);
  border-radius: 20px;
  padding: 8px 12px;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  pointer-events: auto;
`;
const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
`;
const ResultsContainer = styled.div`
  pointer-events: auto;
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 8px 0;
  max-height: 50vh;
  overflow: auto;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
`;
const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  cursor: pointer;
  &:hover {
    background: #fafafa;
  }
  & > strong {
    font-size: 14px;
  }
  & > small {
    font-size: 12px;
    color: #666;
  }
`;
const ErrorWrapper = styled(ResultWrapper)`
  color: #c00;
`;
const RowTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  & > strong {
    font-size: 14px;
  }
`;
const Star = styled.span`
  font-size: 12px;
  color: #f39c12;
`;
const Info = styled.div`
  padding: 8px 16px;
`;
