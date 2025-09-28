import styled from "styled-components";
import PresignedImage from "./PresignedImage";

type Props = {
  imageKeys?: string[];
};

const ImageSlider = ({ imageKeys }: Props) => {
  if (!imageKeys || imageKeys.length === 0) {
    return null;
  }

  return (
    <SliderContainer>
      {imageKeys.map((key) => (
        <StyledPresignedImage
          key={key}
          objectKey={key}
          alt="Template image"
        />
      ))}
    </SliderContainer>
  );
};

export default ImageSlider;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, and Opera */
  }
`;

const StyledPresignedImage = styled(PresignedImage)`
  flex-shrink: 0;
  width: 88px;
  height: 88px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid var(--gray-300);
`;
