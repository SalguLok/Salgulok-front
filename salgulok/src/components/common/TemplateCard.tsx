// components/common/TemplateCard.tsx
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { patchTemplate } from "../../api/logEntry/patchTemplate";
import { createLogEntryWithResponse, addTemplateToEntry } from "../../api/logEntry/createEntry";
import { getLogEntryByDate } from "../../api/logEntry/getLogEntryByDate";
import { Star as StarIcon } from "lucide-react";
import PlaceSearchField from "./PlaceSearchField";
import type { PlaceSearchItem } from "../../types/place";
import { uploadImagesFlow } from "../../api/image/uploadFlow";
import ImageSlider from "./ImageSlider";
// import PresignedImage from "./PresignedImage";
import ConfirmModal from "./ConfirmModal";

type TemplateCardProps = {
  logId: number;
  entryDate: string;

  // 모드: 기본은 생성(create)
  mode?: "create" | "edit";

  entryId?: number;
  templateId?: number;

  // edit 모드 초기값
  initialText?: string;
  initialStar?: number;
  initialImages?: string[];

  // 저장/취소 콜백
  onSaved?: (updated: {
    text: string;
    star: number;
    placeId?: number;
    placeName?: string;
    imageUrls?: string[];
    templateId?: number;
    entryId?: number;
  }) => void;
  onCancel?: () => void;
};

