import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  right?: React.ReactNode;
}

const HeaderLeft: React.FC<HeaderProps> = ({ title, right }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 스크롤이 맨 위에 있으면 항상 헤더를 보이게 함
      if (currentScrollY <= 0) {
        setIsVisible(true);
        return;
      }

      // 스크롤 중이면 헤더 숨김
      setIsVisible(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <HeaderWrapper $isVisible={isVisible}>
        <Title>{title}</Title>
        {right ? <RightSlot>{right}</RightSlot> : <RightSlot />}
      </HeaderWrapper>

      <HeaderSpacer/>
    </>
  );
};

export default HeaderLeft;

const HeaderWrapper = styled.header<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  width: 375px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 28px 20px 8px 20px;
  box-sizing: border-box;
  height: 52px;
  background-color: var(--white);
  z-index: 1000;
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

const HeaderSpacer = styled.div`
  height: 52px;
`;