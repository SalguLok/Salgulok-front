import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import NavigationBar from "../../components/common/NavigationBar";
import LogCardList from "../../components/common/CardListItem";
import type { LogItem } from "../../components/common/CardListItem";
import HeaderLeft from "../../components/common/HeaderLeft";
import { getPublicLogs } from "../../api/log/getPublicLogs";
import SearchIcon from "../../assets/common/search.svg?react";
import { searchLogs } from "../../api/log/searchLogs";
import SearchBar from "../../components/log/SearchBar";
import FilterBar from "../../components/log/FilterBar";
import { regions } from "../../data/regions";

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}


const LogPage: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 350);
  const cacheRef = useRef<Map<string, LogItem[]>>(new Map());
  const abortRef = useRef<AbortController | null>(null);

  // 필터 상태
  const [sort, setSort] = useState("latest");
  const [regionId, setRegionId] = useState<number | null>(null);

  const regionOptions = regions.map((r) => ({ id: r.id, name: r.nameKo }));

  const processLogItems = useCallback((items: any[]): LogItem[] => {
    return items.map((log) => ({
      id: log.logId ?? log.id,
      title: log.title,
      writer: log.writer,
      image: log.imgUrl,
      writerProfile: log.writerProfile,
      likes: log.likes,
      isPublic: log.isPublic,
      date: `${log.startDate} - ${log.endDate}`,
      comments: log.comments ?? 0,
      oneLine: log.oneReview,
    }));
  }, []);


  // 검색 제출 처리
  const handleSubmitSearch = (value: string) => {
    setShowSearch(false);
    setQuery(value.trim());
  };

  const makeKey = useCallback(
      (q: string, s: string, r: number | null) => `q=${q || ""}|s=${s}|r=${r ?? ""}`,
      []
  );

  // 살구로그 목록 가져오기 (검색/정렬/지역 포함) + 캐시/요청취소 관리
  const fetchLogs = useCallback(
      async (opts: { q: string; s: string; r: number | null }) => {
        const key = makeKey(opts.q, opts.s, opts.r);

        if (cacheRef.current.has(key)) {
          setLogs(cacheRef.current.get(key)!);
          return;
        }

        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();

        setLoading(true);
        try {
          let data: any[];
          if (opts.q && opts.q.trim()) {
            const { logs } = await searchLogs(opts.q);
            data = logs ?? [];
          } else {
            const res = await getPublicLogs(); // 서버가 sort/region 받으면 여기 파라미터 붙이면 됨
            data = Array.isArray(res) ? res : (res?.logs ?? res?.items ?? []);
          }
          const processed = processLogItems(data);
          cacheRef.current.set(key, processed);
          setLogs(processed);
        } catch (e: any) {
          if (e?.name !== "AbortError") {
            console.error("로그 불러오기 실패:", e);
            setLogs([]);
          }
        } finally {
          setLoading(false);
        }
      },
      [makeKey, processLogItems]
  );


  // useEffect(() => {
  //   fetchLogs({ q: "", s: "latest", r: null });
  // }, [fetchLogs]);

  useEffect(() => {
    fetchLogs({ q: debouncedQuery, s: sort, r: regionId });
  }, [debouncedQuery, sort, regionId, fetchLogs]);


  // 검색창 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }
    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  return (
    <Container>
      <HeaderLeft
        title="살구로그"
        right={
            !showSearch && (
                <IconButton aria-label="검색" onClick={() => setShowSearch(true)} title="검색">
                    <SearchIcon />
                </IconButton>
            )
        }
      />

        <ActionContainer>
            {showSearch ? (
                <SearchRow ref={searchBarRef}>
                    <SearchBar
                        value={query}
                        onChange={setQuery}
                        onSubmit={handleSubmitSearch}
                        placeholder="검색을 통해 로그를 찾아보세요"
                    />
                </SearchRow>
            ) : (
                <FilterBarContainer>
                    <FilterBar
                        regions={regionOptions}
                        onChangeSort={(key) => setSort(key)}
                        onChangeRegion={(id) => setRegionId(id)}
                    />
                </FilterBarContainer>
            )}
        </ActionContainer>

        <ContentWrapper>
          <CardContainer>
            <LogCardList items={logs} />
          </CardContainer>
        </ContentWrapper>
      <NavigationBar />
    </Container>
  );
};

export default LogPage;

// ===== styled =====
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 67px; /* NavigationBar height */
`;

const ActionContainer = styled.div`
    height: 56px;
    display: flex;
    align-items: center;
    padding-top: 4px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  gap: 16px;
  align-items: center;
  width: 100%;
`;

const CardContainer = styled.div`
  display: flex;
  margin: 0 20px;
`;

const IconButton = styled.button`
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;
  position: relative;
    
    &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  & > svg {
    width: 20px;
    height: 20px;
    display: block;
    top: -5px;
    position: relative;
  }
`;

const SearchRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  box-sizing: border-box;
  overflow: visible;
  z-index: 1;
`;

const FilterBarContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 0 16px;
`;