const TemplateCard: React.FC<TemplateCardProps> = ({
  logId,
  entryDate,
  mode = "create",
  entryId,
  templateId,
  initialText,
  initialStar,
  initialImages,
  onSaved,
  onCancel,
}) => {
  // 미리보기(로컬 blob URL) / 서버 업로드 완료된 이미지 URL
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageIds, setImageIds] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string>("");
  const [onConfirmHandler, setOnConfirmHandler] = useState<
    () => void | Promise<void>
  >(() => () => setConfirmOpen(false));

  // create 모드에서만 사용
  const [selectedPlace, setSelectedPlace] = useState<PlaceSearchItem | null>(
    null
  );

  // 공통 텍스트/별점
  const [text, setText] = useState("");
  const [star, setStar] = useState(0);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✨ edit 모드 초기값 세팅
  useEffect(() => {
    if (mode === "edit") {
      setText(initialText ?? "");
      setStar(initialStar ?? 0);
      // 기존 이미지는 읽기전용 미리보기로만 보여줌(교체 X)
      setPreviewUrls(initialImages ?? []);
      setImageUrls([]); // 교체 업로드 없음
    }
  }, [mode, initialText, initialStar, initialImages]);

  // 파일 선택(create에서만 의미 있음)
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (mode === "edit") return; // 편집 모드에서는 이미지 교체 미지원(백엔드 imageIds 플로우 붙이면 활성)
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const currentFiles = Array.from(files);

    // 1) 즉시 미리보기
    const newPreviewUrls = currentFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    // 2) 업로드
    setIsUploading(true);
    try {
      const filesToUpload = currentFiles.map((file) => ({ file }));
      const result = await uploadImagesFlow(filesToUpload);

      const newImageUrls = result.items.map(
        (item) => item.presignedUrl.split("?")[0]
      );
      setImageUrls((prev) => [...prev, ...newImageUrls]);
      setImageIds((prev) => [...prev, ...result.imageIds]);
    } catch (err) {
      console.error("Upload failed:", err);
      setConfirmMessage("이미지 업로드에 실패했습니다.");
      setOnConfirmHandler(() => () => setConfirmOpen(false));
      setConfirmOpen(true);
      // 실패한 미리보기 롤백
      setPreviewUrls((prev) =>
        prev.slice(0, prev.length - newPreviewUrls.length)
      );
    } finally {
      setIsUploading(false);
    }
  };

  // 메모리 누수 방지
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleSave = async () => {
    try {
      setSaving(true);

      if (mode === "edit") {
        // 텍스트/별점만 패치 (이미지는 유지)
        if (!entryId || !templateId) {
          setConfirmMessage("잘못된 편집 상태입니다.");
          setOnConfirmHandler(() => () => setConfirmOpen(false));
          setConfirmOpen(true);
          return;
        }
        await patchTemplate(logId, entryId, templateId, {
          text,
          star,
        });
        onSaved?.({ text, star });
        return;
      }

      // === create 모드 ===
      if (!selectedPlace) {
        setConfirmMessage("장소를 선택해주세요.");
        setOnConfirmHandler(() => () => setConfirmOpen(false));
        setConfirmOpen(true);
        return;
      }
      if (imageUrls.length === 0 && previewUrls.length > 0) {
        setConfirmMessage("이미지 업로드가 완료될 때까지 기다려주세요.");
        setOnConfirmHandler(() => () => setConfirmOpen(false));
        setConfirmOpen(true);
        return;
      }

      // 현재 날짜에 LogEntry가 있는지 확인
      let existingEntryId: number | null = null;
      try {
        const entryData = await getLogEntryByDate(logId, entryDate);
        existingEntryId = entryData.entryId;
      } catch (error) {
        // LogEntry가 없는 경우 (404 등) - 새로 생성
        existingEntryId = null;
      }

      const templateData = {
        placeId: selectedPlace.id,
        text,
        star,
        imageIds: imageIds.length > 0 ? imageIds : undefined,
      };

      let result;
      if (existingEntryId) {
        // 기존 LogEntry에 새 템플릿 추가
        result = await addTemplateToEntry(logId, existingEntryId, templateData);
      } else {
        // 새 LogEntry 생성
        const createResult = await createLogEntryWithResponse(logId, {
          entryDate,
          templates: [templateData],
        });
        result = createResult.templates[0];
      }

      // 성공 시 onSaved 콜백 호출
      onSaved?.({
        placeId: selectedPlace.id,
        placeName: selectedPlace.name,
        text,
        star,
        imageUrls,
        templateId: result.templateId,
        entryId: existingEntryId || result.templateId, // 임시로 templateId 사용
      });

      // 초기화
      setPreviewUrls([]);
      setImageUrls([]);
      setImageIds([]);
      setSelectedPlace(null);
      setText("");
      setStar(0);
    } catch (err: any) {
      console.error(err);
      
      // 에러 타입별 처리
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || "저장에 실패했습니다.";
        
        switch (status) {
          case 409:
            setConfirmMessage("이미 해당 날짜에 로그가 존재합니다.");
            break;
          case 404:
            setConfirmMessage("로그를 찾을 수 없습니다.");
            break;
          case 403:
            setConfirmMessage("권한이 없습니다.");
            break;
          case 400:
            setConfirmMessage("잘못된 요청입니다.");
            break;
          default:
            setConfirmMessage(message);
        }
      } else {
        setConfirmMessage("네트워크 오류가 발생했습니다.");
      }
      
      setOnConfirmHandler(() => () => setConfirmOpen(false));
      setConfirmOpen(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      {/* 파일 입력(create에서만 사용) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        multiple
        style={{ display: "none" }}
      />

      <TopRow>
        <SectionTitle>
          {mode === "edit" ? "사진(읽기전용)" : "사진"}
        </SectionTitle>
        <RightBtns>
          {onCancel && (
            <CancelButton type="button" onClick={onCancel}>
              취소
            </CancelButton>
          )}
          <SaveButton
            type="button"
            disabled={saving || isUploading}
            onClick={handleSave}
          >
            {saving ? "저장중..." : isUploading ? "업로드중..." : "저장"}
          </SaveButton>
        </RightBtns>
      </TopRow>

      <PhotoRow>
        {mode === "edit" ? (
          // 편집 모드: 기존 이미지는 보기만
          <ImageSlider urls={previewUrls} onAddClick={() => {}} />
        ) : (
          <ImageSlider
            urls={previewUrls}
            onAddClick={() => fileInputRef.current?.click()}
          />
        )}
      </PhotoRow>

      {/* create에서만 장소 선택 */}
      {mode !== "edit" && (
        <>
          <FieldLabel>장소</FieldLabel>
          <PlaceSearchField onPlaceSelect={setSelectedPlace} />
        </>
      )}

      <FieldLabel>글 작성</FieldLabel>
      <TextAreaWrapper>
        <TextArea
          value={text}
          placeholder="글을 작성해주세요 (최대 300자)"
          maxLength={300}
          onChange={(e) => setText(e.target.value)}
        />
      </TextAreaWrapper>

      <FieldLabel>별점</FieldLabel>
      <StarRow>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            onClick={() => setStar(n)}
            style={{ cursor: "pointer" }}
          >
            <StarIcon
              size={21}
              fill={n <= star ? "var(--main-pri)" : "none"}
              stroke={n <= star ? "none" : "var(--gray-300)"}
            />
          </span>
        ))}
      </StarRow>
      <ConfirmModal
        open={confirmOpen}
        message={confirmMessage}
        confirmText="확인"
        showCancel={false}
        onConfirm={onConfirmHandler}
        onCancel={() => setConfirmOpen(false)}
      />
    </Card>
  );
};

export default TemplateCard;

/* ================= styles ================= */
const Card = styled.div`
  width: 335px;
  box-sizing: border-box;
  border: 1px solid var(--gray-200);
  background: var(--white);
  border-radius: 10px;
  padding: 14px;
`;
const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;
const SectionTitle = styled.span`
  font-size: 13px;
  color: var(--gray-500);
`;
const RightBtns = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
const SaveButton = styled.button`
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--black);
  cursor: pointer;
  &:disabled {
    color: var(--gray-400);
    cursor: default;
  }
`;
const CancelButton = styled.button`
  border: none;
  background: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
`;
const PhotoRow = styled.div`
  margin-bottom: 14px;
`;
const FieldLabel = styled.div`
  font-size: 13px;
  color: var(--gray-500);
  margin: 8px 0 6px;
`;
const TextAreaWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 12px;
`;
const TextArea = styled.textarea`
  width: 100%;
  min-height: 140px;
  border: 1px solid var(--gray-300);
  border-radius: 10px;
  padding: 12px;
  font-size: 13px;
  resize: none;
  ::placeholder {
    color: var(--gray-400);
  }
  &:focus {
    border-color: var(--gray-300);
    outline: none;
  }
`;
const StarRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;
