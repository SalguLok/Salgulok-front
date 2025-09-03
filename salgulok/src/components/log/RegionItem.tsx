import React from "react";
import styled from "styled-components";

interface RegionItemProps {
  id: string;
  nameKo: string;
  nameEn: string;
  imageUrl: string;
  selected: boolean;
  onSelect: (id: string) => void;
}

const RegionItem: React.FC<RegionItemProps> = ({
  id,
  nameKo,
  nameEn,
  imageUrl,
  selected,
  onSelect,
}) => {
  return (
    <Item>
      <Left>
        <Thumbnail src={imageUrl} alt={nameKo} />
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

const Thumbnail = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
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
