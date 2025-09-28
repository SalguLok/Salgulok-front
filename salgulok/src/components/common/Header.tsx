import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BackButton from "../../assets/common/back_button.svg";

interface HeaderProps {
  title: string;
  showBackButton?: boolean; // 뒤로가기 버튼
  rightButton?: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false, rightButton }) => {
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
        {rightButton ? (
          <RightButton
            onClick={rightButton.onClick}
            disabled={rightButton.disabled}
          >
            {rightButton.text}
          </RightButton>
        ) : (
          <Spacer />
        )}
      </HeaderWrapper>

      <HeaderSpacer />
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
  padding: 28px 20px 8px 20px;
  box-sizing: border-box;
  background-color: var(--white);
  height: 52px;
  z-index: 1000;
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
  font-weight: 600;
`;

const Spacer = styled.div`
  width: 9px;
`;

const RightButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 16px;
  color: var(--main-pri);
  font-weight: 600;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HeaderSpacer = styled.div`
  height: 52px;
`;
