import React from "react";
import styled from "styled-components";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  showCancel?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  message,
  confirmText = "확인",
  cancelText = "취소",
  loading = false,
  showCancel = true,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <Layout onClick={onCancel}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {message && <Message>{message}</Message>}
        <ButtonContainer>
          {showCancel && (
            <CancelButton type="button" onClick={onCancel} disabled={loading}>
              {cancelText}
            </CancelButton>
          )}
          <ConfirmButton type="button" onClick={onConfirm} disabled={loading}>
            {confirmText}
          </ConfirmButton>
        </ButtonContainer>
      </ModalContainer>
    </Layout>
  );
};

export default ConfirmModal;

const Layout = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 200px;
  height: 80px;
  background: var(--white);
  border-radius: 12px;
  padding: 25px;
`;

const Message = styled.p`
  margin: 0 0 16px;
  font-size: 16px;
  color: var(--black);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const CancelButton = styled.button`
  height: 36px;
  border-radius: 8px;
  background-color: var(--white);
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: var(--gray-500);
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ConfirmButton = styled(CancelButton)`
  border: none;
  color: var(--main-pri);
  background-color: var(--white);
  font-size: 16px;
`;
