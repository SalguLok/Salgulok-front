import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  right?: React.ReactNode;
}

const HeaderLeft: React.FC<HeaderProps> = ({ title, right }) => {
  const navigate = useNavigate();

  return (
    <HeaderWrapper>
      <Title>{title}</Title>
      {right ? <RightSlot>{right}</RightSlot> : <RightSlot />}
    </HeaderWrapper>
  );
};

export default HeaderLeft;

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 28px 20px 0px 20px;
  box-sizing: border-box;
  height: 44px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 16px;
  padding: 0;
  margin: 0;
  font-weight: 600px;
`;
const RightSlot = styled.div`
  cursor: pointer;
`;
