import React from "react";
import styled from "styled-components";
import cameraIcon from "../../assets/common/camera.svg";

type Props = {
  urls: string[];
  onAddClick: () => void;
};

const ImageSlider = ({ urls, onAddClick }: Props) => {
  return (
    <SliderContainer>
      <IconBox onClick={onAddClick}>
        <img src={cameraIcon} alt="Add photo" />
      </IconBox>
      {urls.map((url, index) => (
        <Thumb key={index} src={url} alt={`Photo preview ${index + 1}`} />
      ))}
    </SliderContainer>
  );
};

export default ImageSlider;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, and Opera */
  }
`;

const IconBox = styled.div`
  flex-shrink: 0;
  width: 88px;
  height: 88px;
  border: 1px solid var(--gray-300);
  border-radius: 10px;
  display: grid;
  place-items: center;
  cursor: pointer;
  img {
    width: 22px;
    height: 22px;
  }
`;

const Thumb = styled.img`
  flex-shrink: 0;
  width: 88px;
  height: 88px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid var(--gray-300);
`;
