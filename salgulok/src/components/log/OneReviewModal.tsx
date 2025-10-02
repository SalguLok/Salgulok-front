import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "../common/TextInput";
import { updateReview } from "../../api/log/updateReview";
import { updateUploadStatus } from "../../api/log/updateUploadStatus";

type ConfirmModalProps = {
  open: boolean;
  logId: number;
  message?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  defaultValue?: string;
  onCancel: () => void;
  onSuccess: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  logId,
  message,
  placeholder = "로그의 한 줄평을 작성해주세요.",
  confirmText = "등록하기",
  cancelText = "건너뛰기",
  loading = false,
  defaultValue = "",
  onCancel,
  onSuccess,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      // 1. 한줄평 업데이트
      await updateReview(logId, { oneReview: value });
      // 2. 업로드 상태 변경
      await updateUploadStatus(logId, { isUpload: true });
      
      setValue("");
      onSuccess(); // 성공 콜백 호출
    } catch (error) {
      console.error("로그 등록 실패:", error);
      // 여기에 사용자에게 에러를 알려주는 로직을 추가할 수 있습니다.
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
