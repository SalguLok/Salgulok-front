import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BackButton from "../../assets/common/back_button.svg";

interface HeaderProps {
  title: string;
  showBackButton?: boolean; // 뒤로가기 버튼
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const navigate = useNavigate();

  return (
    <>
      <HeaderWrapper>
        {showBackButton ? (
          <IconButton onClick={() => navigate(-1)}>
            <img src={BackButton} alt="뒤로가기" />
          </IconButton>
          ) : (
          <Spacer />
        )}

        <Title>{title}</Title>
        <Spacer /> 
      </HeaderWrapper>

      <HeaderSpacer/>
    </>
  );
};

export default Header;

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  width: 375px;           
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 20px 0px 20px;
  box-sizing: border-box;
  height: 44px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;

  img {
    width: 9px;
    height: auto;
  }
`;

const Title = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 16px;
  padding: 0;
  margin: 0;
  font-weight: 600px;
`;

const Spacer = styled.div`
  width: 9px;
`;

const HeaderSpacer = styled.div`
  height: 44px;
`;