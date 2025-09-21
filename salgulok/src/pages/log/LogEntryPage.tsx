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
  } | null>(null);
  const [showTemplateCard, setShowTemplateCard] = useState(false);

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
  };
  const [cards, setCards] = useState<CardData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  selectedDate;

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
    setCards(toCards(data.logId, data.entryId, data.templates ?? []));
    setShowTemplateCard(false);
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
      });
      setShowTemplateCard(false);
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
        />
      )}

      {cards.map((c, idx) => (
        <TemplateContainer key={c.id}>
          {editing?.templateId === c.templateId ? (
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
        {showTemplateCard && typeof selectedDate === "string" && (
          <TemplateCardWrapper>
            <TemplateCard logId={numericLogId} entryDate={selectedDate} />
          </TemplateCardWrapper>
        )}
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
const TemplateCardWrapper = styled.div`
  width: 90%;
  max-width: 600px;
  margin: 0 auto;
`;
const LogReview = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: #333;
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
