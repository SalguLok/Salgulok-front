import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/common/Header";

import LogDetailHeader from "../../components/log/LogDetailIHeader";
import TemplateCard from "../../components/common/TemplateCard";
import TemplateCardDone from "../../components/log/TemplateCardDone";
import LogEntryList from "../../components/log/LogEntryList";
import TemplateActionButtons from "../../components/log/TemplateActionButtons";

import { useEffect, useState } from "react";
import { getLogDetail } from "../../api/log/getLogDetail";
import { getLogEntryByDate } from "../../api/logEntry/getLogEntryByDate";
import { createLogEntry } from "../../api/logEntry/createEntry";
import { getEntryDates } from "../../api/logEntry/getEntryDates";
import LogCommentSection from "../../components/log/LogCommentSection";
import ConfirmModal from "../../components/common/ConfirmModal";

const LogEntryPage: React.FC = () => {
  const { logId } = useParams<{ logId: string }>();
  const currentUserId = parseInt(localStorage.getItem("userId") || "0");
  const numericLogId = Number(logId);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string>("");
  const [onConfirmHandler, setOnConfirmHandler] = useState<
    () => void | Promise<void>
  >(() => () => {});

  const [logDetail, setLogDetail] = useState<{
    isPublic: boolean;
    oneReview: string;
    startDate: string;
    endDate: string;
    ownerId: number;
  } | null>(null);

  const isOwner = logDetail ? currentUserId === logDetail.ownerId : false;

  const [editingTemplate, setEditingTemplate] = useState<{
    date: string;
    isNew: boolean;
  } | null>(null);

  // 각 날짜별 SalguItem 상태 관리
  const [salguItemStates, setSalguItemStates] = useState<
    Map<string, "yes" | "no">
  >(new Map());

  // 템플릿 작성 모드 상태
  const [isTemplateWritingMode, setIsTemplateWritingMode] = useState(false);

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

  // editingTemplate이 있을 때 cards에 편집 중인 템플릿 추가
  useEffect(() => {
    if (editingTemplate && editingTemplate.isNew && cards.length === 0) {
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
      setCards([newEditingCard]);
    }
  }, [editingTemplate, numericLogId, cards.length]);

  // TemplateActionButtons 핸들러들
  const handleAddTemplate = () => {
    if (editingTemplate?.date) {
      const newEditingCard: CardData = {
        id: -Date.now(), // 고유한 임시 ID
        placeId: 0,
        placeName: "",
        logId: numericLogId,
        entryId: 0,
        templateId: -Date.now(),
        title: "새 템플릿",
        images: [],
        rating: 0,
        review: "",
        isEditing: true,
        isNew: true,
      };
      setCards((prev) => [...prev, newEditingCard]);
    }
  };

  const handleSubmitTemplates = async () => {
    if (!editingTemplate?.date) {
      setConfirmMessage("날짜 정보가 없어 저장할 수 없습니다.");
      setOnConfirmHandler(() => () => setConfirmOpen(false));
      setConfirmOpen(true);
      return;
    }

    const newTemplates = cards
      .filter((card) => card.isNew)
      .map((card) => ({
        placeId: card.placeId,
        text: card.review,
        star: card.rating,
        imageUrls: card.images,
      }));

    if (newTemplates.some((t) => !t.placeId)) {
      setConfirmMessage(
        "장소가 선택되지 않은 템플릿이 있습니다. 각 템플릿을 저장해주세요."
      );
      setOnConfirmHandler(() => () => setConfirmOpen(false));
      setConfirmOpen(true);
      return;
    }

    if (newTemplates.length === 0) {
      setIsTemplateWritingMode(false);
      setEditingTemplate(null);
      return;
    }

    try {
      await createLogEntry(numericLogId, {
        entryDate: editingTemplate.date,
        templates: newTemplates,
      });

      setConfirmMessage("등록이 완료되었습니다.");
      setOnConfirmHandler(() => async () => {
        setConfirmOpen(false);
        setIsTemplateWritingMode(false);
        setEditingTemplate(null);
        const data = await getLogEntryByDate(
          numericLogId,
          editingTemplate.date
        );
        setCards(toCards(data.logId, data.entryId, data.templates ?? []));
        setSalguItemStates((prev) =>
          new Map(prev).set(editingTemplate.date, "yes")
        );
      });
      setConfirmOpen(true);
    } catch (error) {
      console.error("템플릿 등록 중 에러:", error);
      setConfirmMessage("템플릿 등록 중 오류가 발생했습니다.");
      setOnConfirmHandler(() => () => setConfirmOpen(false));
      setConfirmOpen(true);
    }
  };

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

    try {
      const data: EntryByDateResponse = await getLogEntryByDate(
        numericLogId,
        date
      );

      const hasTemplates =
        data.templateCount > 0 && data.templates && data.templates.length > 0;
      setSalguItemStates((prev) =>
        new Map(prev).set(date, hasTemplates ? "yes" : "no")
      );

      if (!hasTemplates) {
        if (isOwner) {
          // 작성자일 때만 새 템플릿 작성 모드로 진입
          setEditingTemplate({ date, isNew: true });
          setCards([]);
          setIsTemplateWritingMode(true);
        } else {
          // 작성자가 아니면 아무 것도 띄우지 않음 (필요하면 아래 alert 주석 해제)
          setEditingTemplate(null);
          setIsTemplateWritingMode(false);
          setCards([]);
          // alert("작성자가 아닌 경우 새 템플릿을 만들 수 없습니다.");
        }
      } else {
        setCards(toCards(data.logId, data.entryId, data.templates ?? []));
        setEditingTemplate(null);
        setIsTemplateWritingMode(false);
      }
    } catch (error) {
      console.error("getLogEntryByDate 에러:", error);
      setConfirmMessage(
        "데이터를 불러오는데 실패했습니다. 네트워크 연결을 확인해주세요."
      );
      setOnConfirmHandler(() => () => setConfirmOpen(false));
      setConfirmOpen(true);
    }
  };

  useEffect(() => {
    if (!numericLogId) return;
    (async () => {
      // 1. 로그 기본 정보 가져오기
      const detail = await getLogDetail(numericLogId);
      setLogDetail({
        startDate: detail.startDate,
        endDate: detail.endDate,
        isPublic: detail.isPublic,
        oneReview: detail.oneReview,
        ownerId: detail.ownerId,
      });
      setEditingTemplate(null);

      // 2. 어떤 날짜에 기록이 있는지 미리 가져와서 상태 설정
      const entryDatesResponse = await getEntryDates(numericLogId);
      const newStates = new Map<string, "yes" | "no">();
      entryDatesResponse.items.forEach((item) => {
        newStates.set(item.entryDate, "yes");
      });
      setSalguItemStates(newStates);
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
            <TemplateCard
              logId={c.logId}
              entryDate={editingTemplate?.date ?? ""}
              mode="create"
              onSaved={(savedData) => {
                if (editingTemplate?.date) {
                  setCards((prev) =>
                    prev.map((card) =>
                      card.id === c.id
                        ? {
                            ...card,
                            isEditing: false,
                            review: savedData.text,
                            rating: savedData.star,
                            placeId: savedData.placeId ?? 0,
                            placeName: savedData.placeName ?? "저장된 장소",
                            title: savedData.placeName ?? "저장된 장소",
                            images: savedData.imageUrls ?? [],
                          }
                        : card
                    )
                  );
                  setSalguItemStates((prev) =>
                    new Map(prev).set(editingTemplate.date, "yes")
                  );
                }
              }}
              onCancel={() => {
                setCards((prev) => prev.filter((card) => card.id !== c.id));
                if (cards.length <= 1) {
                  setIsTemplateWritingMode(false);
                  setEditingTemplate(null);
                }
              }}
            />
          ) : editing?.templateId === c.templateId ? (
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
              isOwner={currentUserId === (logDetail?.ownerId ?? -1)}
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

      {isTemplateWritingMode && (
        <ActionButtonsContainer>
          <TemplateActionButtons
            onAdd={handleAddTemplate}
            onSubmit={handleSubmitTemplates}
            disabled={cards.some((c) => c.isEditing)}
          />
        </ActionButtonsContainer>
      )}

      {!isTemplateWritingMode && (
        <BottomContainer>
          {logDetail?.oneReview && <LogReview>{logDetail.oneReview}</LogReview>}
          {logDetail && (
            <LogVisibility>
              {logDetail.isPublic ? "공개" : "비공개"}
            </LogVisibility>
          )}
          <LogCommentSection
            logId={numericLogId}
            currentUserId={currentUserId}
          />
        </BottomContainer>
      )}
      <ConfirmModal
        open={confirmOpen}
        message={confirmMessage}
        confirmText="확인"
        showCancel={false}
        onConfirm={onConfirmHandler}
        onCancel={() => setConfirmOpen(false)}
      />
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
const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  margin: 0 20px;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 20px;
`;

const LogReview = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  margin-top: -5px;
  margin-bottom: 12px;
`;
