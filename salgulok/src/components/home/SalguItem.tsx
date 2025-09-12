import styled from "styled-components";
import type { FC } from "react";
import SalguOff from "../../assets/common/salgu_off.svg";
import Salgu from "../../assets/common/salgu.svg";
import SalguPlus from "../../assets/common/salgu_plus.svg";

type Props = {
  date?: string;
  hasLog: "yes" | "no";
  onClick?: () => void;
  forceOff?: boolean;
};

const SalguItem: FC<Props> = ({
  date = "00/00",
  hasLog,
  onClick,
  forceOff,
}) => {
  const iconSrc = forceOff ? SalguOff : hasLog === "yes" ? Salgu : SalguPlus;
  const alt = forceOff
    ? "살구로그 비활성"
    : hasLog === "yes"
    ? "살구로그 있음"
    : "살구로그 없음";

  return (
    <Layout onClick={onClick} role={onClick ? "button" : undefined}>
      <Icon src={iconSrc} alt={alt} />
      <Date>{date}</Date>
    </Layout>
  );
};

export default SalguItem;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;
const Icon = styled.img`
  width: 41px;
  height: 46px;
`;
const Date = styled.span`
  font-size: 11px;
  color: var(--gray-400);
`;
