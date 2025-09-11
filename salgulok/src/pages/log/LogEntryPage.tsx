import { useRef, useState } from "react";
import styled from "styled-components";
import TemplateCard from "../../components/common/TemplateCard";

export default function LogEntryPage() {
    // 템플릿 카드의 폼 상태 (필요 시 여러 개로 확장 가능)
    const [place, setPlace] = useState("");
    const [text, setText] = useState("");
    const [thumb, setThumb] = useState<string | undefined>(undefined);

    // 로컬 파일 선택을 위한 숨겨진 input
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddPhoto = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setThumb(objectUrl);
    };

    const handleSaveTemplate = () => {
        console.log("[LogEntryPage] 템플릿 저장", { place, text, thumb });
    };

    const handleSearchPlace = () => {
        console.log("[LogEntryPage] 장소 검색 클릭");
    };

    const handleAddTemplate = () => {
        console.log("[LogEntryPage] 템플릿 추가");
    };

    const handleSubmit = () => {
        console.log("[LogEntryPage] 등록 클릭", { place, text, thumb });
    };

    // 더미 데이터: 날짜 썸네일(원형)
    const dayThumbs = [
        { date: "8/9", img: "https://picsum.photos/seed/d1/80/80" },
        { date: "8/10", add: true }, // + 버튼
        { date: "8/11", img: "https://picsum.photos/seed/d3/80/80" },
        { date: "8/12", img: "https://picsum.photos/seed/d4/80/80" },
        { date: "8/13", img: "https://picsum.photos/seed/d5/80/80", active: true },
        { date: "8/15", img: "https://picsum.photos/seed/d6/80/80" },
        { date: "8/18", img: "https://picsum.photos/seed/d7/80/80" },
    ];

    // 더미 데이터: 상단 미리보기 카드
    const preview = {
        title: "함덕해수욕장",
        rank: 1,
        images: [
            "https://picsum.photos/seed/p1/280/200",
            "https://picsum.photos/seed/p2/280/200",
        ],
        rating: 4,
        text:
            "너무너무 좋은 추억 많이 쌓고 갑니다~~~ 세화 해변에 스노클링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노클링 장비 빌릴 수 있는 곳 있나요? 세화 해변에 스노클링 장비 빌릴 수 있는 곳 있나요?",
    };

    return (
        <Page>
            {/* 숨겨진 파일 입력 */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            {/* 상단 헤더/타이틀 */}
            <HeaderBar>
                <BackIcon aria-hidden>‹</BackIcon>
                <HeaderTitle>25년 여름 제주</HeaderTitle>
                <Spacer />
            </HeaderBar>

            <MainTitle>25년 여름 제주</MainTitle>
            <Period>2025.07.03~2025.08.07</Period>

            {/* 날짜 동그란 썸네일 스크롤 */}
            <DayScroll>
                {dayThumbs.map((d, idx) => (
                    <DayItem key={idx} $active={!!d.active} title={d.date}>
                        {d.add ? (
                            <AddCircle role="img" aria-label="추가">＋</AddCircle>
                        ) : (
                            <ThumbCircle src={d.img} alt="" loading="lazy" />
                        )}
                        <DayText>{d.date}</DayText>
                    </DayItem>
                ))}
            </DayScroll>

            {/* 상단 템플릿 미리보기 카드 */}
            <PreviewCard>
                <PreviewHeader>
                    <Emoji>🍑</Emoji>
                    <PreviewTitle>
                        <Rank>1</Rank> {preview.title}
                    </PreviewTitle>
                    <MoreBtn aria-label="more">⋮</MoreBtn>
                </PreviewHeader>

                <PreviewImages>
                    <PreviewImg src={preview.images[0]} alt="" />
                    <PreviewImg src={preview.images[1]} alt="" />
                </PreviewImages>

                <PreviewStars>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} $filled={i < preview.rating}>★</Star>
                    ))}
                </PreviewStars>

                <PreviewText>{preview.text}</PreviewText>
            </PreviewCard>

            {/* 입력용 템플릿 카드 (공통 컴포넌트 사용) */}
            <Section>
                <TemplateCard
                    showSave
                    onSave={handleSaveTemplate}
                    photoThumbUrl={thumb}
                    onClickAddPhoto={handleAddPhoto}
                    place={place}
                    onChangePlace={setPlace}
                    onClickSearchPlace={handleSearchPlace}
                    text={text}
                    onChangeText={setText}
                    maxLength={300}
                />
            </Section>

            {/* 하단 버튼 바 */}
            <BottomBar>
                <GhostButton type="button" onClick={handleAddTemplate}>
                    추가
                </GhostButton>
                <PrimaryButton type="button" onClick={handleSubmit}>
                    등록
                </PrimaryButton>
            </BottomBar>
        </Page>
    );
}

/* ============== styles ============== */

const Page = styled.div`
  width: 100%;
  min-height: 100dvh;
  box-sizing: border-box;
  padding: 12px 12px 84px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const HeaderBar = styled.div`
  height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BackIcon = styled.span`
  font-size: 22px;
  line-height: 1;
  color: var(--black);
`;

const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  flex: 1;
  text-align: center;
`;

const Spacer = styled.div`
  width: 22px; /* back 아이콘 대칭용 */
`;

const MainTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0 2px;
`;

const Period = styled.div`
  color: var(--gray-400);
  font-size: 12px;
  margin: -6px 2px 4px;
`;

const DayScroll = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 6px 2px 10px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const DayItem = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 54px;
  opacity: ${(p) => (p.$active ? 1 : 0.7)};
`;

const ThumbCircle = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 999px;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
`;

const AddCircle = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 1.5px dashed var(--gray-300);
  color: var(--gray-400);
  font-size: 18px;
`;

const DayText = styled.span`
  font-size: 11px;
  color: var(--gray-500);
`;

const PreviewCard = styled.article`
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--gray-200);
  padding: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
`;

const Emoji = styled.span`
  font-size: 16px;
`;

const PreviewTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Rank = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 6px;
  background: #ffefe7;
  color: #e78254;
  font-size: 11px;
  font-weight: 800;
  display: grid;
  place-items: center;
`;

const MoreBtn = styled.button`
  border: 0;
  background: transparent;
  font-size: 18px;
  line-height: 1;
  color: var(--gray-500);
  cursor: pointer;
`;

const PreviewImages = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 8px 0 10px;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 116px;
  object-fit: cover;
  border-radius: 10px;
`;

const PreviewStars = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
`;

const Star = styled.span<{ $filled?: boolean }>`
  font-size: 14px;
  color: ${(p) => (p.$filled ? "#E78254" : "var(--gray-300)")};
`;

const PreviewText = styled.p`
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  color: #333;
  border: 1px solid var(--gray-200);
  border-radius: 10px;
  padding: 10px 12px;
`;

/* 입력용 영역 (TemplateCard 공통 컴포넌트) */
const Section = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0;
  background: transparent;   /* ← 흰 배경 제거 */
  border: none;              /* ← 테두리 제거 */
  box-shadow: none;          /* ← 그림자 제거 */
`;


/* 하단 버튼 바 */
const BottomBar = styled.div`
  position: sticky;
  bottom: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 6px;
  background: transparent;
`;

const GhostButton = styled.button`
  min-width: 72px;
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #f0d0be;
  background: #fff;
  color: var(--main-pri, #E78254);
  font-weight: 600;
    font-size: 15px;
  cursor: pointer;
`;

const PrimaryButton = styled.button`
  min-width: 72px;
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  border: 0;
  background: var(--main-pri, #E78254);
  color: #fff;
  font-weight: 700;
    font-size: 15px;
  cursor: pointer;
`;
