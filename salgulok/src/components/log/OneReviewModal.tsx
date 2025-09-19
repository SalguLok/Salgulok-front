import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "../common/TextInput";
import { saveEntrySummary } from "../../api/logEntry/saveEntrySummary";

type ConfirmModalProps = {
  open: boolean;
  logId: number;
  entryId: number;
  message?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  defaultValue?: string;
  onCancel: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  logId,
  entryId,
  message,
  placeholder = "하루의 마무리 멘트를 작성해주세요.",
  confirmText = "등록하기",
  cancelText = "건너뛰기",
  loading = false,
  defaultValue = "",
  onCancel,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await saveEntrySummary(logId, entryId, value); 
      console.log("요약 저장 성공:", value);
      setValue("");
      onCancel(); // 닫기
    } catch (error) {
      console.error("요약 저장 실패:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout onClick={onCancel}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {message && <Message>{message}</Message>}

        <InputWrapper>
          <TextInput
            variant="md"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </InputWrapper>

        <ButtonContainer>
          <CancelButton type="button" onClick={onCancel} disabled={submitting || loading}>
            {cancelText}
          </CancelButton>
          <ConfirmButton type="button" onClick={handleConfirm} disabled={submitting || loading}>
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
  width: 280px;
  min-height: 180px;
  background: var(--white);
  border-radius: 12px;
  padding: 20px;
`;

const Message = styled.p`
  margin: 0 0 16px;
  font-size: 16px;
  color: var(--black);
`;

const InputWrapper = styled.div`
  margin-bottom: 16px;
  flex: 1;

  textarea {
    width: 100%;
  }
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
  color: var(--main-pri);
`;
