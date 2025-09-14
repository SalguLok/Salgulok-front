import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BackButton from "../../assets/common/back_button.svg";

interface HeaderProps {
  title: string;
}

const HeaderLeft: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <HeaderWrapper>
      <Title>{title}</Title>
    </HeaderWrapper>
  );
};

export default HeaderLeft;

const HeaderWrapper = styled.header`
  display: flex;
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
