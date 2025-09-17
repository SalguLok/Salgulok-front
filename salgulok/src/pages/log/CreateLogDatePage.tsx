import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dayjs } from "dayjs";
import styled from "styled-components";
import Calendar from "../../components/log/Calendar";
import BottomButton from "../../components/common/BottomButton";
import { useCreateLogStore } from "../../stores/CreateLogStore";
import Header from "../../components/common/Header";
import { checkLogDate } from "../../api/log/checkLogDate";

const CreateDatePage: React.FC = () => {
  const navigate = useNavigate();
  const { setStep2 } = useCreateLogStore();

  const [start, setStart] = useState<Dayjs | null>(null);
  const [end, setEnd] = useState<Dayjs | null>(null);

  const handleDateChange = (s: Dayjs | null, e: Dayjs | null) => {
    setStart(s);
    setEnd(e);
  };

  const handleNextPage = async () => {
    if (!start || !end) {
      alert("여행 시작일과 종료일을 선택해주세요.");
      return;
    }

    try {
      const data = await checkLogDate({
        startDate: start.format("YYYY-MM-DD"),
        endDate: end.format("YYYY-MM-DD"),
      });

      if (data.alreadyExist) {
        alert("선택하신 여행 날짜와 겹치는 일정이 있습니다. 다른 날짜를 선택해주세요.");
        return;
      }

      setStep2(start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"));
      navigate("/log/create/info");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Container>
        <Header title="살구로그 생성" showBackButton/>
        <Calendar onDateChange={handleDateChange}/>
        <BottomButton
          text="날짜 선택"
          onClick={handleNextPage}
        />
    </Container>
  );
};

export default CreateDatePage;

const Container = styled.div`
  gap: 30px;
`;