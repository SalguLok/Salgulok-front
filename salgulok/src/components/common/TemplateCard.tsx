import React, { useState } from "react";
import styled from "styled-components";
import cameraIcon from "../../assets/common/camera.svg?react";
import searchIcon from "../../assets/common/search.svg?react";
import { createLogEntry } from "../../api/logEntry/createEntry";
import type { TemplateCreateRequest } from "../../api/logEntry/createEntry";
import { Star as StarIcon } from "lucide-react";

type TemplateCardProps = {
  logId: number;
  entryDate: string;
};

const TemplateCard: React.FC<TemplateCardProps> = ({ logId, entryDate }) => {
  const [photoThumbUrl, setPhotoThumbUrl] = useState<string | undefined>();
  const [place, setPlace] = useState("");
  const [text, setText] = useState("");
  const [star, setStar] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const template: TemplateCreateRequest = {
      placeId: 1, // TODO: 실제 장소 ID 연결 필요
      text,
      star,
      imageUrls: photoThumbUrl ? [photoThumbUrl] : [],
    };

    try {
      await createLogEntry(logId, {
        entryDate,
        templates: [template],
      });
      console.log(template);
      // 초기화 - 해야하나? 안해도되면 지우기
      setPhotoThumbUrl(undefined);
      setPlace("");
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
      <TopRow>
        <SectionTitle>사진</SectionTitle>
        <SaveButton type="button" disabled={saving} onClick={handleSave}>
          {saving ? "저장중..." : "저장"}
        </SaveButton>
      </TopRow>

      <PhotoRow onClick={() => alert("사진 선택 구현")}>
        {photoThumbUrl ? (
          <Thumb src={photoThumbUrl} alt="사진 미리보기" />
        ) : (
          <IconBox>
            <img src={cameraIcon} alt="" />
          </IconBox>
        )}
      </PhotoRow>

      <FieldLabel>장소</FieldLabel>
      <SearchField>
        <SearchIconImg src={searchIcon} alt="" />
        <PlaceInput
          value={place}
          placeholder="장소를 입력하세요"
          onChange={(e) => setPlace(e.target.value)}
        />
      </SearchField>

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
          <span key={n} onClick={() => setStar(n)} style={{ cursor: "pointer" }}>
            <StarIcon
              size={21}
              fill={n <= star ? "var(--main-pri)" : "none"}   // 색칠 여부
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

const IconBox = styled.div`
  width: 53px;
  height: 53px;
  border: 1px solid var(--gray-300);
  border-radius: 10px;
  display: grid;
  place-items: center;
  img {
    width: 22px;
    height: 22px;
  }
`;

const Thumb = styled.img`
  width: 88px;
  height: 88px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid var(--gray-300);
`;

const FieldLabel = styled.div`
  font-size: 13px;
  color: var(--gray-500);
  margin: 8px 0 6px;
`;

const SearchField = styled.div`
  position: relative;
  flex: 1;
  height: 34px;
  border: 1px solid var(--gray-300);
  border-radius: 10px;
  display: flex;
  align-items: center;
  background: var(--white);
  margin-bottom: 12px;
  padding-left: 36px;
`;

const SearchIconImg = styled.img`
  position: absolute;
  left: 10px;
  width: 16px;
  height: 16px;
  pointer-events: none;
`;

const PlaceInput = styled.input`
  flex: 1;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 13px;
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