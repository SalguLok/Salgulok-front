import React, { useMemo } from "react";
import styled from "styled-components";
import cameraIcon from "../../assets/common/camera.svg";
import searchIcon from "../../assets/common/search.svg";

type TemplateCardProps = {
    /** 상단 우측 저장 버튼 노출 여부 */
    showSave?: boolean;
    /** 저장중 표시 (퍼블리싱용: 비활성화 스타일만) */
    saving?: boolean;
    onSave?: () => void;

    /** 사진 썸네일 (없으면 카메라 아이콘 박스만 노출) */
    photoThumbUrl?: string;
    onClickAddPhoto?: () => void;

    /** 장소 입력값 (퍼블리싱: 입력 핸들러만 열어둠) */
    place?: string;
    onChangePlace?: (v: string) => void;
    onClickSearchPlace?: () => void;

    /** 텍스트 입력 및 글자수 제한(디폴트 300) */
    text?: string;
    onChangeText?: (v: string) => void;
    maxLength?: number;
};

const TemplateCard: React.FC<TemplateCardProps> = ({
                                                       showSave = true,
                                                       saving = false,
                                                       onSave,

                                                       photoThumbUrl,
                                                       onClickAddPhoto,

                                                       place = "",
                                                       onChangePlace,
                                                       onClickSearchPlace,

                                                       text = "",
                                                       onChangeText,
                                                       maxLength = 300,
                                                   }) => {
    // const remain = useMemo(
    //     () => Math.max(0, maxLength - (text?.length ?? 0)),
    //     [text, maxLength]
    // );

    return (
        <Card>
            <TopRow>
                <SectionTitle>사진</SectionTitle>
                {showSave && (
                    <SaveButton
                        type="button"
                        disabled={saving}
                        aria-disabled={saving}
                        onClick={onSave}
                    >
                        저장
                    </SaveButton>
                )}
            </TopRow>

            <PhotoRow onClick={onClickAddPhoto} role="button" tabIndex={0}>
                {photoThumbUrl ? (
                    <Thumb src={photoThumbUrl} alt="사진 미리보기" />
                ) : (
                    <IconBox aria-label="사진 추가">
                        <img src={cameraIcon} alt="" />
                    </IconBox>
                )}
            </PhotoRow>

            <FieldLabel>장소</FieldLabel>
            <SearchField>
                <SearchIcon src={searchIcon} alt="" />
                <PlaceInput
                    value={place}
                    placeholder=""
                    onChange={(e) => onChangePlace?.(e.target.value)}
                    onClick={onClickSearchPlace}
                    readOnly
                />
            </SearchField>

            <FieldLabel>글 작성</FieldLabel>
            <TextAreaWrapper>
                <TextArea
                    value={text}
                    placeholder="글을 작성해주세요 (최대 300자)"
                    maxLength={maxLength}
                    onChange={(e) => onChangeText?.(e.target.value)}
                />
                {/*<Counter>{remain}</Counter>*/}
            </TextAreaWrapper>

            <FieldLabel>별점</FieldLabel>
            <StarRow aria-label="별점 (미동작)">
                {/* 퍼블리싱 전용: 빈 별 5개 고정 */}
                <Star>☆</Star>
                <Star>☆</Star>
                <Star>☆</Star>
                <Star>☆</Star>
                <Star>☆</Star>
            </StarRow>
        </Card>
    );
};

export default TemplateCard;

/* ==================== styles ==================== */

const Card = styled.div`
    width: 100%;              /* ← 고정 */
    height: 100%;
    box-sizing: border-box;
    border: 1px solid var(--gray-200);
  background: var(--white);
  border-radius: 10px;
  padding: 14px;
  // box-shadow: 0 1px 2px rgba(0,0,0,0.04);
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
  width: 44px;
  height: 44px;
  border: 1px solid var(--gray-300);
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: var(--white);
  img { width: 22px; height: 22px; }
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
  width: 297px;
  height: 34px;
    box-sizing: border-box;
  border: 1px solid var(--gray-300);
  border-radius: 10px;
  display: flex;
  align-items: center;
  background: var(--white);
  margin-bottom: 12px;
`;

const SearchIcon = styled.img`
  position: absolute;
  left: 10px;
  width: 16px;
  height: 16px;
`;

const PlaceInput = styled.input`
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
    padding: 0 12px 0 36px;
    background: transparent;
  font-size: 13px;
  ::placeholder { color: var(--gray-400); }
  cursor: text;
`;

const TextAreaWrapper = styled.div`
  position: relative;
    width: 273px;              
    box-sizing: border-box;
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
  ::placeholder { color: var(--gray-400); }
`;

const Counter = styled.span`
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 13px;
  color: var(--gray-400);
`;

const StarRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const Star = styled.span`
  font-size: 18px;
  line-height: 1;
  color: var(--gray-300);
`;
