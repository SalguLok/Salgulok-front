import styled from "styled-components";
import NavigationBar from "../../components/common/NavigationBar.tsx";
import BottomSheetModalMap from "../../components/map/BottomSheetModalMap.tsx";
import { useEffect, useRef, useState } from "react";
import Search from "../../assets/common/search.svg?react";
import { getPlaceSearch } from "../../api/place.ts";

const MapPage = () => {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  //장소 검색 API 연결
  const readPlaceSearch = async () => {
    try {
      const response = await getPlaceSearch(query);
      //setSearchResult(response.data);
      return response;
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    readPlaceSearch();
  });

  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapPoint, setMapPoint] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });
  const [location, setLocation] = useState("");

  useEffect(() => {
    // 1) 스크립트 로딩/컨테이너 존재/사이즈 보장
    if (!mapRef.current) return;
    if (!(window as any).naver?.maps) return;

    // 2) 맵 생성 (센터/줌 지정 권장)
    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.5665, 126.978),
      zoom: 13,
    });

    // 3) 이벤트는 map 객체에
    window.naver.maps.Event.addListener(map, "click", (e: any) => {
      const lng = e.coord.x;
      const lat = e.coord.y;
      setMapPoint({ x: lng, y: lat });

      window.naver.maps.Service.reverseGeocode(
        {
          coords: new window.naver.maps.LatLng(lat, lng),
          orders: [
            window.naver.maps.Service.OrderType.ADDR,
            window.naver.maps.Service.OrderType.ROAD_ADDR,
          ].join(","),
        },
        (status: number, res: any) => {
          if (status !== window.naver.maps.Service.Status.OK) return;
          setLocation(res?.v2?.address?.jibunAddress ?? "");
        }
      );
    });
  }, []);

  return (
    <Layout>
      <MapContainer>
        <MapCanvas ref={mapRef} />

        <OverlayTop>
          <SearchBar>
            <Search width={18} height={18} />
            <SearchInput
              placeholder="검색어를 입력하세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </SearchBar>
        </OverlayTop>
      </MapContainer>

      <div>{mapPoint.x}</div>
      <div>{mapPoint.y}</div>
      <div>주소는 : {location}</div>

      <div style={{ position: "relative", zIndex: 10 }}>
        <BottomSheetModalMap
          logs={[
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
          ]}
          place={{
            title: "세화해수욕장",
            imageUrl: "https://images.example.com/jeju-sehwa.jpg",
            description: "맑은 물과 잔잔한 파도로 유명한 해변",
          }}
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
`;

const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
`;

const OverlayTop = styled.div`
  position: absolute;
  top: 12px;
  left: 16px;
  right: 16px;
  z-index: 2000;
  pointer-events: none; /* 컨테이너는 클릭 통과 */
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid var(--gray-300);
  border-radius: 20px;
  padding: 8px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  pointer-events: auto; /* 내부만 클릭 가능 */
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
`;
