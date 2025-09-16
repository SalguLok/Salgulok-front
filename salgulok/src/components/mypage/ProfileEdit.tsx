import React, { useRef } from "react";
import styled from "styled-components";
import editIcon from "../../assets/mypage/edit_profile_img.svg";
import profile from "../../assets/common/profile_default.svg?url";

interface ProfileImageProps {
  imageUrl?: string;
  onChange: (file: File) => void;
}

const EditProfileImage: React.FC<ProfileImageProps> = ({ imageUrl, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <Container>
      <ProfileImg src={imageUrl || profile} alt="사용자 프로필" />

      <EditIcon src={editIcon} alt="edit" onClick={handleEditClick}/>
      <HiddenInput
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
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

