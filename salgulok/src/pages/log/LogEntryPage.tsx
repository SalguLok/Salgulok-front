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

const LogEntryPage: React.FC = () => {
  // 1) params는 string | undefined
  const { logId } = useParams<{ logId: string }>();
  // 2) 숫자로 변환 (없거나 NaN이면 0 처리)
  const numericLogId = Number(logId);

  const [logDetail, setLogDetail] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const [showTemplateCard, setShowTemplateCard] = useState(false);

  type CardData = {
    id: number;
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
      setLogDetail({ startDate: detail.startDate, endDate: detail.endDate });
      setShowTemplateCard(false);
    })();
  }, [numericLogId]);

  if (!numericLogId) return null;

  return (
    <Container>
      <Header title="살구로그 생성" showBackButton />
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
          <TemplateCardDone
            logId={c.logId}
            entryId={c.entryId}
            templateId={c.templateId}
            title={c.title}
            images={c.images}
            rating={c.rating}
            review={c.review}
            indexBadge={idx + 1}
            onEditClick={() => {}}
            onDeleteClick={(tid) =>
              setCards((prev) => prev.filter((x) => x.templateId !== tid))
            }
          />
        </TemplateContainer>
      ))}
      {showTemplateCard && (

        <TemplateCardWrapper>
          <TemplateCard maxLength={300} />
        </TemplateCardWrapper>

      )}
    </Container>
  );
};

export default LogEntryPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 67px; /* NavigationBar height */
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
