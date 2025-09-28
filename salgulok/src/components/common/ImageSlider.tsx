import styled from "styled-components";
import PresignedImage from "./PresignedImage";
import cameraIcon from "../../assets/common/camera.svg";

type Props = {
  mode?: "display" | "edit";
  imageKeys?: string[]; // display 모드용
  urls?: string[]; // edit 모드용 (미리보기)
  onAddClick?: () => void;
};

const ImageSlider = ({ mode = "display", imageKeys, urls, onAddClick }: Props) => {
  return (
    <SliderContainer>
      {mode === "edit" && (
        <IconBox onClick={onAddClick}>
          <img src={cameraIcon} alt="Add photo" />
        </IconBox>
      )}

      {mode === "display" &&
        imageKeys?.map((item) => (
          <StyledPresignedImage
            key={item}
            src={item.startsWith("http") ? item : undefined}
            objectKey={!item.startsWith("http") ? item : undefined}
            alt="Template image"
          />
        ))}
      {mode === "edit" &&
        urls?.map((url, index) => (
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

const StyledPresignedImage = styled(PresignedImage)`
  flex-shrink: 0;
  width: 88px;
  height: 88px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid var(--gray-300);
`;
