import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import styled from "styled-components";

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

interface CalendarProps {
  onDateChange?: (start: Dayjs | null, end: Dayjs | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [startDate, setStartDate] = useState<Dayjs | null>(null);   // 여행 시작일
  const [endDate, setEndDate] = useState<Dayjs | null>(null);   // 여행 종료일일

  const daysInMonth = currentMonth.daysInMonth();   // 이번 달 며칠까지 있는지
  const firstDayOfWeek = currentMonth.date(1).day(); // 0 == 일요일

  const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const handleDateClick = (day: number) => {
    const clicked = currentMonth.date(day);

    if (!startDate || (startDate && endDate)) {
        // 시작이 없거나, 이미 시작+종료 다 선택된 경우
        setStartDate(clicked);
        setEndDate(null);
    } else if (clicked.isBefore(startDate)) {
        // 시작날짜보다 앞인 경우
        setStartDate(clicked);
    } else {
        // 종료날짜 설정
        setEndDate(clicked);
        onDateChange?.(startDate, clicked);
    }
  };

  // 여행 일정인지 유무
  const isInRange = (day: number) => {
    if (!startDate) return false;
    const date = currentMonth.date(day);
    // 시작~종료 포함해서 true
    if (startDate && endDate) {
      return (
        date.isSame(startDate, "day") ||
        date.isSame(endDate, "day") ||
        (date.isAfter(startDate, "day") && date.isBefore(endDate, "day"))
      );
    }
    return false;
  };
  const isStartDay = (date: number) => currentMonth.date(date).isSame(startDate, "day");
  const isEndDay = (date: number) => currentMonth.date(date).isSame(endDate, "day");
  const isSunday = (date: number) => currentMonth.date(date).day() === 0;
  const isToday = (day: number) => currentMonth.date(day).isSame(dayjs(), "day");
  const dayIndexInWeek = (day: number) => currentMonth.date(day).day();


  return (
    <Container>
      <Header>
        <MonthLabel>{currentMonth.format("YYYY년 M월")}</MonthLabel>
        <ButtonGroup>
          <button onClick={handlePrevMonth}>{"<"}</button>
          <button onClick={handleNextMonth}>{">"}</button>
        </ButtonGroup>
      </Header>

      <Weekdays>
        {weekdays.map((w) => (
          <Weekday key={w}>{w}</Weekday>
        ))}
      </Weekdays>

      <CalendarGrid>
        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
          <EmptyCell key={idx}/>
        ))}

        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const isStart = isStartDay(day);
          const isEnd = isEndDay(day);

          return (
            <DateCell key={day} onClick={() => handleDateClick(day)} >
              <RangeBackground
                $inRange={isInRange(day)}
                $isStart={isStart}
                $isEnd={isEnd}
                $dayIndex={dayIndexInWeek(day)}
              >
                {day}
              </RangeBackground>

              {(isStart || isEnd) && (
                <EdgeCircle
                  $isRed={isSunday(day)}
                  $isBlue={isToday(day)}
                >
                  {day}
                </EdgeCircle>
              )}
            </DateCell>

          );
        })}
      </CalendarGrid>
    </Container>
  );
};

export default Calendar;

const Container = styled.div`
  margin: auto 0px;
  padding: 0 20px;
`;

const Header = styled.div`
  display: flex;
  padding: 16px 0px 16px 16px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;

  button {
    padding: 4px 8px;
    cursor: pointer;
    background-color: var(--white);
    border: 0;
    font-weight: bold;
  }
`;

const MonthLabel = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 14px;
`;

const Weekday = styled.div`
  text-align: center;
  font-weight: 600;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const EmptyCell = styled.div``;

const DateCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const RangeBackground = styled.div<{ 
  $inRange: boolean;
  $isStart: boolean; 
  $isEnd: boolean;
  $dayIndex: number; 
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ $inRange }) => ($inRange ? "100%" : "40px")};
  height: 40px;
  margin: 7px 0;
  border-radius: ${({ $inRange, $dayIndex }) => {
    if ($inRange) {
      if ($dayIndex === 0) return "50% 0 0 50%";   // 왼 둥글
      if ($dayIndex === 6) return "0 50% 50% 0";   // 오 둥글
      return "0"; // 중간
    }
    return "unset";
  }};
  background-color: ${({ $inRange }) => ($inRange ? "#ffe3d3" : "transparent")};
  cursor: pointer;
  position: relative;
  z-index: 0;
  clip-path: ${({ $isStart, $isEnd }) => {
    if ($isStart) return "inset(0 0 0 50%)"; // 왼쪽 절반 자름
    else if ($isEnd) return "inset(0 50% 0 0)"; // 오른쪽 절반 자름
    else return "0";
  }};
`;

const EdgeCircle = styled.div<{ $isRed: boolean; $isBlue: boolean }>`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--main-pri);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  color: ${({ $isBlue, $isRed }) => $isBlue ? "#80A8DD" : $isRed ? "#A81125" : "white"};
  z-index: 1;
  cursor: pointer;
`;
