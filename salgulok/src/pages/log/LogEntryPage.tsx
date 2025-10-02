import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/common/Header";

import LogDetailHeader from "../../components/log/LogDetailIHeader";
import TemplateCard from "../../components/common/TemplateCard";
import TemplateCardDone from "../../components/log/TemplateCardDone";
import LogEntryList from "../../components/log/LogEntryList";
import TemplateAddButton from "../../components/log/TemplateAddButton";

import { useEffect, useState, useCallback } from "react";
import { getLogDetail } from "../../api/log/getLogDetail";
import { getLogEntryByDate } from "../../api/logEntry/getLogEntryByDate";
// import { createLogEntry } from "../../api/logEntry/createEntry";
// import { updateLogEntry } from "../../api/logEntry/updateEntry";
import { getEntryDates } from "../../api/logEntry/getEntryDates";
import { increaseViewCount } from "../../api/log/increaseViewCount";

import LogCommentSection from "../../components/log/LogCommentSection";
import ConfirmModal from "../../components/common/ConfirmModal";
import OneReviewModal from "../../components/log/OneReviewModal";
import { getLogComments } from "../../api/log/logComment";
import LikeCommentCounts from "../../components/log/LikeCommentCounts";


const LogEntryPage: React.FC = () => {
  const { logId } = useParams<{ logId: string }>();
  const currentUserId = parseInt(localStorage.getItem("userId") || "0");
  const numericLogId = Number(logId);

  const [modal, setModal] = useState({
    open: false,
    message: "",
    confirmText: "확인",
    cancelText: "취소",
    showCancel: false,
    onConfirm: () => {},
  });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const closeModal = () => setModal((prev) => ({ ...prev, open: false }));

  const [logDetail, setLogDetail] = useState<{
    isPublic: boolean;
    oneReview: string;
    startDate: string;
    endDate: string;
    ownerId: number;
    isUpload?: boolean;
    likes?: number;
    isLiked?: boolean;
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
    const dateForNewCard = editingTemplate?.date || selectedDate;
    if (dateForNewCard) {
      const newEditingCard: CardData = {
        id: -Date.now(), // 고유한 임시 ID
        placeId: 0,
        placeName: "",
        logId: numericLogId,
        entryId: cards.length > 0 ? cards[0].entryId : 0, // 기존 entryId 사용
        templateId: -Date.now(),
        title: "새 템플릿",
        images: [],
        rating: 0,
        review: "",
        isEditing: true,
        isNew: true,
      };
      setCards((prev) => [...prev, newEditingCard]);
    } else {
      alert("템플릿을 추가할 날짜를 선택해주세요.");
    }
  };

  type TemplateSummary = {
    templateId: number;
    placeId: number;
    text: string;
    star: number;
    images?: Array<{ 
      imageId: number; 
      imageUrl: string;
      presignedUrl: string;
      objectKey: string;
    }>;
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
      images: t.images?.map((x) => x.objectKey) ?? [],
      rating: t.star ?? 0,
      review: t.text ?? "",
    }));

  const handleSalguItemClick = useCallback(async (date: string) => {
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
      setModal({
        open: true,
        message: "데이터를 불러오는데 실패했습니다. 네트워크 연결을 확인해주세요.",
        showCancel: false,
        onConfirm: closeModal,
        confirmText: "확인",
        cancelText: "취소",
      });
    }
  }, [numericLogId, isOwner]);

  const fetchLogDetail = useCallback(async () => {
    const detail = await getLogDetail(numericLogId);
    setLogDetail({
      startDate: detail.startDate,
      endDate: detail.endDate,
      isPublic: detail.isPublic,
      oneReview: detail.oneReview,
      ownerId: detail.ownerId,
      isUpload: detail.isUpload,
      likes: detail.likes,
      isLiked: detail.isLiked,
    });
  }, [numericLogId]);

  const handleUpload = () => {
    setIsReviewModalOpen(true);
  };

  useEffect(() => {
    if (!numericLogId) return;
    const initLogPage = async () => {
      // 1. 로그 기본 정보 가져오기
      await fetchLogDetail();
      setEditingTemplate(null);

      // 2. 어떤 날짜에 기록이 있는지 미리 가져와서 상태 설정
      const entryDatesResponse = await getEntryDates(numericLogId);
      const newStates = new Map<string, "yes" | "no">();
      entryDatesResponse.items.forEach((item) => {
        newStates.set(item.entryDate, "yes");
      });
      setSalguItemStates(newStates);

      // 첫 번째 기록이 있는 날짜의 템플릿을 자동으로 불러오기
      if (entryDatesResponse.items.length > 0) {
        const firstDateWithEntry = entryDatesResponse.items[0].entryDate;
        await handleSalguItemClick(firstDateWithEntry);
      }

      // 3. 댓글 수 가져오기
      try {
        const commentsData = await getLogComments(numericLogId, { page: 0, size: 1 });
        setCommentCount(commentsData.totalElements);
      } catch (error) {
        console.error("댓글 수 조회 실패:", error);
        setCommentCount(0);
      }

      // 4. 조회수 증가
      try {
        await increaseViewCount(numericLogId);
      } catch (error) {
        console.error("조회수 증가 실패:", error);
      }
    };
    initLogPage();
  }, [numericLogId, fetchLogDetail, handleSalguItemClick]);

  if (!numericLogId) return null;

  return (
    <Container>
      <Header
        title="살구로그"
        showBackButton
        rightElement={
          isOwner && logDetail && !logDetail.isUpload ? (
            <UploadButton onClick={handleUpload}>등록</UploadButton>
          ) : null
        }
      />
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
              entryDate={editingTemplate?.date || selectedDate || ""}
              mode="create"
              onSaved={() => {
                const dateToRefresh = editingTemplate?.date || selectedDate;
                if (dateToRefresh) {
                  handleSalguItemClick(dateToRefresh);
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

      {isTemplateWritingMode && <TemplateAddButton onAdd={handleAddTemplate} />}

      {!isTemplateWritingMode && (
        <>
          {isOwner && logDetail && !logDetail.isUpload && (
            <TemplateAddButton onAdd={handleAddTemplate} />
          )}
          <BottomContainer>
            {logDetail?.oneReview && (
              <OneReviewText>{logDetail.oneReview}</OneReviewText>
            )}

            {logDetail && isOwner && (
                          <LogVisibility>
                            {logDetail.isPublic ? "공개" : "비공개"}
                          </LogVisibility>
                        )}
              
                        {logDetail?.isUpload && (
                          <CountsWrapper>
                            <LikeCommentCounts
                              logId={numericLogId}
                              commentCount={commentCount}
                              disableLike={isOwner}
                              initialLikeCount={logDetail?.likes}
                              initialIsLiked={logDetail?.isLiked}
                            />
                          </CountsWrapper>
                        )}
              
                        {logDetail?.isUpload && (
                          <LogCommentSection
                            logId={numericLogId}
                            currentUserId={currentUserId}
                            onCommentAdded={() => setCommentCount((c) => c + 1)}
                            onCommentDeleted={() => setCommentCount((c) => Math.max(0, c - 1))}
                          />            )}
          </BottomContainer>
        </>
      )}
      <ConfirmModal
        {...modal}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />
      <OneReviewModal
        open={isReviewModalOpen}
        logId={numericLogId}
        onCancel={() => setIsReviewModalOpen(false)}
        onSuccess={() => {
          setIsReviewModalOpen(false);
          fetchLogDetail(); // 재조회하여 등록 버튼 숨기기
        }}
      />
    </Container>
  );

};

export default LogEntryPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 130px; /* 네비게이션 바와 추가 버튼을 위한 공간 확보 */
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

const CountsWrapper = styled.div`
  margin-bottom: 20px;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 20px;
`;

const OneReviewText = styled.p`
  font-size: 15px;
  color: var(--gray-600);
  text-align: left;
  margin: 10px 0 20px 0;
`;

const UploadButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: var(--main-pri);
`;



