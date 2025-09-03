import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dayjs } from "dayjs";
import styled from "styled-components";
import Calendar from "../../components/log/Calendar";
import BottomButton from "../../components/common/BottomButton";
import { useCreateLogStore } from "../../stores/CreateLogStore";

const CreateDatePage: React.FC = () => {
  const navigate = useNavigate();
  const { setStep2 } = useCreateLogStore();

  const [start, setStart] = useState<Dayjs | null>(null);
  const [end, setEnd] = useState<Dayjs | null>(null);

  const handleDateChange = (s: Dayjs | null, e: Dayjs | null) => {
    setStart(s);
    setEnd(e);
  };

  const handleNextPage = () => {
    if (!start || !end) {
      alert("여행 시작일과 종료일을 선택해주세요.");
      return;
    }

    setStep2( start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"));
    navigate("/log/create/info");
  }

  return (
    <Container>
        <Calendar onDateChange={handleDateChange}/>
        <BottomButton
          text="여행 선택"
          onClick={handleNextPage}
        />
    </Container>
  );
};

export default CreateDatePage;

const Container = styled.div`
    margin: 50px 0; //임시
`;