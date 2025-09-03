import React, { useRef, useState } from "react";
import styled from "styled-components";
import CameraIcon from "../../assets/common/camera.svg";

interface ImageUploadProps {
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Wrapper>
      <Label>{label}</Label>
      <UploadBox onClick={handleClick}>
        {preview ? (
          <img src={preview} alt="preview" />
        ) : (
          <CameraImg src={CameraIcon} alt="camera icon" />
        )}
      </UploadBox>
      <HiddenInput
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleChange}
      />
    </Wrapper>
  );
};

export default ImageUpload;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: var(--black);
`;

const UploadBox = styled.div`
  width: 88px;
  height: 88px;
  border: 1.5px solid var(--gray-300);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const CameraImg = styled.img`
    width: 22px;
    height: 20px;
`;

const HiddenInput = styled.input`
  display: none;
`;