import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import NavigationBar from "../../components/common/NavigationBar";
import LogCardList from "../../components/common/CardListItem";
import type { LogItem } from "../../components/common/CardListItem";
import HeaderLeft from "../../components/common/HeaderLeft";
import { getPublicLogs } from "../../api/log/getPublicLogs";
import { issueGetPresigned } from "../../api/image/issueGetPresigned";
import SearchIcon from "../../assets/common/search.svg?react";
import { searchLogs } from "../../api/log/searchLogs";
import SearchBar from "../../components/log/SearchBar";

const LogPage: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const isInitialQueryEffect = useRef(true);

  useEffect(() => {
    if (isInitialQueryEffect.current) {
      isInitialQueryEffect.current = false;
      return;
    }
    if (query === "") {
      fetchAllPublicLogs();
    }
  }, [query]);

  // presigned GET URL로 변환 헬퍼
  const toUrl = async (objectKey?: string | null): Promise<string> => {
    if (!objectKey) return "";
    try {
      const res = await issueGetPresigned(objectKey);
      if (res.items && res.items.length > 0) {
        return res.items[0].presignedUrl;
      }
      return "";
    } catch {
      return "";
    }
  };

  // API 응답을 LogItem으로 변환하는 공통 함수
  const processLogItems = (items: any[]): Promise<LogItem[]> => {
    return Promise.all(
      items.map(async (log) => {
        const [imageUrl, writerProfileUrl] = await Promise.all([
          toUrl(log.imgUrl),
          toUrl(log.writerProfile),
        ]);
        return {
          id: log.logId ?? log.id,
          title: log.title,
          writer: log.writer,
          image: imageUrl,
          writerProfile: writerProfileUrl,
          likes: log.likes,
          isPublic: log.isPublic,
          date: `${log.startDate} - ${log.endDate}`,
          comments: log.comments ?? 0,
          oneLine: log.oneReview,
        } as LogItem;
      })
    );
  };

  // 전체 공개 로그를 불러오는 함수
  const fetchAllPublicLogs = async () => {
    setLoading(true);
    try {
      const logsRes = await getPublicLogs();
      const processedLogs = await processLogItems(logsRes);
      setLogs(processedLogs);
    } catch (err) {
      console.error("공개 살구록 리스트 불러오기 실패:", err);
      setLogs([]); // 실패 시 빈 배열로
    } finally {
      setLoading(false);
    }
  };

  // 살구록 검색 함수
  const handleSearch = async (q: string) => {
    setLoading(true);
    try {
      const { logs } = await searchLogs(q);
      const processedLogs = await processLogItems(logs ?? []);
      setLogs(processedLogs);
    } catch (e) {
      console.error("검색 실패:", e);
      setLogs([]); // 실패 시 빈 배열로
    } finally {
      setLoading(false);
    }
  };

  // 검색 제출 처리 함수
  const handleSubmitSearch = (value: string) => {
    const trimmedValue = value.trim();
    setShowSearch(false); // 검색창 닫기

    if (trimmedValue) {
      setQuery(trimmedValue);
      handleSearch(trimmedValue);
    } else {
      // 검색어가 없는 경우
      if (query !== "") {
        // 기존 검색어가 있었다면 query를 ""로 바꿔서 useEffect를 트리거
        setQuery("");
      } else {
        // 기존 검색어도 없었다면, useEffect가 실행되지 않으므로 직접 호출
        fetchAllPublicLogs();
      }
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchAllPublicLogs();
  }, [location]);

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
            !showSearch && ( // ✅ 검색바가 열렸을 땐 아이콘 숨김
                <IconButton aria-label="검색" onClick={() => setShowSearch(true)} title="검색">
                    <SearchIcon />
                </IconButton>
            )
        }
      />

        {showSearch && (
            <SearchRow ref={searchBarRef}>
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    onSubmit={handleSubmitSearch}
                    placeholder="검색을 통해 로그를 찾아보세요"
                />
            </SearchRow>
        )}

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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
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
  padding: 0 16px;
  margin-top: 16px;
  margin-bottom: 4px;
    box-sizing: border-box;
    overflow: visible;    
    z-index: 1;
`;
