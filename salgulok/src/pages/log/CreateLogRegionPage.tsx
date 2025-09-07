import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import RegionItem from "../../components/log/RegionItem";
import BottomButton from "../../components/common/BottomButton";
import { useCreateLogStore } from "../../stores/CreateLogStore";
import Header from "../../components/common/Header";

const regions = [
  { id: 1, nameKo: "부산", nameEn: "Busan", imageUrl: "/images/busan.jpg" },
  { id: 2, nameKo: "서울", nameEn: "Seoul", imageUrl: "/images/seoul.jpg" },
  { id: 3, nameKo: "제주", nameEn: "Jeju", imageUrl: "/images/jeju.jpg" },
];

const CreateRegionPage: React.FC = () => {
  const navigate = useNavigate();

  const { setStep1 } = useCreateLogStore();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleNextPage = () => {
    if (!selectedId) {
      alert("여행 지역을 선택해주세요.");
      return;
    }
    setStep1(Number(selectedId));
    navigate("/log/create/date");
  }

  return (
    <Container>
      <Header title="살구로그 생성" showBackButton/>
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
  margin: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
