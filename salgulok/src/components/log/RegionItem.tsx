import React from "react";
import styled from "styled-components";

interface RegionItemProps {
  id: number;
  nameKo: string;
  nameEn: string;
  imageUrl: string | React.ReactNode;
  selected: boolean;
  onSelect: (id: number) => void;
}

const RegionItem: React.FC<RegionItemProps> = ({
  id,
  nameKo,
  nameEn,
  imageUrl,
  selected,
  onSelect,
}) => {
  const isUrl = typeof imageUrl === "string";
  return (
    <Item>
      <Left>
        {isUrl ? (
          <ThumbImg src={imageUrl} alt={nameKo} loading="lazy" />
        ) : (
          <ThumbBox aria-label={nameKo}>{imageUrl}</ThumbBox>
        )}
        <TextWrapper>
          <NameKo>{nameKo}</NameKo>
          <NameEn>{nameEn}</NameEn>
        </TextWrapper>
      </Left>
      <SelectButton selected={selected} onClick={() => onSelect(id)}>
        선택
      </SelectButton>
    </Item>
  );
};

export default RegionItem;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
`;

const ThumbImg = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
`;
const ThumbBox = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: var(--gray-100);
  & > img,
  & > svg {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
`;
const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const NameKo = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: var(--black);
`;

const NameEn = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: var(--gray-400);
`;

const SelectButton = styled.button<{ selected: boolean }>`
  padding: 4px 15px;
  border-radius: 50px;
  border: none;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;

  background-color: ${(props) =>
    props.selected ? "var(--main-pri)" : "var(--gray-100)"};
  color: ${(props) => (props.selected ? "var(--white)" : "var(--gray-500)")};
`;
