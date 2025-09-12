// src/pages/log/LogPage.tsx
import React, { memo } from "react";
import styled from "styled-components";
import NavigationBar from "../../components/common/NavigationBar";
import LogCardList from "../../components/common/CardListItem";
import type { LogItem } from "../../components/common/CardListItem";

import searchIcon from "../../assets/common/search.svg";

const mock: LogItem[] = [
    { id: "1", image: "/imgs/travel1.jpg", writer: "여행이좋아요", writerProfile: "", title: "25년 여름 제주는 아름다워", date: "250703-250807", likes: 17, comments: 25 },
    { id: "2", image: "/imgs/travel2.jpg", writer: "여행이좋아요", title: "산토리니 블루", date: "250703-250807", likes: 12, comments: 9 },
    { id: "3", image: "/imgs/travel2.jpg", writer: "여행이좋아요", title: "산토리니 블루", date: "250703-250807", likes: 12, comments: 9 },
    { id: "4", image: "/imgs/travel1.jpg", writer: "여행이좋아요", writerProfile: "", title: "25년 여름 제주는 아름다워", date: "250703-250807", likes: 17, comments: 25 },
    { id: "5", image: "/imgs/travel2.jpg", writer: "여행이좋아요", title: "산토리니 블루", date: "250703-250807", likes: 12, comments: 9 },
    { id: "6", image: "/imgs/travel2.jpg", writer: "여행이좋아요", title: "산토리니 블루", date: "250703-250807", likes: 12, comments: 9 },
];

const recentKeywords = ["카페", "바다수영", "부산맛집", "회맛집", "제주도"];
const popularKeywords = ["제주", "부산", "해수욕장", "카페", "계곡", "제주", "글램핑", "워케이션", "공방", "템플스테이"];

const LogPage: React.FC = () => {
    return (
        <Layout>
            <SearchBar>
                <SearchIconImg src={searchIcon} alt="검색" />
                <SearchInput placeholder="검색을 통해 로그를 찾아보세요" />
            </SearchBar>

            <Section>
                <SectionHeader title="최근 검색 키워드" />
                <ChipsRow>
                    {recentKeywords.map((k) => (
                        <Chip key={k} aria-label={`${k} 검색`}>
                            {k} <ChipClose aria-hidden>×</ChipClose>
                        </Chip>
                    ))}
                </ChipsRow>
            </Section>

            <Section>
                <SectionHeader title="인기 검색 키워드" />
                <RankGrid>
                    {popularKeywords.map((k, i) => (
                        <RankItem key={`${k}-${i}`}>
                            <RankNo>{i + 1}</RankNo>
                            <span>{k}</span>
                        </RankItem>
                    ))}
                </RankGrid>
            </Section>

            {/* 가로 스크롤 카드 리스트 */}
            <Section>
                <SectionHeader title="이번 달 인기 살구로그" />
                <CardsRow role="list" aria-label="이번 달 인기 살구로그">
                    {mock.map((item) => (
                        <CardCell key={item.id} role="listitem">
                            {/* LogCardList가 '여러 개'를 렌더하는 컴포넌트라서
                  단일 카드로 쓰기 위해 1개짜리 배열을 넘겨 재사용 */}
                            <LogCardList items={[item]} onClick={(id) => console.log("open", id)} />
                        </CardCell>
                    ))}
                </CardsRow>
            </Section>

            <BottomSpace />
            <NavigationBar />
        </Layout>
    );
};

export default LogPage;

/* ========== 작은 컴포넌트들 ========== */
const SectionHeader: React.FC<{ title: string; onMoreClick?: () => void }> = memo(
    ({ title, onMoreClick }) => (
        <SectionHead>
            <SectionTitle>{title}</SectionTitle>
            <MoreBtn type="button" onClick={onMoreClick}>더보기</MoreBtn>
        </SectionHead>
    )
);

/* ========== styles ========== */
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: #fff;
`;

/* 🔍 검색바 */
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 12px 20px;
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  background: #fff;
`;

const SearchIconImg = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-size: 13px;
  color: #333;

  &::placeholder { color: #aaa; }
`;

/* 공통 섹션 */
const Section = styled.section`
  padding: 0 20px 16px 20px;
`;

const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 14px 0 10px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #111;
  letter-spacing: -0.2px;
`;

const MoreBtn = styled.button`
  border: 0;
  background: transparent;
  color: #999;
  font-size: 12px;
  padding: 4px 6px;
  cursor: pointer;
`;

/* 최근 키워드 칩 */
const ChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #eee;
  border-radius: 999px;
  background: #fafafa;
  color: #333;
  font-size: 13px;
  line-height: 1;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const ChipClose = styled.span`
  font-size: 12px;
  color: #aaa;
`;

/* 인기 키워드 랭킹 */
const RankGrid = styled.ol`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 10px;
  column-gap: 20px;
  padding-left: 2px;
  margin: 0;
  list-style: none;
`;

const RankItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  font-size: 14px;
`;

const RankNo = styled.span`
  width: 16px;
  text-align: right;
  font-weight: 700;
  color: #e78254; /* 포인트 컬러 */
`;

/* 가로 스크롤 카드 레이아웃 */
const CardsRow = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding: 2px 0 10px;

  /* 스크롤바 숨김 */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const CardCell = styled.div`
  flex: 0 0 auto;
  width: 180px; /* 카드 가로 폭은 프로젝트 카드 스타일에 맞게 조절 */
`;

const BottomSpace = styled.div`
  height: 80px; /* 하단 네비 여백 */
`;
