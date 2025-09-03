import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import RegionItem from "../../components/log/RegionItem";
import BottomButton from "../../components/common/BottomButton";
import { useCreateLogStore } from "../../stores/CreateLogStore";

const regions = [
  { id: "busan", nameKo: "부산", nameEn: "Busan", imageUrl: "/images/busan.jpg" },
  { id: "seoul", nameKo: "서울", nameEn: "Seoul", imageUrl: "/images/seoul.jpg" },
  { id: "jeju", nameKo: "제주", nameEn: "Jeju", imageUrl: "/images/jeju.jpg" },
];

const CreateRegionPage: React.FC = () => {
  const navigate = useNavigate();

  const { setStep1 } = useCreateLogStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleNextPage = () => {
    if (!selectedId) return;

    setStep1(Number(selectedId));
    navigate("/log/select-date");
  }

  return (
    <Container>
      <List>
        {regions.map((region) => (
          <RegionItem
            key={region.id}
            id={region.id}
            nameKo={region.nameKo}
            nameEn={region.nameEn}
            imageUrl={region.imageUrl}
            selected={selectedId === region.id}
            onSelect={setSelectedId}
          />
        ))}
      </List>

      <BottomButton
        text="다음"
        onClick={handleNextPage}
      />
    </Container>
  );
};

export default CreateRegionPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const List = styled.div`
  margin: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
