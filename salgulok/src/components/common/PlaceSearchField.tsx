import { useEffect, useState } from "react";
import styled from "styled-components";
import { getPlaceSearch } from "../../api/place/place";
import type { APIPlace, PlaceSearchItem } from "../../types/place";
import SearchIcon from "../../assets/common/search.svg?react";

type Props = {
  onPlaceSelect: (place: PlaceSearchItem) => void;
  initialQuery?: string;
};

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

const PlaceSearchField = ({ onPlaceSelect, initialQuery = "" }: Props) => {
  const [query, setQuery] = useState(initialQuery);
  const [searchResult, setSearchResult] = useState<PlaceSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const hasDropdown =
    showResults && (loading || !!error || searchResult.length > 0);

  const readPlaceSearch = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setSearchResult([]);
      setError(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await getPlaceSearch(trimmed);
      const normalized = normalize(toArray(response));
      setSearchResult(normalized);
      if (normalized.length === 0) setError("검색 결과가 없습니다.");
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "검색 중 오류가 발생했습니다.");
      setSearchResult([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showResults) return;
    const t = setTimeout(() => void readPlaceSearch(query), 250);
    return () => clearTimeout(t);
  }, [query, showResults]);

  const handleSelect = (place: PlaceSearchItem) => {
    setQuery(place.name);
    onPlaceSelect(place);
    setShowResults(false);
  };

  return (
    <Layout>
      <SearchField>
        <SearchIconImg as={SearchIcon} />
        <PlaceInput
          value={query}
          placeholder="장소를 입력하세요"
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
        />
      </SearchField>

      {hasDropdown && (
        <ResultsContainer>
          {loading && <ResultWrapper>검색 중…</ResultWrapper>}
          {error && <ErrorWrapper>{error}</ErrorWrapper>}
          {!loading &&
            !error &&
            searchResult.map((r) => (
              <ResultWrapper key={r.id} onMouseDown={() => handleSelect(r)}>
                <RowTop>
                  <strong>{r.name}</strong>
                  {typeof r.star === "number" && (
                    <Star>{r.star.toFixed(1)} ★</Star>
                  )}
                </RowTop>
                <small>{r.address}</small>
              </ResultWrapper>
            ))}
        </ResultsContainer>
      )}
    </Layout>
  );
};

export default PlaceSearchField;

const Layout = styled.div`
  position: relative;
  width: 100%;
`;

const SearchField = styled.div`
  position: relative;
  width: 100%;
  height: 34px;
  border: 1px solid var(--gray-300);
  border-radius: 10px;
  display: flex;
  align-items: center;
  background: var(--white);
  margin-bottom: 12px;
  padding-left: 36px;
  box-sizing: border-box;
`;

const SearchIconImg = styled.img`
  position: absolute;
  left: 10px;
  width: 16px;
  height: 16px;
  pointer-events: none;
`;

const PlaceInput = styled.input`
  flex: 1;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 13px;
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: calc(100% - 4px);
  left: 0;
  right: 0;
  z-index: 10;
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 8px 0;
  max-height: 250px;
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
