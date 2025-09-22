import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/common/Header";

import LogDetailHeader from "../../components/log/LogDetailIHeader";
import TemplateCard from "../../components/common/TemplateCard";
import TemplateCardDone from "../../components/log/TemplateCardDone";
import LogEntryList from "../../components/log/LogEntryList";

import { useEffect, useState } from "react";
import { getLogDetail } from "../../api/log/getLogDetail";
import { getLogEntryByDate } from "../../api/logEntry/getLogEntryByDate";
import LogCommentSection from "../../components/log/LogCommentSection";

const LogEntryPage: React.FC = () => {
  const { logId } = useParams<{ logId: string }>();
  const currentUserId = parseInt(localStorage.getItem("userId") || "0");
  const numericLogId = Number(logId);

  const [logDetail, setLogDetail] = useState<{
    isPublic: boolean;
    oneReview: string;
    startDate: string;
    endDate: string;
    ownerId: number;
  } | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<{
    date: string;
    isNew: boolean;
  } | null>(null);
  
  // 각 날짜별 SalguItem 상태 관리
  const [salguItemStates, setSalguItemStates] = useState<Map<string, "yes" | "no">>(new Map());

  type EditState = {
    logId: number;
    entryId: number;
    templateId: number;
    text: string;
    star: number;
    images?: string[];
  } | null;

  const [editing, setEditing] = useState<EditState>(null);

  type CardData = {
    id: number;
    placeId: number;
    placeName: string;
    logId: number;
    entryId: number;
    templateId: number;
    title: string;
    images: string[];
    rating: number;
    review: string;
    isEditing?: boolean; // 편집 중인 템플릿인지
    isNew?: boolean; // 새로 생성하는 템플릿인지
  };
  const [cards, setCards] = useState<CardData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  selectedDate;

  // editingTemplate이 있을 때 cards에 편집 중인 템플릿 추가
  useEffect(() => {
    if (editingTemplate && editingTemplate.isNew) {
      const newEditingCard: CardData = {
        id: -1, // 임시 ID
        placeId: 0,
        placeName: "",
        logId: numericLogId,
        entryId: 0,
        templateId: -1, // 임시 ID
        title: "새 템플릿",
        images: [],
        rating: 0,
        review: "",
        isEditing: true,
        isNew: true,
      };
      setCards(prev => [...prev, newEditingCard]);
    }
  }, [editingTemplate, numericLogId]);

  type TemplateImage = { imageUrl: string };
  type TemplateSummary = {
    templateId: number;
    placeId: number;
    text: string;
    star: number;
    images?: TemplateImage[];
    placeName?: string;
  };
  type EntryByDateResponse = {
    logId: number;
    entryDate: string;
    entryId: number | null;
    templateCount: number;
    templates: TemplateSummary[];
  };

  const toCards = (
    logId: number,
    entryId: number | null,
    templates: TemplateSummary[] = []
  ): CardData[] =>
    templates.map((t, i) => ({
      id: t.templateId,
      placeId: t.placeId,
      placeName: t.placeName ?? "",
      logId,
      entryId: entryId ?? 0,
      templateId: t.templateId,
      title: t.placeName ?? `템플릿 ${i + 1}`,
      images: t.images?.map((x) => x.imageUrl) ?? [],
      rating: t.star ?? 0,
      review: t.text ?? "",
    }));


  const handleSalguItemClick = async (date: string) => {
    if (!numericLogId) return;
    setSelectedDate(date);
    const data: EntryByDateResponse = await getLogEntryByDate(
      numericLogId,
      date
    );
    console.log("data", data);
    
    // SalguItem 상태 업데이트
    const hasTemplates = data.templateCount > 0 && data.templates && data.templates.length > 0;
    setSalguItemStates(prev => new Map(prev).set(date, hasTemplates ? "yes" : "no"));
    
    // 템플릿이 없는 빈 날짜인 경우 새 템플릿 편집 모드
    if (data.templateCount === 0 || (data.templates && data.templates.length === 0)) {
      setEditingTemplate({ date, isNew: true });
      setCards([]); // 빈 배열로 설정
    } else {
      setCards(toCards(data.logId, data.entryId, data.templates ?? []));
      setEditingTemplate(null);
    }
  };

  useEffect(() => {
    if (!numericLogId) return;
    (async () => {
      const detail = await getLogDetail(numericLogId);
      setLogDetail({
        startDate: detail.startDate,
        endDate: detail.endDate,
        isPublic: detail.isPublic,
        oneReview: detail.oneReview,
        ownerId: detail.ownerId,
      });
      setEditingTemplate(null);
    })();
  }, [numericLogId]);

  if (!numericLogId) return null;

  return (
    <Container>
      <Header title="살구로그" showBackButton />
      <div style={{ marginTop: "15px" }}>
        <LogDetailHeader logId={numericLogId} />
      </div>

      {logDetail && (
        <LogEntryList
          logId={numericLogId}
          startDate={logDetail.startDate}
          endDate={logDetail.endDate}
          onItemClick={handleSalguItemClick}
          isOwner={currentUserId === logDetail.ownerId}
          salguItemStates={salguItemStates}
        />
      )}

      {cards.map((c, idx) => (
        <TemplateContainer key={c.id}>
          {c.isEditing && c.isNew ? (
            // 새로 생성하는 템플릿
            <TemplateCard
              logId={c.logId}
              entryDate={editingTemplate?.date ?? ""}
              mode="create"
              onSaved={async () => {
                // 저장 후 해당 날짜 데이터 새로고침
                if (editingTemplate?.date) {
                  const data: EntryByDateResponse = await getLogEntryByDate(
                    numericLogId,
                    editingTemplate.date
                  );
                  setCards(toCards(data.logId, data.entryId, data.templates ?? []));
                  
                  // SalguItem 상태를 "yes"로 업데이트
                  setSalguItemStates(prev => new Map(prev).set(editingTemplate.date, "yes"));
                  
                  setEditingTemplate(null);
                }
              }}
              onCancel={() => {
                setEditingTemplate(null);
                setCards(prev => prev.filter(card => !card.isEditing || !card.isNew));
              }}
            />
          ) : editing?.templateId === c.templateId ? (
            // 기존 템플릿 편집
            <TemplateCard
              logId={editing.logId}
              entryDate={selectedDate ?? ""}
              mode="edit"
              entryId={editing.entryId}
              templateId={editing.templateId}
              initialText={editing.text}
              initialStar={editing.star}
              initialImages={editing.images}
              onSaved={({ text, star }) => {
                setCards((prev) =>
                  prev.map((it) =>
                    it.templateId === editing.templateId
                      ? { ...it, review: text, rating: star }
                      : it
                  )
                );
                setEditing(null);
              }}
              onCancel={() => setEditing(null)}
            />
          ) : (
            // 완성된 템플릿
            <TemplateCardDone
              logId={c.logId}
              entryId={c.entryId}
              templateId={c.templateId}
              title={c.title}
              placeName={c.placeName}
              images={c.images}
              rating={c.rating}
              review={c.review}
              indexBadge={idx + 1}
              onEditClick={() =>
                setEditing({
                  logId: c.logId,
                  entryId: c.entryId,
                  templateId: c.templateId,
                  text: c.review,
                  star: c.rating,
                  images: c.images,
                })
              }
              onDeleteClick={(tid) =>
                setCards((prev) => prev.filter((x) => x.templateId !== tid))
              }
            />
          )}
        </TemplateContainer>
      ))}
      <BottomContainer>
        {logDetail?.oneReview && <LogReview>{logDetail.oneReview}</LogReview>}
        {logDetail && (
          <LogVisibility>
            {logDetail.isPublic ? "공개" : "비공개"}
          </LogVisibility>
        )}
        <LogCommentSection logId={numericLogId} currentUserId={currentUserId} />
      </BottomContainer>
    </Container>
  );
};

export default LogEntryPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 67px;
`;

const TemplateContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;
const LogReview = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  margin-top: 15px;
  margin-bottom: 12px;
`;

const LogVisibility = styled.div`
  font-size: 12px;
  color: #666;
  padding: 4px 8px;
  width: 40px;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 20px;
`;
const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 20px;
`;
