import React, { useRef, useState } from "react";
import styled from "styled-components";
import editIcon from "../../assets/mypage/edit_profile_img.svg";
import profile from "../../assets/common/profile_default.svg?url";
import BottomSheet from "../common/BottomSheet";

interface ProfileImageProps {
  imageUrl?: string;
  onChange: (file: File | null) => void;
}

const EditProfileImage: React.FC<ProfileImageProps> = ({ imageUrl, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [actionType, setActionType] = useState<"default" | "album" | null>(null);

  // 수정 버튼 클릭 시 bottom sheet 열기
  const handleEditClick = () => {
    setMenuOpen(true);
    setActionType(null);
  };

  // 파일 선택 시 파일을 임시 저장
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setActionType(file ? "album" : null);

    if (file) {
      onChange(file);
      setMenuOpen(false);
    }
  };

  // 기본 이미지 선택 시
  const handleDefaultImage = () => {
    setActionType("default");
  };

  // 앨범에서 이미지 선택 클릭 시 input 열기
  const handleChooseFromAlbum = () => {
    setActionType("album");
  };

  // 하단 확인 버튼 클릭 시 최종 반영
  const handleConfirm = () => {
    if (actionType === "default") {
      onChange(null);
      setMenuOpen(false);
    } else if (actionType === "album") {
      if (fileInputRef.current) fileInputRef.current.value = "";
      fileInputRef.current?.click();
    }
    setMenuOpen(false);
  };

  return (
    <Container>
      <ProfileImg src={imageUrl || profile} alt="사용자 프로필" />
      <EditIcon src={editIcon} alt="edit" onClick={handleEditClick} />

      <HiddenInput
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* 이미지 수정 메뉴 */}
      <BottomSheet
        open={menuOpen}
        title="프로필 이미지를 선택해주세요"
        onClose={() => setMenuOpen(false)}
        primaryLabel="확인"
        onPrimary={handleConfirm}
        primaryDisabled={!actionType} // 아무 것도 선택 안 했을 때 비활성화
      >
        <ButtonList>
          <SheetButton
            onClick={handleDefaultImage}
            isSelected={actionType === "default"}
          >
            기본 이미지로 변경
          </SheetButton>
          <SheetButton
            onClick={handleChooseFromAlbum}
            isSelected={actionType === "album"}
          >
            앨범에서 선택
          </SheetButton>
        </ButtonList>
      </BottomSheet>
    </Container>
  );
};

export default EditProfileImage;

const Container = styled.div`
  position: relative;
  width: 128px;
  height: 128px;
`;

const ProfileImg = styled.img`
  width: 115px;
  height: 115px;
  border-radius: 50%;
  object-fit: cover;
  border: none;
`;

const EditIcon = styled.img`
  width: 36px;
  height: 36px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ButtonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 6px 0 12px 0;
`;

const SheetButton = styled.button<{ isSelected?: boolean }>`
  width: 100%;
  height: 32px;
  border: none;
  background: var(--white);
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  color: ${({ isSelected }) => (isSelected ? "var(--main-pri)" : "var(--black)")};
`;