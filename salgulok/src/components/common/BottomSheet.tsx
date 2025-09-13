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
  z-index: 999;

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
  z-index: 1000;

  @media (max-width: ${APP_W}px) {
    left: 0; transform: none; width: 100vw;
  }
`;
const Title = styled.h3`
  margin: 20px 20px 8px; font-size: 18px; font-weight: 700;
`;
const Content = styled.div`
  padding: 8px 20px 0; overflow: auto;
`;
const Footer = styled.div`
  padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
`;
const Primary = styled.button`
  width: 100%; height: 52px; border: 0; border-radius: 14px;
  background: var(--main-pri); color: #fff; font-size: 17px; font-weight: 600;
  &:disabled { opacity: .4; }
`;
