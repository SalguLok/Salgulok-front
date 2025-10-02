import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import NavigationBar from "../../components/common/NavigationBar";
import LogCardList from "../../components/common/CardListItem";
import type { LogItem } from "../../components/common/CardListItem";
import HeaderLeft from "../../components/common/HeaderLeft";
import { searchLogs } from "../../api/log/searchLogs";
import { getLogComments } from "../../api/log/logComment";
import SearchBar from "../../components/log/SearchBar";
import FilterBar from "../../components/log/FilterBar";
import Pagination from "../../components/common/Pagination";
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
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 350);
  const cacheRef = useRef<Map<string, LogItem[]>>(new Map());
  const abortRef = useRef<AbortController | null>(null);

  const [sort, setSort] = useState<"latest" | "view" | "like">("latest");
  const [regionId, setRegionId] = useState<number | null>(null);
  const [page, setPage] = useState(1); // UI 1-based
  const [totalPages, setTotalPages] = useState(1);

  const regionOptions = regions.map((r) => ({ id: r.id, name: r.nameKo }));

  type AnyLogs = any[] | { logs?: any[]; items?: any[] } | null | undefined;
  const toArray = (r: AnyLogs) =>
    (Array.isArray(r) ? r : r?.logs ?? r?.items ?? []) as any[];

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

  const handleSubmitSearch = (value: string) => {
    setQuery(value.trim());
    setPage(1); // 검색 시 페이지 초기화
  };

  const makeKey = useCallback(
    (q: string, s: string, r: number | null, p: number) =>
      `q=${q || ""}|s=${s}|r=${r ?? ""}|p=${p}`,
    []
  );

  const fetchLogs = useCallback(
    async (opts: {
      q: string;
      s: "latest" | "view" | "like";
      r: number | null;
      p: number;
    }) => {
      const key = makeKey(opts.q, opts.s, opts.r, opts.p);

      if (cacheRef.current.has(key)) {
        setLogs(cacheRef.current.get(key)!);
        return;
      }

      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      try {
        // opts.p는 1-based → API는 0-based
        const res: any = await searchLogs(
          opts.q,
          opts.s,
          opts.r ?? 0,
          opts.p - 1
        );
        const data = toArray(res);

        const processed = processLogItems(data);

        // 댓글 수 추가 조회
        const logsWithComments = await Promise.all(
          processed.map(async (log) => {
            try {
              const commentsData = await getLogComments(log.id, {
                page: 0,
                size: 1,
                sort: "createdAt",
              });
              return { ...log, comments: commentsData.totalElements };
            } catch (error) {
              console.error(`로그 ${log.id} 댓글 수 조회 실패:`, error);
              return { ...log, comments: 0 };
            }
          })
        );

        cacheRef.current.set(key, logsWithComments);
        setLogs(logsWithComments);

        setTotalPages(res.totalPages ?? 1);
      } catch (e) {
        console.error("로그 불러오기 실패:", e);
        setLogs([]);
        setTotalPages(1);
      }
    },
    [makeKey, processLogItems]
  );

  useEffect(() => {
    fetchLogs({ q: debouncedQuery, s: sort, r: regionId, p: page });
  }, [debouncedQuery, sort, regionId, page, fetchLogs]);

  return (
    <Container>
      <HeaderLeft title="살구로그" />

      <SearchRow>
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmitSearch}
          placeholder="검색을 통해 로그를 찾아보세요"
        />
      </SearchRow>

      <ActionContainer>
        <FilterBarContainer>
          <FilterBar
            regions={regionOptions}
            defaultSort="latest"
            defaultRegionId={null}
            onChangeSort={setSort}
            onChangeRegion={setRegionId}
          />
        </FilterBarContainer>
      </ActionContainer>

      <ContentWrapper>
        <CardContainer>
          <LogCardList items={logs} />
        </CardContainer>

        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
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

const SearchRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  padding: 0 16px;
  box-sizing: border-box;
  overflow: visible;
  z-index: 1;
  margin-top: 10px;
`;

const FilterBarContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 0 16px;
`;
