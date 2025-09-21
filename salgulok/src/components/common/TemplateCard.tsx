import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { createLogEntry } from "../../api/logEntry/createEntry";
import type { TemplateCreateRequest } from "../../api/logEntry/createEntry";
import { Star as StarIcon } from "lucide-react";
import PlaceSearchField from "./PlaceSearchField";
import type { PlaceSearchItem } from "../../types/place";
import { uploadImagesFlow } from "../../api/image/uploadFlow";
import ImageSlider from "./ImageSlider";

type TemplateCardProps = {
  logId: number;
  entryDate: string;
};

const TemplateCard: React.FC<TemplateCardProps> = ({ logId, entryDate }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSearchItem | null>(
    null
  );
  const [text, setText] = useState("");
  const [star, setStar] = useState(0);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const currentFiles = Array.from(files);

    // 1. 즉시 미리보기 생성
    const newPreviewUrls = currentFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    // 2. 백그라운드에서 업로드 진행
    setIsUploading(true);
    try {
      const filesToUpload = currentFiles.map((file) => ({ file }));
      const result = await uploadImagesFlow(filesToUpload);

      const newImageUrls = result.items.map(
        (item) => item.presignedUrl.split("?")[0]
      );
      setImageUrls((prev) => [...prev, ...newImageUrls]);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("이미지 업로드에 실패했습니다.");
      // 실패 시 추가한 미리보기 제거
      setPreviewUrls((prev) =>
        prev.slice(0, prev.length - newPreviewUrls.length)
      );
    } finally {
      setIsUploading(false);
    }
  };

  // 메모리 누수 방지를 위해 Object URL 해제
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleSave = async () => {
    if (!selectedPlace) {
      alert("장소를 선택해주세요.");
      return;
    }
    if (imageUrls.length === 0 && previewUrls.length > 0) {
      alert("이미지 업로드가 완료될 때까지 기다려주세요.");
      return;
    }
    setSaving(true);
    const template: TemplateCreateRequest = {
      placeId: selectedPlace.id,
      text,
      star,
      imageUrls,
    };

    try {
      await createLogEntry(logId, {
        entryDate,
        templates: [template],
      });
      console.log(template);
      // 초기화
      setPreviewUrls([]);
      setImageUrls([]);
      setSelectedPlace(null);
      setText("");
      setStar(0);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        multiple
        style={{ display: "none" }}
      />
      <TopRow>
        <SectionTitle>사진</SectionTitle>
        <SaveButton
          type="button"
          disabled={saving || isUploading}
          onClick={handleSave}
        >
          {saving ? "저장중..." : isUploading ? "업로드중..." : "저장"}
        </SaveButton>
      </TopRow>

      <PhotoRow>
        <ImageSlider
          urls={previewUrls}
          onAddClick={() => fileInputRef.current?.click()}
        />
      </PhotoRow>

      <FieldLabel>장소</FieldLabel>
      <PlaceSearchField onPlaceSelect={setSelectedPlace} />

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
              fill={n <= star ? "var(--main-pri)" : "none"} // 색칠 여부
              stroke={n <= star ? "none" : "var(--gray-300)"} // 테두리 색
            />
          </span>
        ))}
      </StarRow>
    </Card>
  );
};

export default TemplateCard;

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
  border: 1px solid var(--gray-300); // 기본 테두리 색
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
