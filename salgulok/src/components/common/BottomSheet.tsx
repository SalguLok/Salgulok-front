// components/common/BottomSheet.tsx
import { createPortal } from "react-dom";
import { useEffect } from "react";
import styled from "styled-components";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  primaryLabel?: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  children: React.ReactNode;
};

const BottomSheet = ({ open, title, onClose, primaryLabel="다음", onPrimary, primaryDisabled, children }: Props) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <>
      <Backdrop onClick={onClose} />
      <Sheet role="dialog" aria-modal="true">
        {title && <Title>{title}</Title>}
        <Content>{children}</Content>
        <Footer>
          <Primary disabled={!!primaryDisabled} onClick={onPrimary}>
            {primaryLabel}
          </Primary>
        </Footer>
      </Sheet>
    </>,
    document.body
  );
};

export default BottomSheet;

const APP_W = 375; // 폰 프레임 너비(px)

// 회색 백드롭을 폰 프레임 폭만큼만
const Backdrop = styled.div`
  position: fixed;
  top: 0; bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: ${APP_W}px;
  max-width: 100vw;          /* 좁은 화면에선 뷰포트에 맞추기 */
  background: rgba(0,0,0,0.45);
  z-index: 1100;

  @media (max-width: ${APP_W}px) {
    left: 0; transform: none; width: 100vw;
  }
`;
// 시트도 동일하게 중앙 정렬 + 폭 제한
const Sheet = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: ${APP_W}px;
  max-width: 100vw;
  background: #fff;
  border-radius: 18px 18px 0 0;
  max-height: 85dvh;
  display: flex;
  flex-direction: column;
  z-index: 1200;

  @media (max-width: ${APP_W}px) {
    left: 0; transform: none; width: 100vw;
  }
`;
const Title = styled.h3`
  margin: 28px 24px 8px; 
  font-size: 16px; 
  font-weight: 600;
  font-family: 'Pretendard', sans-serif;
`;
const Content = styled.div`
  padding: 9px 21px 0; 
  overflow: auto;
  font-family: 'Pretendard', sans-serif;
  font-color: var(--gray-500);
`;
const Footer = styled.div`
  padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
  display: flex;
  justify-content: center;
`;
const Primary = styled.button`
  width: 100%; 
  height: 48px; 
  border: 0; 
  border-radius: 10px;
  background: var(--main-pri); 
  color: #fff; 
  font-size: 16px; 
  font-weight: 500;
  font-family: 'Pretendard', sans-serif;
  &:disabled { opacity: .4; }
`;