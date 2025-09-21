import SalguItem from "./SalguItem.tsx";
import styled from "styled-components";
import { addDays, format, parseISO } from "date-fns";

type Props = {
  logId: number;
  startDate: string;
  endDate: string;
  onItemClick: (date: string) => void | Promise<void>;
  isOwner: boolean;
};

const LogEntryList: React.FC<Props> = ({
  logId,
  startDate,
  endDate,
  onItemClick,
  isOwner,
}) => {
  // 안전한 ISO 파싱
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  const dateArray: string[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) {
    dateArray.push(format(d, "yyyy-MM-dd"));
  }

  return (
    <Container>
      {dateArray.map((date) => (
        <SalguItem
          key={date}
          isoDate={date}
          logId={logId}
          onClick={() => onItemClick(date)}
          isOwner={isOwner}
        />
      ))}
    </Container>
  );
};

export default LogEntryList;

const Container = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 16px 20px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
`;
